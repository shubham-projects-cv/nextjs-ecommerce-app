import { NextResponse } from "next/server";
import crypto from "crypto";
import { connectDB } from "@/lib/db/connect";
import User from "@/lib/models/User";
import { forgotPasswordSchema } from "@/lib/validators/auth";
import { sendEmail } from "@/lib/utils/sendEmail";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // 1. Validate input
    const parsed = forgotPasswordSchema.safeParse(body);
    if (!parsed.success) {
      const error = parsed.error.issues[0];
      return NextResponse.json(
        { message: error.message, field: error.path[0] },
        { status: 400 }
      );
    }

    const { email } = parsed.data;

    // 2. Connect DB
    await connectDB();

    // 3. Find user
    const user = await User.findOne({ email });
    if (!user) {
      // IMPORTANT: Do not reveal if email exists
      return NextResponse.json(
        { message: "If account exists, reset link sent" },
        { status: 200 }
      );
    }

    // 4. Generate reset token
    const resetToken = crypto.randomBytes(32).toString("hex");
    const hashedToken = crypto
      .createHash("sha256")
      .update(resetToken)
      .digest("hex");

    user.resetToken = hashedToken;
    user.resetTokenExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 min
    await user.save();

    // 5. Send email
    const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${resetToken}`;

    await sendEmail(
      user.email,
      "Password Reset",
      `
        <p>You requested a password reset.</p>
        <p>Click below (valid for 15 minutes):</p>
        <a href="${resetLink}">${resetLink}</a>
      `
    );

    return NextResponse.json(
      { message: "If account exists, reset link sent" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
