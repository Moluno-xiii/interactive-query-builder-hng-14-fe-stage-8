"use client";

import {
  PiArrowDown,
  PiArrowUp,
  PiFunnel,
  PiWarningCircle,
} from "react-icons/pi";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/ui/app-button";
import ConditionGroup from "@/components/build-query/builder/ConditionGroup";
import DnDProvider from "@/components/build-query/builder/DnDProvider";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";

const BuilderPane = () => {
  const { tree, errors, errorCount, completeCount, allCollapsed } =
    useQueryState();
  const { dispatch, clearBuilder, setModal } = useQueryActions();
  return (
    <section className="flex min-w-0 flex-[1.32] flex-col bg-background max-[940px]:min-h-[56vh]">
      <header
        data-tour="builder"
        className="flex h-11.5 flex-none items-center justify-between border-b border-border-soft bg-surface pl-4 pr-3.5"
      >
        <div className="flex items-center gap-2.25 text-[13.5px] font-semibold tracking-[0.2px]">
          <PiFunnel size={15} className="text-accent" />
          <span>Query builder</span>
          <Badge className="h-4.75 gap-1 rounded-sm border-border-soft bg-surface-2 px-1.75 text-[11px] font-jetbrains-mono font-medium leading-none tracking-[0.2px] text-faint">
            {completeCount} active filter{completeCount !== 1 ? "s" : ""}
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <AppButton
            variant="ghost"
            size="icon-sm"
            aria-label={allCollapsed ? "Expand all" : "Collapse all"}
            title={allCollapsed ? "Expand all" : "Collapse all"}
            onClick={() =>
              dispatch({ t: "collapseAll", collapsed: !allCollapsed })
            }
          >
            {allCollapsed ? <PiArrowDown /> : <PiArrowUp />}
          </AppButton>
          <button
            className="rounded-sm px-2 py-1.25 text-[12.5px] font-medium text-faint transition hover:bg-danger-dim hover:text-danger"
            onClick={clearBuilder}
          >
            Clear
          </button>
        </div>
      </header>

      {errorCount > 0 && (
        <div className="flex items-center gap-2.25 border-b border-danger/30 bg-danger-dim px-4 py-2.25 text-[12.5px] text-danger animate-fade-up">
          <PiWarningCircle size={14} />
          <span>
            <strong className="font-bold">{errorCount}</strong> issue
            {errorCount !== 1 ? "s" : ""} to resolve before this query is valid.
          </span>
        </div>
      )}

      <div className="qf-scroll flex-1 overflow-auto p-4">
        <DnDProvider
          onMove={(dragId, targetId, edge) =>
            dispatch({ t: "move", dragId, targetId, edge })
          }
        >
          <ConditionGroup
            group={tree}
            depth={0}
            isRoot
            errors={errors}
            dispatch={dispatch}
          />
        </DnDProvider>
        <div className="mt-4 border-t border-dashed border-border px-3 py-2.5 text-center font-jetbrains-mono text-[11px] text-faint">
          <kbd className="rounded border border-border bg-surface-2 px-1.25 py-px font-jetbrains-mono text-muted-foreground">
            drag
          </kbd>{" "}
          handles to reorder ·{" "}
          <kbd className="rounded border border-border bg-surface-2 px-1.25 py-px font-jetbrains-mono text-muted-foreground">
            ⌘↵
          </kbd>{" "}
          to run · nest groups for AND/OR logic ·{" "}
          <button
            type="button"
            onClick={() => setModal("shortcuts")}
            className="text-faint transition hover:text-muted-foreground"
          >
            <kbd className="rounded border border-border bg-surface-2 px-1.25 py-px font-jetbrains-mono text-muted-foreground">
              ?
            </kbd>{" "}
            shortcuts
          </button>
        </div>
      </div>
    </section>
  );
};

export default BuilderPane;
