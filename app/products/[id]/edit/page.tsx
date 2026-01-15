"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Input from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { getToken } from "@/lib/auth/token";

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    stock: "",
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const token = getToken();
        if (!token) {
          router.replace("/auth/login");
          return;
        }

        const res = await fetch(`/api/products/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (res.status === 401) {
          throw new Error("Unauthorized. Please login again.");
        }

        if (res.status === 404) {
          throw new Error("Product not found or access denied.");
        }

        if (!res.ok) {
          throw new Error("Something went wrong while fetching product.");
        }

        const data = await res.json();

        setForm({
          name: data.name,
          description: data.description || "",
          price: String(data.price),
          category: data.category,
          stock: String(data.stock),
        });
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Unexpected error occurred");
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id, router]);

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      const token = getToken();
      if (!token) {
        router.replace("/auth/login");
        return;
      }

      const res = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...form,
          price: Number(form.price),
          stock: Number(form.stock),
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Update failed");
      }

      router.push("/dashboard");
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message);
      else setError("Update failed");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <p className="p-6 text-center">Loading product…</p>;
  }

  return (
    <div className="mx-auto max-w-lg p-4">
      <h1 className="mb-4 text-xl font-semibold text-center">Edit Product</h1>

      {error && (
        <div className="mb-4 rounded bg-red-50 p-3 text-sm text-red-600">
          {error}
        </div>
      )}

      <div className="space-y-3">
        <Input
          label="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />

        <Input
          label="Description"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
        />

        <Input
          label="Price"
          type="number"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
        />

        <Input
          label="Category"
          value={form.category}
          onChange={(e) => setForm({ ...form, category: e.target.value })}
        />

        <Input
          label="Stock"
          type="number"
          value={form.stock}
          onChange={(e) => setForm({ ...form, stock: e.target.value })}
        />

        <Button onClick={submit} disabled={loading}>
          {loading ? "Updating…" : "Update Product"}
        </Button>
      </div>
    </div>
  );
}
