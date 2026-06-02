import PreviewPanel from "@/components/build-query/panels/PreviewPanel";
import ResultsPanel from "@/components/build-query/panels/ResultsPanel";
import type { Group, Row } from "@/components/build-query/types";

interface OutputPaneProps {
  tree: Group;
  errorCount: number;
  runState: "idle" | "loading" | "done";
  rows: Row[];
  sort: { col: string | null; dir: "asc" | "desc" };
  onSort: (col: string) => void;
  page: number;
  onPage: (p: number) => void;
}

const OutputPane = ({
  tree,
  errorCount,
  runState,
  rows,
  sort,
  onSort,
  page,
  onPage,
}: OutputPaneProps) => {
  return (
    <div className="flex min-w-90 flex-1 flex-col gap-px bg-border-soft max-[940px]:min-w-0">
      <PreviewPanel tree={tree} errorCount={errorCount} />
      <ResultsPanel
        state={runState}
        rows={rows}
        sort={sort}
        onSort={onSort}
        page={page}
        onPage={onPage}
        isValid={errorCount === 0}
      />
    </div>
  );
};

export default OutputPane;
