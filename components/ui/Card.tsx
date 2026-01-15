import { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
}

export default function Card({ children }: CardProps) {
  return (
    <div className="rounded-xl border bg-white p-4 shadow-sm">{children}</div>
  );
}
