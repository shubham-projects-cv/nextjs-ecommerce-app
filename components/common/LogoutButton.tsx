"use client";

import { useRouter } from "next/navigation";
import { removeToken } from "@/lib/auth/token";

export default function LogoutButton() {
  const router = useRouter();

  function logout() {
    removeToken();
    router.replace("/auth/login");
  }

  return (
    <button
      onClick={logout}
      className="rounded-md border px-3 py-1 text-sm text-red-600 hover:bg-red-50"
    >
      Logout
    </button>
  );
}
