import AuthGuard from "@/components/auth/AuthGuard";
import ProductGrid from "@/components/products/ProductGrid";
import LogoutButton from "@/components/common/LogoutButton";
import { getToken } from "@/lib/auth/token";
import { Product } from "@/lib/types/product";

async function getProducts(): Promise<Product[]> {
  const token = getToken();

  if (!token) return [];

  const res = await fetch("http://localhost:3000/api/products", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    cache: "no-store",
  });

  if (!res.ok) {
    return [];
  }

  return res.json();
}

export default async function DashboardPage() {
  const products = await getProducts();

  return (
    <AuthGuard>
      <main className="mx-auto max-w-6xl p-4 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-semibold">My Products</h1>
          <LogoutButton />
        </div>

        {/* Content */}
        {products.length === 0 ? (
          <div className="rounded-xl border p-6 text-center text-gray-500">
            No products found. Create your first product.
          </div>
        ) : (
          <ProductGrid products={products} />
        )}
      </main>
    </AuthGuard>
  );
}
