"use client";

import { cn } from "@/lib/utils";

interface CombinatorToggleProps {
  value: "AND" | "OR";
  onChange: (c: "AND" | "OR") => void;
}

const CombinatorToggle = ({ value, onChange }: CombinatorToggleProps) => {
  return (
    <div
      className="relative inline-flex shrink-0 rounded-[8px] border border-border bg-surface-2 p-0.75"
      role="group"
      aria-label="Combinator"
    >
      <span
        className={cn(
          "qf-combinator-slider absolute bottom-0.75 top-0.75 w-[calc(50%-3px)] rounded-sm",
          value === "AND" ? "translate-x-0 bg-and" : "translate-x-full bg-or",
        )}
      />
      {(["AND", "OR"] as const).map((k) => (
        <button
          key={k}
          type="button"
          className={cn(
            "relative z-1 h-5.5 min-w-10.5 rounded-sm font-jetbrains-mono text-[11px] font-bold tracking-[0.6px] transition-colors",
            value === k ? "text-white" : "text-faint",
          )}
          onClick={() => onChange(k)}
        >
          {k}
        </button>
      ))}
    </div>
  );
};

export default CombinatorToggle;
