"use client";

import { getToken } from "@/lib/auth/token";
import { Product } from "@/lib/types/product";
import { useRouter } from "next/navigation";

interface Props {
  product: Product;
  onDelete: (id: string) => void;
}

export default function ProductCard({ product, onDelete }: Props) {
  const router = useRouter();

  async function deleteProduct() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product?"
    );
    if (!confirmed) return;

    const token = getToken();
    if (!token) {
      alert("Unauthorized");
      return;
    }

    try {
      const res = await fetch(`/api/products/${product._id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.message || "Delete failed");
      }

      // ✅ instant UI update (NO refresh)
      onDelete(product._id);
    } catch (error: unknown) {
      if (error instanceof Error) {
        alert(error.message);
      } else {
        alert("Something went wrong");
      }
    }
  }

  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm transition hover:shadow-md">
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-2 font-semibold">₹ {product.price}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => router.push(`/products/${product._id}/edit`)}
          className="flex-1 rounded-md border py-1 text-sm hover:bg-gray-50"
        >
          Edit
        </button>
        <button
          onClick={deleteProduct}
          className="flex-1 rounded-md border border-red-500 py-1 text-sm text-red-600 hover:bg-red-50"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
