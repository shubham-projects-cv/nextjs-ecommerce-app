"use client";

import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";
import { getToken } from "@/lib/auth/token";

export default function AuthGuard({ children }: { children: ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const token = getToken();
    if (!token) {
      router.replace("/auth/login");
    }
  }, [router]);

  return <>{children}</>;
}
