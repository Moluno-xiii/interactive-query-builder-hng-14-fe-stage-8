"use client";

import { useState, type ReactNode } from "react";
import type { Edge } from "@/components/build-query/types";
import { DnDContext } from "@/components/build-query/builder/dnd";

interface DnDProviderProps {
  onMove: (dragId: string, targetId: string, edge: Edge) => void;
  children: ReactNode;
}

const DnDProvider = ({ onMove, children }: DnDProviderProps) => {
  const [dragId, setDragId] = useState<string | null>(null);
  const [hint, setHint] = useState<{ id: string; edge: Edge } | null>(null);
  const start = (id: string) => setDragId(id);
  const end = () => {
    setDragId(null);
    setHint(null);
  };
  const over = (id: string, edge: Edge) =>
    setHint((h) => (h && h.id === id && h.edge === edge ? h : { id, edge }));
  const drop = (targetId: string, edge: Edge) => {
    if (dragId && targetId && dragId !== targetId) onMove(dragId, targetId, edge);
    end();
  };
  return (
    <DnDContext.Provider value={{ dragId, hint, start, end, over, drop }}>{children}</DnDContext.Provider>
  );
};

export default DnDProvider;
