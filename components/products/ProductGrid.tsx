import ProductCard from "./ProductCard";
import { Product } from "@/lib/types/product";

interface Props {
  products: Product[];
  onDelete: (id: string) => void;
}

export default function ProductGrid({ products, onDelete }: Props) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {products.map((product) => (
        <ProductCard key={product._id} product={product} onDelete={onDelete} />
      ))}
    </div>
  );
}
