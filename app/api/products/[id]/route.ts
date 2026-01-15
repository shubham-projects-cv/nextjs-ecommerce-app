import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { productUpdateSchema } from "@/lib/validators/product";
import { verifyToken } from "@/lib/auth/jwt";

function getUserId(req: Request): string {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }
  return verifyToken(auth.split(" ")[1]).userId;
}

/**
 * UPDATE PRODUCT
 * PUT /api/products/:id
 */
export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const userId = getUserId(req);
    const body = await req.json();

    const parsed = productUpdateSchema.safeParse(body);
    if (!parsed.success) {
      const issue = parsed.error.issues[0];
      return NextResponse.json(
        { message: issue.message, field: issue.path[0] },
        { status: 400 }
      );
    }

    await connectDB();

    const updated = await Product.findOneAndUpdate(
      { _id: id, userId },
      parsed.data,
      { new: true }
    );

    if (!updated) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(updated);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE PRODUCT
 * DELETE /api/products/:id
 */
export async function DELETE(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const userId = getUserId(req);
    const { id } = await params;

    await connectDB();

    const deleted = await Product.findOneAndDelete({
      _id: id,
      userId,
    });

    if (!deleted) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: "Product deleted" });
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
