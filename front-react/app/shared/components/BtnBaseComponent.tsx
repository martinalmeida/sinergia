import React from "react";

type Variant = "primary" | "secondary" | "white";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  label?: string;
  icon?: React.ReactNode;
  variant?: Variant;
}

export default function BtnBaseComponent({
  label,
  icon,
  variant = "primary",
  className,
  disabled,
  ...rest
}: Props) {
  const isPrimary = variant === "primary";
  const isWhite = variant === "white";

  const variantClasses = isPrimary
    ? "bg-[#273459] border-[#273459] text-white hover:bg-[#2e3e69]"
    : isWhite
      ? "bg-white border-[#273459] text-[#273459] hover:bg-[#f8fafc] dark:bg-gray-800 dark:border-gray-600 dark:text-gray-400 dark:hover:bg-gray-700"
      : "bg-slate-100 border-slate-600 text-slate-600 hover:bg-slate-200";

  const base =
  "px-4 h-9 w-full flex items-center justify-center gap-2 rounded-xl border font-semibold transition-transform duration-150 ease-out active:scale-95 disabled:opacity-50";

  return (
    <button
      {...rest}
      type={rest.type ?? "button"}
      disabled={disabled}
      aria-disabled={disabled}
      className={`${base} ${variantClasses} ${className ?? ""}`}
    >
      {icon && <span className="flex items-center justify-center">{icon}</span>}
      {label && (
        <span className="flex items-center justify-center text-nowrap">{label}</span>
      )}
    </button>
  );
}