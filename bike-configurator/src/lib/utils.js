import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Merge Tailwind class names safely, resolving conflicts (shadcn convention).
 */
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}

/**
 * Format a number (in dollars) as USD currency, e.g. 1234.5 -> "$1,234.50"
 */
export function formatCurrency(amount) {
  const sign = amount < 0 ? "-" : "";
  return `${sign}$${Math.abs(amount).toLocaleString("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Format a price delta with explicit sign, e.g. +$120.00 / included
 */
export function formatDelta(amount) {
  if (amount === 0) return "Included";
  const sign = amount > 0 ? "+" : "−";
  return `${sign}${formatCurrency(Math.abs(amount)).replace("$", "$")}`;
}
