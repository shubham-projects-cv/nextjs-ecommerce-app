"use client";

import { useRouter } from "next/navigation";
import { clearToken } from "@/lib/auth/token";

export default function LogoutButton() {
  const router = useRouter();

  function logout() {
    clearToken();
    router.replace("/auth/login");
  }

  return (
    <button
      onClick={logout}
      className="rounded-md border px-3 py-1 text-sm hover:bg-gray-100"
    >
      Logout
    </button>
  );
}
