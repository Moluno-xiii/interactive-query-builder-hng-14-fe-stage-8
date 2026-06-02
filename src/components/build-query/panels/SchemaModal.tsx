"use client";

import { useState } from "react";
import { PiCaretRight, PiDatabase, PiX } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/ui/app-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import BrandMark from "@/components/build-query/ui/BrandMark";
import FieldIcon from "@/components/build-query/ui/FieldIcon";
import { ENUMS } from "@/components/build-query/data";
import type { Schema } from "@/components/build-query/types";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";

const SchemaRow = ({
  s,
  active,
  onSelect,
}: {
  s: Schema;
  active: boolean;
  onSelect: () => void;
}) => {
  const [open, setOpen] = useState(active);
  return (
    <div
      className={cn(
        "rounded-md border bg-surface-2 transition",
        active ? "border-accent" : "border-border-soft hover:border-border-strong",
      )}
    >
      <div className="flex items-center gap-2.5 px-3 py-2.5">
        <button
          className="grid size-6 shrink-0 place-items-center rounded text-faint transition hover:bg-surface-3 hover:text-foreground"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? "Hide fields" : "Show fields"}
          title={open ? "Hide fields" : "Show fields"}
        >
          <PiCaretRight
            size={13}
            className={cn("transition-transform", open && "rotate-90")}
          />
        </button>
        <BrandMark size="sm" ghost={!active} icon={<PiDatabase size={14} />} />
        <div className="min-w-0 flex-1">
          <div className="font-jetbrains-mono text-[13.5px] font-semibold">
            {s.label}
          </div>
          <div className="mt-px text-[11.5px] text-faint">
            {s.fields.length} fields · {s.rows.length.toLocaleString()} rows ·
            postgres
          </div>
        </div>
        {active ? (
          <Badge className="h-5.5 gap-1 rounded-sm border-transparent bg-accent-dim px-2 text-[11px] font-semibold leading-none tracking-[0.2px] text-accent">
            active
          </Badge>
        ) : (
          <AppButton variant="secondary" size="sm" onClick={onSelect}>
            Use table
          </AppButton>
        )}
      </div>
      {open && (
        <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 border-t border-border-soft px-3 py-2 sm:grid-cols-2">
          {s.fields.map((f) => (
            <div
              key={f.key}
              className="flex items-center gap-2.25 px-1 py-1.5"
            >
              <FieldIcon name={f.icon} size={14} className="text-faint" />
              <span className="flex-1 font-jetbrains-mono text-[12px]">
                {f.label}
              </span>
              <Badge className="h-4.75 gap-1 rounded-sm border-border-soft bg-surface px-1.75 text-[11px] font-jetbrains-mono font-medium leading-none tracking-[0.2px] text-faint">
                {f.type}
                {f.enum ? ` · ${ENUMS[f.enum].length}` : ""}
              </Badge>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const SchemaModal = ({ onClose }: { onClose: () => void }) => {
  const { schema, schemas } = useQueryState();
  const { setSchema } = useQueryActions();
  return (
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] w-full flex-col gap-0 overflow-hidden rounded-xl border border-border-strong bg-surface p-0 ring-0 sm:max-w-155"
      >
        <DialogHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-border-soft px-4.5 pb-3.5 pt-4.5 text-left">
          <div className="flex items-center gap-3">
            <span className="grid size-8.5 place-items-center rounded-[10px] bg-accent-dim text-accent">
              <PiDatabase size={18} />
            </span>
            <div>
              <DialogTitle className="font-chakra-petch text-[16px] font-semibold tracking-[0.2px]">
                Data sources
              </DialogTitle>
              <DialogDescription className="mt-px text-[12.5px] text-faint">
                Pick the table your query runs against — switching starts a fresh
                query
              </DialogDescription>
            </div>
          </div>
          <DialogClose asChild>
            <AppButton
              variant="ghost"
              size="icon"
              aria-label="Close"
              title="Close"
            >
              <PiX />
            </AppButton>
          </DialogClose>
        </DialogHeader>

        <div className="qf-scroll overflow-auto p-4.5">
          <div className="flex flex-col gap-2">
            {schemas.map((s) => (
              <SchemaRow
                key={s.id}
                s={s}
                active={s.id === schema.id}
                onSelect={() => {
                  setSchema(s.id);
                  onClose();
                }}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchemaModal;
