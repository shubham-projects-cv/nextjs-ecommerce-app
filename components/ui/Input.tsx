"use client";

import { InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
};

export default function Input({ label, ...props }: InputProps) {
  return (
    <div className="space-y-1">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <input
        {...props}
        className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}
