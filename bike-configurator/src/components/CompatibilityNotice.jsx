import React from "react";
import { AlertTriangle } from "lucide-react";

export default function CompatibilityNotice({ issues }) {
  if (!issues || issues.length === 0) return null;

  return (
    <div
      role="alert"
      className="flex items-start gap-3 rounded-md border border-rust/30 bg-rust/5 px-4 py-3 animate-fade-in"
    >
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-rust" />
      <div className="flex flex-col gap-1">
        <span className="text-sm font-medium text-rust-dark">
          {issues.length === 1 ? "Compatibility conflict" : `${issues.length} compatibility conflicts`}
        </span>
        <ul className="flex flex-col gap-0.5">
          {issues.map((issue) => (
            <li key={issue.key} className="text-xs text-espresso/80">
              {issue.message}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
