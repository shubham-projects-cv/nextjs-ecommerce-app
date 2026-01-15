/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products for logged-in user
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of products
 *   post:
 *     summary: Create a new product
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - price
 *               - category
 *               - stock
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category:
 *                 type: string
 *               stock:
 *                 type: number
 *     responses:
 *       201:
 *         description: Product created
 *       400:
 *         description: Validation error
 *       401:
 *         description: Unauthorized
 */

import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { productCreateSchema } from "@/lib/validators/product";
import { verifyToken } from "@/lib/auth/jwt";
import { publishEvent } from "@/lib/kafka/producer";
import { indexProduct } from "@/lib/elastic/products";

/**
 * Extract userId from Authorization header
 */
function getUserId(req: Request): string {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = auth.split(" ")[1];
  return verifyToken(token).userId;
}

/**
 * POST /api/products
 * Create product + publish Kafka event
 */
export async function POST(req: Request) {
  try {
    const userId = getUserId(req);
    const body = await req.json();

    const parsed = productCreateSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { message: issue.message, field: issue.path[0] },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      ...parsed.data,
      userId,
    });

    // 🔔 Kafka event
    await publishEvent("product-events", {
      type: "PRODUCT_CREATED",
      productId: product._id.toString(),
      userId,
    });

    await indexProduct(product.toObject());

    return NextResponse.json(product, { status: 201 });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Create product error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * GET /api/products
 * List user products
 */
export async function GET(req: Request) {
  try {
    const userId = getUserId(req);

    const { searchParams } = new URL(req.url);
    const page = Number(searchParams.get("page") || 1);
    const limit = Number(searchParams.get("limit") || 10);
    const skip = (page - 1) * limit;

    await connectDB();

    const products = await Product.find({ userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    return NextResponse.json(products);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Fetch products error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
