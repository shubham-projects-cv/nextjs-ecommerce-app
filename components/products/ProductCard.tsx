"use client";

import { Product } from "@/lib/types/product";
import { useRouter } from "next/navigation";

export default function ProductCard({ product }: { product: Product }) {
  const router = useRouter();

  async function deleteProduct() {
    await fetch(`/api/products/${product._id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });
    router.refresh();
  }

  return (
    <div className="rounded-xl border p-4 shadow-sm hover:shadow-md transition">
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-2 font-semibold">₹ {product.price}</p>

      <div className="mt-4 flex gap-2">
        <button
          onClick={() => router.push(`/products/${product._id}/edit`)}
          className="flex-1 rounded-md border py-1 text-sm"
        >
          Edit
        </button>
        <button
          onClick={deleteProduct}
          className="flex-1 rounded-md border border-red-500 text-red-500 py-1 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
