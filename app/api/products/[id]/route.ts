import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { verifyToken } from "@/lib/auth/jwt";

function getUserId(req: Request): string {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }
  return verifyToken(auth.split(" ")[1]).userId;
}

/**
 * GET product by id
 */
export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(req);
    await connectDB();

    const product = await Product.findOne({
      _id: params.id,
      userId,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("GET PRODUCT ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * UPDATE product
 */
export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(req);
    const body = await req.json();

    await connectDB();

    const product = await Product.findOneAndUpdate(
      { _id: params.id, userId },
      body,
      { new: true }
    );

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("UPDATE PRODUCT ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE product
 */
export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const userId = getUserId(req);
    await connectDB();

    const product = await Product.findOneAndDelete({
      _id: params.id,
      userId,
    });

    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted successfully" });
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("DELETE PRODUCT ERROR:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
