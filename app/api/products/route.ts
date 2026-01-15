import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { productCreateSchema } from "@/lib/validators/product";
import { verifyToken } from "@/lib/auth/jwt";

function getUserId(req: Request): string {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }
  return verifyToken(auth.split(" ")[1]).userId;
}

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    await connectDB();

    const products = await Product.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (error) {
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

    return NextResponse.json(product, { status: 201 });
  } catch (error) {
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
