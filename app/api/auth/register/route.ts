import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/User";
import { registerSchema } from "@/lib/validators/auth";
import { hashPassword } from "@/lib/auth/hash";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate request body
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) {
      const error = parsed.error.issues[0];
      return NextResponse.json(
        { message: error.message, field: error.path[0] },
        { status: 400 }
      );
    }

    const { name, email, password } = parsed.data;

    // 2. Connect DB
    await connectDB();

    // 3. Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { message: "Email already registered", field: "email" },
        { status: 409 }
      );
    }

    // 4. Hash password
    const hashedPassword = await hashPassword(password);

    // 5. Create user
    await User.create({
      name,
      email,
      password: hashedPassword,
    });

    return NextResponse.json(
      { message: "User registered successfully" },
      { status: 201 }
    );
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
