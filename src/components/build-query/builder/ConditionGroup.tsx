"use client";

import { useRef, type DragEvent } from "react";
import { PiWarningCircle } from "react-icons/pi";
import { cn } from "@/lib/utils";
import GroupHeader from "@/components/build-query/builder/GroupHeader";
import GroupEmptyState from "@/components/build-query/builder/GroupEmptyState";
import GroupCollapsedSummary from "@/components/build-query/builder/GroupCollapsedSummary";
import RuleRow from "@/components/build-query/builder/RuleRow";
import DropLine from "@/components/build-query/builder/DropLine";
import type { Action, Errors, Group } from "@/components/build-query/types";
import useDropItem from "@/hooks/useDropItem";

interface ConditionGroupProps {
  group: Group;
  depth: number;
  isRoot?: boolean;
  errors: Errors;
  dispatch: (a: Action) => void;
}

const ConditionGroup = ({
  group,
  depth,
  isRoot,
  errors,
  dispatch,
}: ConditionGroupProps) => {
  const rowRef = useRef<HTMLDivElement>(null);
  const err = errors[group.id];
  const { onDragOver, onDrop, hintEdge, isDragging, dnd } = useDropItem(
    group.id,
  );

  const emptyDrop = (e: DragEvent) => {
    if (dnd.dragId && group.children.length === 0) {
      e.preventDefault();
      e.stopPropagation();
    }
  };
  const emptyDropEnd = (e: DragEvent) => {
    if (dnd.dragId && group.children.length === 0) {
      e.preventDefault();
      e.stopPropagation();
      dnd.drop(group.id, "inside");
    }
  };

  return (
    <div
      ref={rowRef}
      data-depth={Math.min(depth, 4)}
      className={cn(
        "qf-group relative rounded-lg",
        isRoot
          ? "is-root bg-transparent"
          : "my-0.5 border border-border-soft bg-[color-mix(in_oklch,var(--surface)_70%,var(--bg))]",
        isDragging && "opacity-40",
        err && !isRoot && "border-danger/60",
      )}
      onDragOver={isRoot ? undefined : onDragOver}
      onDrop={isRoot ? undefined : onDrop}
    >
      {!isRoot && hintEdge === "before" && <DropLine edge="before" />}

      <GroupHeader
        group={group}
        isRoot={isRoot}
        dispatch={dispatch}
        dnd={dnd}
        dragImageRef={rowRef}
      />

      {err && (
        <div className="flex items-center gap-1.5 pl-3.5 pr-1 pt-0.5 text-[11.5px] text-danger">
          <PiWarningCircle size={13} />
          {err.msg}
        </div>
      )}

      {!group.collapsed && (
        <div
          className={cn(
            "qf-group-body relative flex flex-col pb-3 pt-0.5",
            isRoot ? "pl-4.5 pr-2.5" : "pl-5.5 pr-3",
          )}
          onDragOver={emptyDrop}
          onDrop={emptyDropEnd}
        >
          {group.children.length === 0 && (
            <GroupEmptyState
              groupId={group.id}
              dragging={!!dnd.dragId}
              dispatch={dispatch}
            />
          )}
          {group.children.map((child, i) => (
            <div className="qf-child relative pl-3.5" key={child.id}>
              {i > 0 && (
                <span
                  className={cn(
                    "relative z-1 my-1.25 inline-flex h-5 items-center rounded-[5px] px-2 font-jetbrains-mono text-[10.5px] font-bold tracking-[0.8px]",
                    group.combinator === "AND"
                      ? "bg-and-dim text-and"
                      : "bg-or-dim text-or",
                  )}
                >
                  {group.combinator}
                </span>
              )}
              {child.kind === "rule" ? (
                <RuleRow
                  rule={child}
                  errors={errors}
                  onChange={(patch) =>
                    dispatch({ t: "patch", id: child.id, patch })
                  }
                  onRemove={() => dispatch({ t: "remove", id: child.id })}
                  onDuplicate={() => dispatch({ t: "duplicate", id: child.id })}
                />
              ) : (
                <ConditionGroup
                  group={child}
                  depth={depth + 1}
                  errors={errors}
                  dispatch={dispatch}
                />
              )}
            </div>
          ))}
        </div>
      )}
      {group.collapsed && (
        <GroupCollapsedSummary
          count={group.children.length}
          onExpand={() =>
            dispatch({ t: "patch", id: group.id, patch: { collapsed: false } })
          }
        />
      )}
      {!isRoot && hintEdge === "after" && <DropLine edge="after" />}
    </div>
  );
};

export default ConditionGroup;
