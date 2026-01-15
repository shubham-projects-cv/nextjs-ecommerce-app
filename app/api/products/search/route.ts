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
 * SEARCH PRODUCTS
 * GET /api/products/search
 */
export async function GET(req: Request) {
  try {
    const userId = getUserId(req);

    const { searchParams } = new URL(req.url);
    const keyword = searchParams.get("q");
    const category = searchParams.get("category");
    const minPrice = searchParams.get("minPrice");
    const maxPrice = searchParams.get("maxPrice");

    const query: {
      userId: string;
      category?: string;
      $or?: Array<Record<string, unknown>>;
      price?: {
        $gte?: number;
        $lte?: number;
      };
    } = { userId };

    // Keyword search
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { description: { $regex: keyword, $options: "i" } },
      ];
    }

    // Category filter
    if (category) {
      query.category = category;
    }

    // Price range
    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    await connectDB();

    const products = await Product.find(query).sort({ createdAt: -1 }).lean();

    return NextResponse.json(products);
  } catch (error: unknown) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    console.error("Search error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
