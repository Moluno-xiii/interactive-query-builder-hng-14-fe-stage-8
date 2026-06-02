import type { Edge } from "@/components/build-query/types";
import { DnDContext } from "@/components/build-query/builder/dnd";
import { useContext, type DragEvent } from "react";

const useDropItem = (id: string) => {
  const dnd = useContext(DnDContext)!;
  const onDragOver = (e: DragEvent) => {
    if (!dnd.dragId || dnd.dragId === id) return;
    e.preventDefault();
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    const edge: Edge = e.clientY - r.top < r.height / 2 ? "before" : "after";
    dnd.over(id, edge);
  };
  const onDrop = (e: DragEvent) => {
    if (!dnd.dragId || dnd.dragId === id) return;
    e.preventDefault();
    e.stopPropagation();
    const r = e.currentTarget.getBoundingClientRect();
    const edge: Edge = e.clientY - r.top < r.height / 2 ? "before" : "after";
    dnd.drop(id, edge);
  };
  const hintEdge = dnd.hint && dnd.hint.id === id ? dnd.hint.edge : null;
  const isDragging = dnd.dragId === id;
  return { onDragOver, onDrop, hintEdge, isDragging, dnd };
};

export default useDropItem;
