"use client";

import { ENUMS, OPERATORS } from "@/components/build-query/data";
import type { Field, NodePatch, Rule } from "@/components/build-query/types";
import { type Option } from "..";
import MultiValueControl from "./MultiValueControl";
import EnumValueControl from "./EnumValueControl";
import RangeValueControl from "./RangeValueControl";
import ScalarValueControl from "./ScalarValueControl";

interface ValueControlProps {
  rule: Rule;
  field: Field;
  onChange: (patch: NodePatch) => void;
  error: boolean;
}

const ValueControl = ({ rule, field, onChange, error }: ValueControlProps) => {
  const op = OPERATORS[rule.op];

  if (op.arity === 0) {
    return (
      <span className="px-2 font-jetbrains-mono text-[12px] italic text-faint">
        {op.label}
      </span>
    );
  }

  const enumOpts: Option[] | null = field.enum
    ? ENUMS[field.enum].map((v) => ({ value: v, label: v }))
    : null;

  if (op.multi)
    return (
      <MultiValueControl
        value={rule.value}
        options={enumOpts}
        onChange={onChange}
        error={error}
      />
    );

  if (field.type === "enum" && enumOpts)
    return (
      <EnumValueControl
        value={rule.value}
        options={enumOpts}
        onChange={onChange}
        error={error}
      />
    );

  if (op.arity === 2)
    return (
      <RangeValueControl
        type={field.type === "date" ? "date" : "number"}
        value={rule.value}
        value2={rule.value2}
        onChange={onChange}
        error={error}
      />
    );

  return (
    <ScalarValueControl
      type={
        field.type === "number"
          ? "number"
          : field.type === "date"
            ? "date"
            : "text"
      }
      value={rule.value}
      placeholder={field.type === "number" ? "0" : "value…"}
      onChange={onChange}
      error={error}
    />
  );
};

export default ValueControl;
