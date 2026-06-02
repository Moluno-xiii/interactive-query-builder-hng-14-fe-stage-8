import { type RefObject } from "react";
import {
  PiCaretDown,
  PiCaretRight,
  PiDotsSixVertical,
  PiPlus,
  PiStack,
  PiTrash,
} from "react-icons/pi";
import { cn } from "@/lib/utils";
import AppButton from "@/components/ui/app-button";
import CombinatorToggle from "@/components/build-query/builder/CombinatorToggle";
import type { DnDValue } from "@/components/build-query/builder/dnd";
import type { Action, Group } from "@/components/build-query/types";

interface GroupHeaderProps {
  group: Group;
  isRoot?: boolean;
  dispatch: (a: Action) => void;
  dnd: DnDValue;
  dragImageRef: RefObject<HTMLDivElement | null>;
}

const GroupHeader = ({
  group,
  isRoot,
  dispatch,
  dnd,
  dragImageRef,
}: GroupHeaderProps) => {
  const ruleCount = group.children.filter((c) => c.kind === "rule").length;
  const groupCount = group.children.filter((c) => c.kind === "group").length;

  return (
    <div
      className={cn(
        "flex items-center gap-1.75 py-2.25 pr-2.5",
        isRoot ? "pl-2.75" : "pl-3.25",
      )}
    >
      <span
        className="grid h-6.5 w-5.5 shrink-0 cursor-grab place-items-center rounded-[5px] text-faint opacity-55 transition hover:bg-surface-2 hover:text-muted-foreground hover:opacity-100 active:cursor-grabbing"
        draggable={!isRoot}
        onDragStart={(e) => {
          if (isRoot) return;
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", group.id);
          if (dragImageRef.current)
            e.dataTransfer.setDragImage(dragImageRef.current, 18, 20);
          dnd.start(group.id);
        }}
        onDragEnd={() => dnd.end()}
        title={isRoot ? "" : "Drag group"}
        style={{ visibility: isRoot ? "hidden" : "visible" }}
      >
        <PiDotsSixVertical size={16} />
      </span>
      <AppButton
        variant="ghost"
        size="icon-sm"
        aria-label={group.collapsed ? "Expand" : "Collapse"}
        title={group.collapsed ? "Expand" : "Collapse"}
        onClick={() =>
          dispatch({
            t: "patch",
            id: group.id,
            patch: { collapsed: !group.collapsed },
          })
        }
      >
        {group.collapsed ? <PiCaretRight /> : <PiCaretDown />}
      </AppButton>
      <CombinatorToggle
        value={group.combinator}
        onChange={(c) =>
          dispatch({ t: "patch", id: group.id, patch: { combinator: c } })
        }
      />
      <span className="flex min-w-0 items-center gap-2">
        <span className="rounded-[5px] bg-[color-mix(in_oklch,var(--hue)_14%,transparent)] px-1.75 py-0.5 font-jetbrains-mono text-[11px] font-semibold uppercase tracking-[0.6px] text-(--hue)">
          {isRoot ? "where" : "group"}
        </span>
        <span className="font-jetbrains-mono text-[11.5px] text-faint">
          {ruleCount} rule{ruleCount !== 1 ? "s" : ""}
          {groupCount
            ? ` · ${groupCount} group${groupCount !== 1 ? "s" : ""}`
            : ""}
        </span>
      </span>
      <div className="ml-auto flex items-center gap-1">
        <AppButton
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ t: "addRule", id: group.id })}
        >
          <PiPlus />
          Rule
        </AppButton>
        <AppButton
          variant="ghost"
          size="sm"
          onClick={() => dispatch({ t: "addGroup", id: group.id })}
        >
          <PiStack />
          Group
        </AppButton>
        {!isRoot && (
          <AppButton
            variant="ghost"
            size="icon-sm"
            aria-label="Remove group"
            title="Remove group"
            className="hover:bg-danger-dim hover:text-danger"
            onClick={() => dispatch({ t: "remove", id: group.id })}
          >
            <PiTrash />
          </AppButton>
        )}
      </div>
    </div>
  );
};

export default GroupHeader;
