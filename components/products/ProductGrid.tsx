import ProductCard from "./ProductCard";
import { Product } from "@/lib/types/product";

export default function ProductGrid({ products }: { products: Product[] }) {
  if (!products.length) {
    return <p className="text-gray-500">No products yet.</p>;
  }

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((p) => (
        <ProductCard key={p._id} product={p} />
      ))}
    </div>
  );
}
