"use client";

import { useEffect } from "react";
import type { IconType } from "react-icons";
import {
  PiBookmarkThin,
  PiClockCounterClockwiseThin,
  PiCodeLight,
  PiDatabase,
  PiX,
} from "react-icons/pi";
import { FaPlay } from "react-icons/fa6";
import AppIcon from "@/components/ui/AppIcon";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import AppButton from "@/components/ui/app-button";
import { cn } from "@/lib/utils";
import type { ModalKind } from "@/components/build-query";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";

interface BuilderMobileNavProps {
  open: boolean;
  onClose: () => void;
}

const NAV_ACTIONS: { modal: ModalKind; label: string; icon: IconType }[] = [
  { modal: "schema", label: "Data source", icon: PiDatabase },
  { modal: "history", label: "Query history", icon: PiClockCounterClockwiseThin },
  { modal: "presets", label: "Saved presets", icon: PiBookmarkThin },
  { modal: "io", label: "Import / export JSON", icon: PiCodeLight },
];

const BuilderMobileNav = ({ open, onClose }: BuilderMobileNavProps) => {
  const { run, setModal } = useQueryActions();
  const { runState, schema } = useQueryState();
  const running = runState === "loading";

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
        aria-label="Builder menu"
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
          {NAV_ACTIONS.map(({ modal, label, icon: Icon }) => (
            <button
              key={modal}
              type="button"
              onClick={() => {
                setModal(modal);
                onClose();
              }}
              className="flex items-center gap-3 rounded-md px-3 py-2.5 text-[14px] font-medium text-muted-foreground transition hover:bg-surface-2 hover:text-foreground"
            >
              <Icon size={18} className="shrink-0 text-faint" />
              <span className="shrink-0">{label}</span>
              {modal === "schema" && (
                <span className="ml-auto min-w-0 truncate font-jetbrains-mono text-[12px] text-faint">
                  {schema.name} · {schema.rows.length.toLocaleString()}
                </span>
              )}
            </button>
          ))}
        </nav>

        <div className="mt-auto flex items-center justify-between gap-3 border-t border-border-soft p-4">
          <ThemeSwitcher />
          <AppButton
            onClick={() => {
              run();
              onClose();
            }}
            disabled={running}
          >
            <FaPlay />
            {running ? "Running…" : "Run query"}
          </AppButton>
        </div>
      </aside>
    </div>
  );
};

export default BuilderMobileNav;
