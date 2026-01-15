"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useState } from "react";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!token) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
        <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
          <p className="text-center text-red-600">Invalid or missing token</p>
        </div>
      </div>
    );
  }

  async function submit() {
    setError(null);

    if (password.length < 6) {
      setError("Password must be at least 6 characters");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Reset failed");
      }

      setSuccess(true);

      setTimeout(() => {
        router.replace("/auth/login");
      }, 2000);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 p-4">
      <div className="w-full max-w-md rounded-lg bg-white p-6 shadow">
        <h1 className="mb-4 text-center text-xl font-semibold">
          Reset Password
        </h1>

        {error && (
          <div className="mb-3 rounded bg-red-50 p-2 text-sm text-red-600">
            {error}
          </div>
        )}

        {success ? (
          <div className="rounded bg-green-50 p-3 text-center text-green-700">
            Password reset successful. Redirecting to login…
          </div>
        ) : (
          <div className="space-y-3">
            <Input
              label="New Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />

            <Input
              label="Confirm Password"
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />

            <Button onClick={submit} disabled={loading}>
              {loading ? "Resetting…" : "Reset Password"}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
