import { Product } from "@/lib/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <div className="rounded-xl border p-4 shadow-sm transition hover:shadow-md">
      <h3 className="font-medium">{product.name}</h3>
      <p className="text-sm text-gray-500">{product.category}</p>
      <p className="mt-2 font-semibold">₹ {product.price}</p>

      <div className="mt-4 flex gap-2">
        <button className="flex-1 rounded-md border py-1 text-sm">Edit</button>
        <button className="flex-1 rounded-md border border-red-500 text-red-500 py-1 text-sm">
          Delete
        </button>
      </div>
    </div>
  );
}
