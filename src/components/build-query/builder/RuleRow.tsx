"use client";

import { useRef } from "react";
import {
  PiCopy,
  PiDotsSixVertical,
  PiWarningCircle,
  PiX,
} from "react-icons/pi";
import { cn } from "@/lib/utils";
import AppButton from "@/components/ui/app-button";
import Combobox from "@/components/ui/combobox";
import FieldIcon from "@/components/build-query/ui/FieldIcon";
import ValueControl from "@/components/build-query/builder/ValueControl";
import DropLine from "@/components/build-query/builder/DropLine";
import { OPERATORS, OPS_BY_TYPE } from "@/components/build-query/data";
import type { Errors, NodePatch, Rule } from "@/components/build-query/types";
import queryEngine from "@/components/build-query/query-engine";
import { type Option } from "..";
import useDropItem from "@/hooks/useDropItem";
import useQueryState from "@/hooks/useQueryState";

interface RuleRowProps {
  rule: Rule;
  errors: Errors;
  onChange: (patch: NodePatch) => void;
  onRemove: () => void;
  onDuplicate: () => void;
}

const RuleRow = ({
  rule,
  errors,
  onChange,
  onRemove,
  onDuplicate,
}: RuleRowProps) => {
  const { schema } = useQueryState();
  const rowRef = useRef<HTMLDivElement>(null);
  const field = schema.fieldMap[rule.field] ?? schema.fields[0];
  const err = errors[rule.id];
  const { onDragOver, onDrop, hintEdge, isDragging, dnd } = useDropItem(
    rule.id,
  );

  const fieldOpts: Option[] = schema.fields.map((f) => ({
    value: f.key,
    label: f.label,
    sub: f.type,
    icon: f.icon,
  }));
  const opOpts: Option[] = OPS_BY_TYPE[field.type].map((k) => ({
    value: k,
    label: OPERATORS[k].label,
    sub: OPERATORS[k].sym,
  }));

  const changeField = (key: string) => {
    const nf = schema.fieldMap[key];
    const keepOp = OPS_BY_TYPE[nf.type].includes(rule.op)
      ? rule.op
      : queryEngine.tree.defaultOperator(nf.type);
    onChange({ field: key, op: keepOp, value: "", value2: "" });
  };
  const changeOp = (op: string) => {
    const o = OPERATORS[op];
    const patch: NodePatch = { op };
    if (o.arity === 0) {
      patch.value = "";
      patch.value2 = "";
    }
    onChange(patch);
  };

  return (
    <div
      ref={rowRef}
      className={cn(
        "relative my-1 flex flex-wrap items-center gap-2 rounded-md border border-border-soft bg-surface py-1.75 pl-1.5 pr-2 shadow-sm transition-[border-color,box-shadow,opacity] duration-150 animate-fade-up hover:border-border-strong",
        isDragging && "opacity-40",
        err && "border-danger/60 bg-danger/6",
      )}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      {hintEdge === "before" && <DropLine edge="before" />}
      <span
        className="grid h-7.5 w-5.5 shrink-0 cursor-grab place-items-center rounded-[5px] text-faint opacity-55 transition hover:bg-surface-2 hover:text-muted-foreground hover:opacity-100 active:cursor-grabbing"
        draggable
        onDragStart={(e) => {
          e.dataTransfer.effectAllowed = "move";
          e.dataTransfer.setData("text/plain", rule.id);
          if (rowRef.current)
            e.dataTransfer.setDragImage(rowRef.current, 18, 22);
          dnd.start(rule.id);
        }}
        onDragEnd={() => dnd.end()}
        title="Drag to reorder"
      >
        <PiDotsSixVertical size={16} />
      </span>

      <div className="flex min-w-0 flex-1 flex-wrap items-center gap-1.75">
        <Combobox
          value={rule.field}
          options={fieldOpts}
          onChange={changeField}
          width={186}
          renderValue={(o) => (
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldIcon
                name={schema.fieldMap[o.value]?.icon ?? ""}
                size={13}
                className="shrink-0 text-faint"
              />
              <span className="font-jetbrains-mono">{o.label}</span>
            </span>
          )}
          renderOption={(o) => (
            <span className="flex min-w-0 items-center gap-1.5">
              <FieldIcon
                name={o.icon ?? ""}
                size={13}
                className="shrink-0 text-faint"
              />
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis font-jetbrains-mono">
                {o.label}
              </span>
              <span className="font-jetbrains-mono text-[10.5px] text-faint">
                {o.sub}
              </span>
            </span>
          )}
        />

        <Combobox
          value={rule.op}
          options={opOpts}
          onChange={changeOp}
          width={158}
          searchable={false}
          renderValue={(o) => (
            <span className="flex items-center gap-1.75">
              <span className="grid h-4.5 min-w-4.5 place-items-center rounded bg-surface-3 px-1 font-jetbrains-mono text-[11px] font-semibold text-accent">
                {OPERATORS[o.value].sym}
              </span>
              {OPERATORS[o.value].label}
            </span>
          )}
          renderOption={(o) => (
            <span className="flex items-center gap-1.75">
              <span className="grid h-4.5 min-w-4.5 place-items-center rounded bg-surface-3 px-1 font-jetbrains-mono text-[11px] font-semibold text-accent">
                {o.sub}
              </span>
              <span className="min-w-0 flex-1 overflow-hidden text-ellipsis">
                {o.label}
              </span>
            </span>
          )}
        />

        <ValueControl
          rule={rule}
          field={field}
          onChange={onChange}
          error={!!err}
        />
      </div>

      <div className="ml-auto flex items-center gap-0.5">
        <AppButton
          variant="ghost"
          size="icon-sm"
          aria-label="Duplicate rule"
          title="Duplicate rule"
          onClick={onDuplicate}
        >
          <PiCopy />
        </AppButton>
        <AppButton
          variant="ghost"
          size="icon-sm"
          aria-label="Remove rule"
          title="Remove rule"
          className="hover:bg-danger-dim hover:text-danger"
          onClick={onRemove}
        >
          <PiX />
        </AppButton>
      </div>

      {err && (
        <div className="flex basis-full items-center gap-1.5 pb-0.5 pl-7.5 pr-1 pt-1 text-[11.5px] text-danger animate-fade-up">
          <PiWarningCircle size={13} />
          {err.msg}
        </div>
      )}
      {hintEdge === "after" && <DropLine edge="after" />}
    </div>
  );
};

export default RuleRow;
