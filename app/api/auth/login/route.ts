import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/User";
import { loginSchema } from "@/lib/validators/auth";
import { comparePassword } from "@/lib/auth/hash";
import { signToken } from "@/lib/auth/jwt";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate request
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      const error = parsed.error.issues[0];
      return NextResponse.json(
        { message: error.message, field: error.path[0] },
        { status: 400 }
      );
    }

    const { email, password } = parsed.data;

    // 2. Connect DB
    await connectDB();

    // 3. Find user (include password explicitly)
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return NextResponse.json(
        { message: "Invalid email or password", field: "email" },
        { status: 401 }
      );
    }

    // 4. Compare password
    const isMatch = await comparePassword(password, user.password);
    if (!isMatch) {
      return NextResponse.json(
        { message: "Invalid email or password", field: "password" },
        { status: 401 }
      );
    }

    // 5. Generate JWT
    const token = signToken({
      userId: user._id.toString(),
      email: user.email,
    });

    // 6. Return response
    return NextResponse.json(
      {
        token,
        user: {
          id: user._id,
          name: user.name,
          email: user.email,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
