import { PiPlus, PiStack } from "react-icons/pi";
import { cn } from "@/lib/utils";
import AppButton from "@/components/ui/app-button";
import type { Action } from "@/components/build-query/types";

interface GroupEmptyStateProps {
  groupId: string;
  dragging: boolean;
  dispatch: (a: Action) => void;
}

const GroupEmptyState = ({
  groupId,
  dragging,
  dispatch,
}: GroupEmptyStateProps) => {
  return (
    <div
      className={cn(
        "ml-3.5 flex flex-wrap items-center justify-between gap-2.5 rounded-md border border-dashed border-border-strong px-3.5 py-3 text-[12px] text-faint",
        dragging && "border-accent bg-accent-dim text-accent",
      )}
    >
      <span className="font-jetbrains-mono">no conditions yet</span>
      <div className="flex gap-1.5">
        <AppButton
          variant="secondary"
          size="sm"
          onClick={() => dispatch({ t: "addRule", id: groupId })}
        >
          <PiPlus />
          Add rule
        </AppButton>
        <AppButton
          variant="secondary"
          size="sm"
          onClick={() => dispatch({ t: "addGroup", id: groupId })}
        >
          <PiStack />
          Add group
        </AppButton>
      </div>
    </div>
  );
};

export default GroupEmptyState;
