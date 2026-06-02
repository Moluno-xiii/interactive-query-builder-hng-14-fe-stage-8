"use client";

import { createContext, type ReactNode } from "react";
import type {
  Errors,
  Group,
  HistoryEntry,
  Preset,
  Row,
  Schema,
} from "@/components/build-query/types";
import type { ModalKind } from "@/components/build-query";

export type RunState = "idle" | "loading" | "done";
export type Sort = { col: string | null; dir: "asc" | "desc" };

export interface QueryState {
  schema: Schema;
  schemas: Schema[];
  tree: Group;
  errors: Errors;
  errorCount: number;
  completeCount: number;
  allCollapsed: boolean;
  runState: RunState;
  results: Row[];
  sort: Sort;
  page: number;
  modal: ModalKind | null;
  presets: Preset[];
  history: HistoryEntry[];
}

export const QueryStateContext = createContext<QueryState | null>(null);

const QueryStateProvider = ({
  value,
  children,
}: {
  value: QueryState;
  children: ReactNode;
}) => (
  <QueryStateContext.Provider value={value}>
    {children}
  </QueryStateContext.Provider>
);

export default QueryStateProvider;
