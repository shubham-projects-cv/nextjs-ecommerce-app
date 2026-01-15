import { NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/User";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const token = typeof body.token === "string" ? body.token.trim() : null;
    const password = typeof body.password === "string" ? body.password : null;

    if (!token || !password) {
      return NextResponse.json(
        { message: "Token and password are required" },
        { status: 400 }
      );
    }

    await connectDB();

    // hash incoming token
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

    const user = await User.findOne({
      resetPasswordToken: hashedToken,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      return NextResponse.json(
        { message: "Token is invalid or expired" },
        { status: 400 }
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    user.password = hashedPassword;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;

    await user.save();

    return NextResponse.json({ message: "Password reset successful" });
  } catch (err: unknown) {
    console.error("RESET PASSWORD ERROR:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
