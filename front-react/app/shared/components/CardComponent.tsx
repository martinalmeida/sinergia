import { useDarkMode } from "@shared/hooks/useDarkMode";
import React from "react";

type StatsCardProps = {
  title?: string;
  value?: React.ReactNode;
  accentColor?: string;
  className?: string;
  children?: React.ReactNode;
};

function adjustHexBrightness(hex: string, factor: number) {
  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(hex);
  if (!isHex) return hex;

  let h = hex.slice(1);
  if (h.length === 3) {
    h = h
      .split("")
      .map((c) => c + c)
      .join("");
  }

  const r = Math.round(
    Math.min(255, Math.max(0, parseInt(h.slice(0, 2), 16) * factor))
  );
  const g = Math.round(
    Math.min(255, Math.max(0, parseInt(h.slice(2, 4), 16) * factor))
  );
  const b = Math.round(
    Math.min(255, Math.max(0, parseInt(h.slice(4, 6), 16) * factor))
  );

  const toHex = (n: number) => n.toString(16).padStart(2, "0");
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function CardComponent({
  title,
  value,
  accentColor = "#273459",
  className = "",
  children,
}: StatsCardProps) {
  const { darkMode, isMounted } = useDarkMode();

  const mountedAndDark = isMounted && darkMode;
  const accentForMode = mountedAndDark
    ? adjustHexBrightness(accentColor, 1.25)
    : accentColor;

  const style: React.CSSProperties & { ["--accent"]?: string } = {
    borderLeft: `4px solid ${accentForMode}`,
    ["--accent"]: accentForMode,
  };

  return (
    <div
      className={
        "bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md transform transition duration-200 ease-in-out hover:-translate-y-1 hover:scale-[1.01] hover:shadow-lg focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 " +
        "text-gray-900 dark:text-gray-200 " +
        className
      }
      style={style}
      tabIndex={0}
      role="group"
      aria-label={
        children ? undefined : `${title ?? ""} — ${String(value ?? "")}`
      }
    >
      {children ? (
        children
      ) : (
        <>
          <h3 className="text-sm font-medium text-gray-600 dark:text-gray-300">
            {title}
          </h3>
          <p className="mt-2 text-3xl font-semibold text-gray-900 dark:text-gray-100">
            {value}
          </p>
        </>
      )}
    </div>
  );
}