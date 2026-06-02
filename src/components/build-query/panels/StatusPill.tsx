import { cn } from "@/lib/utils";
import type { DataValue } from "@/components/build-query/types";
import { BADGE_TONES, MUTED_TONE } from "..";

const StatusPill = ({ value, col }: { value: DataValue; col: string }) => {
  const tone = BADGE_TONES[col]?.[String(value)] ?? MUTED_TONE;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.25 rounded-full py-0.5 pl-1.75 pr-2 text-[11px] font-semibold",
        tone.pill,
      )}
    >
      <span className={cn("size-1.5 rounded-full", tone.dot)} />
      {value}
    </span>
  );
};

export default StatusPill;
