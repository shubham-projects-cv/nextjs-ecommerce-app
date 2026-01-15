"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { saveToken } from "@/lib/auth/token";

export default function LoginPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function submit() {
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Login failed");
      }

      saveToken(data.token);
      router.push("/dashboard");
    } catch (e) {
      if (e instanceof Error) {
        setError(e.message);
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="w-full max-w-sm rounded-xl border p-6 space-y-4">
        <h1 className="text-xl font-semibold text-center">Login</h1>

        {error && <p className="text-sm text-red-600 text-center">{error}</p>}

        <Input
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />

        <Input
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />

        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.push("/auth/forgot-password")}
            className="text-sm text-blue-600 hover:underline"
          >
            Forgot password?
          </button>
        </div>

        <Button onClick={submit} disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </Button>

        <p className="text-sm text-center text-gray-600">
          Don’t have an account?{" "}
          <button
            className="text-blue-600 hover:underline"
            onClick={() => router.push("/auth/register")}
          >
            Register
          </button>
        </p>
      </div>
    </div>
  );
}
