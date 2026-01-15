import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { productCreateSchema } from "@/lib/validators/product";
import { verifyToken } from "@/lib/auth/jwt";

/**
 * Extract userId from Authorization header
 */
function getUserIdFromRequest(req: Request): string {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = authHeader.split(" ")[1];
  if (!token) {
    throw new Error("UNAUTHORIZED");
  }

  const payload = verifyToken(token);
  return payload.userId;
}

/**
 * POST /api/products
 * Create product
 */
export async function POST(req: Request) {
  try {
    const userId = getUserIdFromRequest(req);
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
    const userId = getUserIdFromRequest(req);

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

    return NextResponse.json(products, { status: 200 });
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
