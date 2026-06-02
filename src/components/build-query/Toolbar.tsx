"use client";

import {
  PiArrowDownRightLight,
  PiBookmarkThin,
  PiClockCounterClockwiseThin,
  PiCodeLight,
  PiDatabase,
} from "react-icons/pi";
import { FaPlay } from "react-icons/fa6";
import AppButton from "../ui/app-button";
import AppIcon from "../ui/AppIcon";
import ThemeSwitcher from "../ThemeSwitcher";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";

const Toolbar = () => {
  const { run, setModal } = useQueryActions();
  const { runState, schema } = useQueryState();
  const running = runState === "loading";
  return (
    <header className="relative z-30 flex h-13.5 flex-none items-center gap-2.5 border-b border-border bg-surface px-3.5">
      <div className="flex items-center gap-2.25">
        <AppIcon />
        <span className="mx-px text-[17px] font-light text-faint">/</span>
        <button
          className="flex items-center gap-1.75 rounded-md border border-border bg-surface-2 py-1.25 pl-2.5 pr-2.25 text-[13px] text-foreground transition hover:border-border-strong hover:bg-surface-3"
          onClick={() => setModal("schema")}
          title="Switch data source"
        >
          <PiDatabase size={13} className="text-accent" />
          <span className="font-jetbrains-mono">{schema.name}</span>
          {schema.rows.length.toLocaleString()}
          <PiArrowDownRightLight size={12} className="text-faint" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-0.75">
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
      </div>
      <div className="mx-1.25 h-5.5 w-px bg-border" />
      <ThemeSwitcher />
      <AppButton className="ml-1" onClick={run} disabled={running}>
        <FaPlay />
        {running ? "Running…" : "Run"}
        <kbd className="ml-0.5 rounded-[5px] bg-black/20 px-1.25 py-px font-jetbrains-mono text-[10.5px] leading-[1.4] text-accent-foreground opacity-80">
          ⌘↵
        </kbd>
      </AppButton>
    </header>
  );
};

export default Toolbar;
