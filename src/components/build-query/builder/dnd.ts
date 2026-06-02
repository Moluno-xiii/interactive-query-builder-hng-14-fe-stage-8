"use client";

import { createContext } from "react";
import type { Edge } from "@/components/build-query/types";

interface DnDValue {
  dragId: string | null;
  hint: { id: string; edge: Edge } | null;
  start: (id: string) => void;
  end: () => void;
  over: (id: string, edge: Edge) => void;
  drop: (targetId: string, edge: Edge) => void;
}

const DnDContext = createContext<DnDValue | null>(null);

export { DnDContext };
export type { DnDValue };
