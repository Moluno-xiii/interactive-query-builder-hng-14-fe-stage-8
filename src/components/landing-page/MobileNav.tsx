"use client";

import { useEffect } from "react";
import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import AppButton from "@/components/ui/app-button";
import { cn } from "@/lib/utils";
import { PiArrowBendUpRightFill, PiX } from "react-icons/pi";
import { NAV_LINKS } from "@/constants";

interface MobileNavProps {
  open: boolean;
  onClose: () => void;
}

const MobileNav = ({ open, onClose }: MobileNavProps) => {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  return (
    <div className="sm:hidden">
      <div
        onClick={onClose}
        aria-hidden
        className={cn(
          "fixed inset-0 z-40 bg-[color-mix(in_oklch,var(--bg)_60%,transparent)] backdrop-blur-[3px] transition-opacity duration-300",
          open ? "opacity-100" : "pointer-events-none opacity-0",
        )}
      />
      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Navigation menu"
        className={cn(
          "fixed inset-y-0 left-0 z-50 flex w-[min(82vw,320px)] flex-col border-r border-border bg-surface shadow-lg transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "-translate-x-full",
        )}
      >
        <div className="flex items-center justify-between border-b border-border-soft px-4 py-3">
          <AppIcon />
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="grid size-8 place-items-center rounded-md text-faint transition hover:bg-surface-2 hover:text-foreground"
          >
            <PiX size={18} />
          </button>
        </div>

        <nav className="flex flex-col gap-1 p-3">
          {NAV_LINKS.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              onClick={onClose}
              className="rounded-md px-3 py-2.5 text-[14px] font-medium text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
            >
              {l.label}
            </Link>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-soft p-4">
          <ThemeSwitcher />
          <AppButton asChild>
            <Link href="/build-query">
              Open builder
              <PiArrowBendUpRightFill size={14} />
            </Link>
          </AppButton>
        </div>
      </aside>
    </div>
  );
};

export default MobileNav;
