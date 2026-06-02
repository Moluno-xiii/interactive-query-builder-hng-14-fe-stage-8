"use client";

import { PiArrowDown, PiArrowUp } from "react-icons/pi";
import { cn } from "@/lib/utils";
import StatusPill from "./StatusPill";
import { BADGE_TONES } from "@/components/build-query";
import type { Row } from "@/components/build-query/types";
import queryEngine from "@/components/build-query/query-engine";
import useQueryState from "@/hooks/useQueryState";

interface ResultsTableProps {
  rows: Row[];
  sort: { col: string | null; dir: "asc" | "desc" };
  onSort: (col: string) => void;
}

const ResultsTable = ({ rows, sort, onSort }: ResultsTableProps) => {
  const { schema } = useQueryState();
  const cols = schema.fields.map((f) => f.key);
  const idKey = schema.fields[0].key;
  return (
    <table className="w-full border-collapse text-[12.5px]">
      <thead>
        <tr>
          {cols.map((c) => (
            <th
              key={c}
              className={cn(
                "sticky top-0 z-2 cursor-pointer select-none whitespace-nowrap border-b border-border bg-surface px-3.5 py-2.25 text-left font-jetbrains-mono text-[11px] font-semibold text-faint hover:text-muted-foreground",
                sort.col === c && "text-accent",
              )}
              onClick={() => onSort(c)}
            >
              <span className="inline-flex items-center gap-1">
                {schema.fieldMap[c]?.label ?? c}
                {sort.col === c &&
                  (sort.dir === "asc" ? (
                    <PiArrowUp size={11} />
                  ) : (
                    <PiArrowDown size={11} />
                  ))}
              </span>
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((r) => (
          <tr
            key={String(r[idKey])}
            className="animate-fade-up transition-colors hover:bg-surface-2"
          >
            {cols.map((c) => (
              <td
                key={c}
                className={cn(
                  "whitespace-nowrap border-b border-border-soft px-3.5 py-2.25 text-foreground",
                  schema.fieldMap[c]?.type === "number" &&
                    "font-jetbrains-mono tabular-nums",
                  c === idKey &&
                    "font-jetbrains-mono text-[11.5px] text-muted-foreground",
                )}
              >
                {BADGE_TONES[c] ? (
                  <StatusPill value={r[c]} col={c} />
                ) : (
                  queryEngine.format.fmtCell(c, r[c], schema)
                )}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default ResultsTable;
