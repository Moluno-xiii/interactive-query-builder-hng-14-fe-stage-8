import { cn } from "@/lib/utils";
import type { NodePatch } from "@/components/build-query/types";
import { inputBase } from "..";

interface ScalarValueControlProps {
  type: "text" | "number" | "date";
  value: string;
  placeholder: string;
  onChange: (patch: NodePatch) => void;
  error: boolean;
}

const ScalarValueControl = ({
  type,
  value,
  placeholder,
  onChange,
  error,
}: ScalarValueControlProps) => (
  <div className="flex min-w-0 items-center">
    <input
      type={type}
      className={cn(
        inputBase,
        "w-37.5 min-w-22.5 font-jetbrains-mono",
        error && "border-danger focus:ring-danger-dim",
      )}
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange({ value: e.target.value })}
    />
  </div>
);

export default ScalarValueControl;
