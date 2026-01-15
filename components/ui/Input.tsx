type Props = {
  label: string;
  error?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function Input({ label, error, ...props }: Props) {
  return (
    <div className="space-y-1">
      <label className="text-sm font-medium">{label}</label>
      <input
        {...props}
        className={`w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2
          ${
            error
              ? "border-red-500 ring-red-200"
              : "border-gray-300 ring-black/10"
          }
        `}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  );
}
