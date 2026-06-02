import { cn } from "@/lib/utils";
import type { NodePatch } from "@/components/build-query/types";
import { inputBase } from "..";

interface RangeValueControlProps {
  type: "date" | "number";
  value: string;
  value2: string;
  onChange: (patch: NodePatch) => void;
  error: boolean;
}

const RangeValueControl = ({
  type,
  value,
  value2,
  onChange,
  error,
}: RangeValueControlProps) => (
  <div className="flex min-w-0 items-center gap-1.5">
    <input
      type={type}
      className={cn(
        inputBase,
        "w-23 font-jetbrains-mono",
        error && "border-danger focus:ring-danger-dim",
      )}
      value={value}
      onChange={(e) => onChange({ value: e.target.value })}
      placeholder="min"
    />
    <span className="font-jetbrains-mono text-[11px] text-faint">and</span>
    <input
      type={type}
      className={cn(
        inputBase,
        "w-23 font-jetbrains-mono",
        error && "border-danger focus:ring-danger-dim",
      )}
      value={value2}
      onChange={(e) => onChange({ value2: e.target.value })}
      placeholder="max"
    />
  </div>
);

export default RangeValueControl;
