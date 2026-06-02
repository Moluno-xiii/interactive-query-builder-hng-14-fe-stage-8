"use client";

import { useState } from "react";
import {
  PiArrowDownRightLight,
  PiBookmarkThin,
  PiClockCounterClockwiseThin,
  PiCodeLight,
  PiDatabase,
  PiKeyboard,
  PiList,
  PiQuestion,
} from "react-icons/pi";
import { FaPlay } from "react-icons/fa6";
import AppButton from "../ui/app-button";
import AppIcon from "../ui/AppIcon";
import ThemeSwitcher from "../ThemeSwitcher";
import BuilderMobileNav from "@/components/build-query/BuilderMobileNav";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";
import useTour from "@/hooks/useTour";

const Toolbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { run, setModal } = useQueryActions();
  const { runState, schema } = useQueryState();
  const { start: startTour } = useTour();
  const running = runState === "loading";
  return (
    <>
      <header className="relative z-30 flex h-13.5 flex-none items-center gap-2.5 border-b border-border bg-surface px-3.5">
        <div className="flex min-w-0 items-center gap-2.25">
          <AppIcon />
          <div className="hidden min-w-0 items-center gap-2.25 sm:flex">
            <span className="mx-px text-[17px] font-light text-faint">/</span>
            <button
              data-tour="source"
              className="flex min-w-0 items-center gap-1.75 rounded-md border border-border bg-surface-2 py-1.25 pl-2.5 pr-2.25 text-[13px] text-foreground transition hover:border-border-strong hover:bg-surface-3"
              onClick={() => setModal("schema")}
              title="Switch data source"
            >
              <PiDatabase size={13} className="shrink-0 text-accent" />
              <span className="truncate font-jetbrains-mono">{schema.name}</span>
              {schema.rows.length.toLocaleString()}
              <PiArrowDownRightLight size={12} className="shrink-0 text-faint" />
            </button>
          </div>
        </div>

        <div className="flex-1" />

        <div className="hidden items-center gap-0.75 sm:flex">
          <AppButton
            variant={"ghost"}
            onClick={() => setModal("history")}
            size={"icon"}
            aria-label="Query history"
            title="Query history"
          >
            <PiClockCounterClockwiseThin size={18} />
          </AppButton>
          <AppButton
            onClick={() => setModal("presets")}
            variant={"ghost"}
            size={"icon"}
            aria-label="Saved presets"
            title="Saved presets"
          >
            <PiBookmarkThin size={18} />
          </AppButton>
          <AppButton
            onClick={() => setModal("io")}
            variant={"ghost"}
            size={"icon"}
            aria-label="Import / export JSON"
            title="Import / export JSON"
          >
            <PiCodeLight size={18} />
          </AppButton>
          <AppButton
            onClick={() => setModal("shortcuts")}
            variant={"ghost"}
            size={"icon"}
            aria-label="Keyboard shortcuts"
            title="Keyboard shortcuts"
          >
            <PiKeyboard size={18} />
          </AppButton>
        </div>
        <AppButton
          variant={"ghost"}
          size={"icon"}
          aria-label="How to use this app"
          title="Take a tour"
          onClick={startTour}
        >
          <PiQuestion size={18} />
        </AppButton>
        <div className="mx-1.25 hidden h-5.5 w-px bg-border sm:block" />
        <div className="hidden sm:block">
          <ThemeSwitcher />
        </div>
        <AppButton
          data-tour="run"
          className="ml-1"
          onClick={run}
          disabled={running}
        >
          <FaPlay />
          {running ? "Running…" : "Run"}
          <kbd className="ml-0.5 hidden rounded-[5px] bg-black/20 px-1.25 py-px font-jetbrains-mono text-[10.5px] leading-[1.4] text-accent-foreground opacity-80 sm:inline-block">
            ⌘↵
          </kbd>
        </AppButton>

        <button
          type="button"
          data-tour="menu"
          onClick={() => setMenuOpen(true)}
          aria-label="Open menu"
          aria-expanded={menuOpen}
          className="ml-0.5 grid size-9 shrink-0 place-items-center rounded-md border border-border bg-surface-2 text-foreground transition hover:border-border-strong hover:bg-surface-3 sm:hidden"
        >
          <PiList size={18} />
        </button>
      </header>

      <BuilderMobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default Toolbar;
