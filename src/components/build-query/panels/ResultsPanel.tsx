"use client";

import { PiMagnifyingGlass, PiPlay } from "react-icons/pi";
import type { Row } from "@/components/build-query/types";
import { PAGE_SIZE } from "..";
import useQueryState from "@/hooks/useQueryState";
import ResultsHeader from "./ResultsHeader";
import ResultsPlaceholder from "./ResultsPlaceholder";
import ResultsSkeleton from "./ResultsSkeleton";
import ResultsTable from "./ResultsTable";

interface ResultsPanelProps {
  state: "idle" | "loading" | "done";
  rows: Row[];
  sort: { col: string | null; dir: "asc" | "desc" };
  onSort: (col: string) => void;
  page: number;
  onPage: (p: number) => void;
  isValid: boolean;
}

const ResultsPanel = ({
  state,
  rows,
  sort,
  onSort,
  page,
  onPage,
}: ResultsPanelProps) => {
  const { schema } = useQueryState();
  const pages = Math.max(1, Math.ceil(rows.length / PAGE_SIZE));
  const view = rows.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  return (
    <section className="flex flex-1 flex-col bg-background">
      <ResultsHeader
        state={state}
        rowCount={rows.length}
        page={page}
        pages={pages}
        onPage={onPage}
      />

      <div className="qf-scroll relative flex-1 overflow-auto">
        {state === "idle" && (
          <ResultsPlaceholder
            icon={<PiPlay size={22} />}
            iconClassName="bg-accent-dim text-accent"
            title="Ready to run"
            description={`Press Run or ⌘↵ to execute against ${schema.rows.length.toLocaleString()} rows`}
          />
        )}
        {state === "loading" && <ResultsSkeleton />}
        {state === "done" && rows.length === 0 && (
          <ResultsPlaceholder
            icon={<PiMagnifyingGlass size={22} />}
            iconClassName="bg-surface-2 text-faint"
            title="No rows match"
            description="Loosen a condition or switch an AND to OR to widen the result set."
          />
        )}
        {state === "done" && rows.length > 0 && (
          <ResultsTable rows={view} sort={sort} onSort={onSort} />
        )}
      </div>
    </section>
  );
};

export default ResultsPanel;
