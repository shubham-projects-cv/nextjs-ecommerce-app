import { NextRequest, NextResponse } from "next/server";

/**
 * Proxy for protected API routes
 * (Edge runtime)
 */
export function proxy(req: NextRequest) {
  const authHeader = req.headers.get("authorization");

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/api/products/:path*"],
};
