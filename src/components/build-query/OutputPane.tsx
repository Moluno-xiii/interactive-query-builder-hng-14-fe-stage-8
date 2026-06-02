"use client";

import PreviewPanel from "@/components/build-query/panels/PreviewPanel";
import ResultsPanel from "@/components/build-query/panels/ResultsPanel";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";

const OutputPane = () => {
  const { tree, errorCount, runState, results, sort, page } = useQueryState();
  const { onSort, setPage } = useQueryActions();
  return (
    <div className="flex min-w-90 flex-1 flex-col gap-px bg-border-soft max-[940px]:min-w-0">
      <PreviewPanel tree={tree} errorCount={errorCount} />
      <ResultsPanel
        state={runState}
        rows={results}
        sort={sort}
        onSort={onSort}
        page={page}
        onPage={setPage}
        isValid={errorCount === 0}
      />
    </div>
  );
};

export default OutputPane;
