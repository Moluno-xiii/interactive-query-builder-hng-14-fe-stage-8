import { PiCaretLeft, PiCaretRight, PiTable } from "react-icons/pi";
import { cn } from "@/lib/utils";
import AppButton from "@/components/ui/app-button";
import { Badge } from "@/components/ui/badge";
import { panelHead, panelTitle } from "..";

interface ResultsHeaderProps {
  state: "idle" | "loading" | "done";
  rowCount: number;
  page: number;
  pages: number;
  onPage: (p: number) => void;
}

const ResultsHeader = ({
  state,
  rowCount,
  page,
  pages,
  onPage,
}: ResultsHeaderProps) => {
  return (
    <header className={panelHead}>
      <div className={panelTitle}>
        <PiTable size={15} className="text-accent" />
        <span>Results</span>
        {state === "done" && (
          <Badge
            className={cn(
              "h-4.75 gap-1 rounded-sm border-transparent px-1.75 text-[11px] font-jetbrains-mono font-medium leading-none tracking-[0.2px]",
              rowCount ? "bg-accent-dim text-accent" : "bg-surface-2 text-faint",
            )}
          >
            {rowCount.toLocaleString()} row{rowCount !== 1 ? "s" : ""}
          </Badge>
        )}
        {state === "loading" && (
          <Badge className="h-4.75 gap-1 rounded-sm border-border-soft bg-surface-2 px-1.75 text-[11px] font-jetbrains-mono font-medium leading-none tracking-[0.2px] text-faint">
            running…
          </Badge>
        )}
      </div>
      {state === "done" && rowCount > 0 && (
        <div className="flex items-center gap-1">
          <AppButton
            variant="ghost"
            size="icon-sm"
            aria-label="Previous page"
            title="Previous page"
            disabled={page === 0}
            onClick={() => onPage(page - 1)}
          >
            <PiCaretLeft />
          </AppButton>
          <span className="min-w-10.5 text-center font-jetbrains-mono text-[11.5px] text-faint">
            {page + 1} / {pages}
          </span>
          <AppButton
            variant="ghost"
            size="icon-sm"
            aria-label="Next page"
            title="Next page"
            disabled={page >= pages - 1}
            onClick={() => onPage(page + 1)}
          >
            <PiCaretRight />
          </AppButton>
        </div>
      )}
    </header>
  );
};

export default ResultsHeader;
