import { cn } from "@/lib/utils";
import MultiCombobox from "@/components/ui/multi-combobox";
import type { NodePatch } from "@/components/build-query/types";
import { inputBase, type Option } from "..";

interface MultiValueControlProps {
  value: string;
  options: Option[] | null;
  onChange: (patch: NodePatch) => void;
  error: boolean;
}

const MultiValueControl = ({
  value,
  options,
  onChange,
  error,
}: MultiValueControlProps) => (
  <div className="flex min-w-0 items-center">
    {options ? (
      <MultiCombobox
        value={value}
        options={options}
        onChange={(v) => onChange({ value: v })}
        error={error}
      />
    ) : (
      <input
        className={cn(
          inputBase,
          "w-37.5 min-w-22.5 font-jetbrains-mono",
          error && "border-danger focus:ring-danger-dim",
        )}
        value={value}
        placeholder="a, b, c…"
        onChange={(e) => onChange({ value: e.target.value })}
      />
    )}
  </div>
);

export default MultiValueControl;
