"use client";

import { useEffect, useState } from "react";
import AuthGuard from "@/components/auth/AuthGuard";
import ProductGrid from "@/components/products/ProductGrid";
import LogoutButton from "@/components/common/LogoutButton";
import { getToken } from "@/lib/auth/token";
import { Product } from "@/lib/types/product";
import Link from "next/link";

export default function DashboardPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchProducts() {
      try {
        const token = getToken();
        if (!token) return;

        const res = await fetch("/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) {
          throw new Error("Failed to load products");
        }

        const data: Product[] = await res.json();
        setProducts(data);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message);
        else setError("Something went wrong");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p._id !== id));
  }

  return (
    <AuthGuard>
      <main className="mx-auto max-w-6xl p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Products</h1>

          <div className="flex items-center gap-3">
            <Link
              href="/products/create"
              className="rounded-md bg-blue-600 px-3 py-1.5 text-sm text-white hover:bg-blue-700"
            >
              + Create Product
            </Link>
            <LogoutButton />
          </div>
        </div>

        {/* States */}
        {loading && (
          <p className="text-center text-gray-500">Loading products…</p>
        )}

        {error && (
          <div className="rounded-md bg-red-50 p-3 text-red-600">{error}</div>
        )}

        {!loading && !error && products.length === 0 && (
          <div className="rounded-xl border bg-white p-6 text-center text-gray-500">
            No products yet. Create your first product.
          </div>
        )}

        {!loading && !error && products.length > 0 && (
          <ProductGrid products={products} onDelete={handleDelete} />
        )}
      </main>
    </AuthGuard>
  );
}
