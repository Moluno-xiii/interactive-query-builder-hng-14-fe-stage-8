import Combobox from "@/components/ui/combobox";
import type { NodePatch } from "@/components/build-query/types";
import { type Option } from "..";

interface EnumValueControlProps {
  value: string;
  options: Option[];
  onChange: (patch: NodePatch) => void;
  error: boolean;
}

const EnumValueControl = ({
  value,
  options,
  onChange,
  error,
}: EnumValueControlProps) => (
  <div className="flex min-w-0 items-center">
    <Combobox
      value={value}
      options={options}
      onChange={(v) => onChange({ value: v })}
      placeholder="value"
      error={error}
      minWidth={150}
    />
  </div>
);

export default EnumValueControl;
