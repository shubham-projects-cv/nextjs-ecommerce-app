"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Request failed");
      }

      setMessage("If this email exists, a reset link has been sent.");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Forgot Password</h1>

        <p className="text-sm text-gray-600 text-center">
          Enter your email and we’ll send you a reset link.
        </p>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        {message && (
          <p className="text-sm text-green-600 text-center">{message}</p>
        )}

        <Input
          label="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <Button onClick={submit} disabled={loading}>
          {loading ? "Sending..." : "Send reset link"}
        </Button>

        <button
          className="block w-full text-center text-sm text-blue-600 hover:underline"
          onClick={() => router.push("/auth/login")}
        >
          Back to login
        </button>
      </div>
    </div>
  );
}
