import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface BrandMarkProps {
  size?: "md" | "sm";
  ghost?: boolean;
  icon: ReactNode;
}

const BrandMark = ({ size = "md", ghost, icon }: BrandMarkProps) => {
  return (
    <span
      className={cn(
        "grid place-items-center",
        size === "sm" ? "size-6 rounded-[7px]" : "size-7 rounded-lg",
        ghost
          ? "bg-surface-3 text-muted-foreground"
          : "bg-[linear-gradient(150deg,var(--accent),color-mix(in_oklch,var(--accent)_62%,var(--and)))] text-accent-foreground shadow-[0_2px_10px_-2px_var(--accent-dim),inset_0_1px_0_rgba(255,255,255,0.25)]",
      )}
    >
      {icon}
    </span>
  );
};

export default BrandMark;
