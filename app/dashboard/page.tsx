"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import ProductGrid from "@/components/products/ProductGrid";
import LogoutButton from "@/components/common/LogoutButton";

export default function DashboardPage() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    api.get("/products").then((res) => setProducts(res.data));
  }, []);

  return (
    <div className="p-4 md:p-8">
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-2xl font-semibold">My Products</h1>
        <LogoutButton />
      </div>

      <ProductGrid products={products} />
    </div>
  );
}
