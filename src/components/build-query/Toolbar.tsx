import {
  PiArrowDownRightLight,
  PiBookmarkThin,
  PiClockCounterClockwiseThin,
  PiCodeLight,
  PiDatabase,
} from "react-icons/pi";
import AppButton from "../ui/app-button";
import AppIcon from "../ui/AppIcon";
import { SCHEMA } from "@/components/build-query/data";
import ThemeSwitcher from "../ThemeSwitcher";
import { FaPlay } from "react-icons/fa6";
import { ModalKind } from ".";

const Toolbar = ({
  onRun,
  running,
  onOpen,
}: {
  onRun: () => void;
  running: boolean;
  onOpen: (m: ModalKind) => void;
}) => {
  return (
    <header className="relative z-30 flex h-13.5 flex-none items-center gap-2.5 border-b border-border bg-surface px-3.5">
      <div className="flex items-center gap-2.25">
        <AppIcon />
        <span className="mx-px text-[17px] font-light text-faint">/</span>
        <button
          className="flex items-center gap-1.75 rounded-md border border-border bg-surface-2 py-1.25 pl-2.5 pr-2.25 text-[13px] text-foreground transition hover:border-border-strong hover:bg-surface-3"
          onClick={() => onOpen("schema")}
        >
          <PiDatabase size={13} className="text-accent" />
          <span className="font-jetbrains-mono">{SCHEMA.name}</span>
          {SCHEMA.rows}
          <PiArrowDownRightLight size={12} className="text-faint" />
        </button>
      </div>

      <div className="flex-1" />

      <div className="flex items-center gap-0.75">
        <AppButton
          variant={"ghost"}
          onClick={() => onOpen("history")}
          size={"icon"}
        >
          <PiClockCounterClockwiseThin size={18} />
        </AppButton>
        <AppButton
          onClick={() => onOpen("presets")}
          variant={"ghost"}
          size={"icon"}
        >
          <PiBookmarkThin size={18} />
        </AppButton>
        <AppButton onClick={() => onOpen("io")} variant={"ghost"} size={"icon"}>
          <PiCodeLight size={18} />
        </AppButton>
      </div>
      <div className="mx-1.25 h-5.5 w-px bg-border" />
      <ThemeSwitcher />
      <AppButton className="ml-1" onClick={onRun} disabled={running}>
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
