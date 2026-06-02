"use client";

import { createContext, type ReactNode } from "react";
import type { Action, Group } from "@/components/build-query/types";
import type { ModalKind } from "@/components/build-query";

export interface QueryActions {
  dispatch: (a: Action) => void;
  run: () => void;
  setModal: (m: ModalKind | null) => void;
  setPage: (p: number) => void;
  onSort: (col: string) => void;
  clearBuilder: () => void;
  savePreset: (name: string) => void;
  deletePreset: (ts: number) => void;
  importTree: (t: Group) => void;
  loadTree: (t: Group) => void;
  deleteHistory: (ts: number) => void;
  clearHistory: () => void;
}

export const QueryActionsContext = createContext<QueryActions | null>(null);

const QueryActionsProvider = ({
  value,
  children,
}: {
  value: QueryActions;
  children: ReactNode;
}) => (
  <QueryActionsContext.Provider value={value}>
    {children}
  </QueryActionsContext.Provider>
);

export default QueryActionsProvider;
