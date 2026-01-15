import { NextResponse } from "next/server";
import mongoose from "mongoose";
import { connectDB } from "@/lib/db/connect";
import Product from "@/lib/models/Product";
import { productCreateSchema } from "@/lib/validators/product";
import { verifyToken } from "@/lib/auth/jwt";

function getUserId(req: Request): mongoose.Types.ObjectId {
  const auth = req.headers.get("authorization");
  if (!auth || !auth.startsWith("Bearer ")) {
    throw new Error("UNAUTHORIZED");
  }

  const token = auth.split(" ")[1];
  const { userId } = verifyToken(token);
  return new mongoose.Types.ObjectId(userId);
}

export async function GET(req: Request) {
  try {
    const userId = getUserId(req);
    await connectDB();

    const products = await Product.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    return NextResponse.json(products);
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

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
      return NextResponse.json(
        { message: parsed.error.issues[0].message },
        { status: 400 }
      );
    }

    await connectDB();

    const product = await Product.create({
      ...parsed.data,
      userId,
    });

    return NextResponse.json(product, { status: 201 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      return NextResponse.json({ message: err.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
