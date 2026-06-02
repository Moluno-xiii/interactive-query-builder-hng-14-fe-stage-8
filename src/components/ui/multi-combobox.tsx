"use client";

import { useState } from "react";
import { PiCaretDown, PiCheck } from "react-icons/pi";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Option } from "@/components/build-query";

interface MultiComboboxProps {
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  placeholder?: string;
  error?: boolean;
}

const MultiCombobox = ({
  value,
  options,
  onChange,
  placeholder = "Select values…",
  error,
}: MultiComboboxProps) => {
  const [open, setOpen] = useState(false);
  const sel = value
    ? value
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : [];
  const toggle = (v: string) => {
    const next = sel.includes(v) ? sel.filter((x) => x !== v) : [...sel, v];
    onChange(next.join(","));
  };
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex min-h-8 min-w-0 items-center justify-between gap-1.75 rounded-sm border border-border bg-inset px-2 py-1 text-[13px] text-foreground transition-[background-color,border-color,box-shadow] duration-150 hover:border-border-strong hover:bg-surface",
            open && "border-accent bg-surface ring-[3px] ring-accent-dim",
            error && "border-danger",
          )}
        >
          <span className="flex min-w-0 flex-1 flex-wrap gap-1">
            {sel.length === 0 && (
              <span className="text-faint">{placeholder}</span>
            )}
            {sel.map((s) => (
              <span
                key={s}
                className="rounded bg-surface-3 px-1.5 py-0.5 font-jetbrains-mono text-[11px] text-foreground"
              >
                {s}
              </span>
            ))}
          </span>
          <PiCaretDown
            size={13}
            className={cn(
              "shrink-0 text-faint transition-transform duration-200",
              open && "rotate-180",
            )}
          />
        </button>
      </PopoverTrigger>
      <PopoverContent
        align="start"
        sideOffset={6}
        className="w-(--radix-popover-trigger-width) min-w-50 gap-0 rounded-md border border-border-strong bg-surface p-0 shadow-pop ring-0"
      >
        <Command className="bg-transparent">
          <CommandList className="qf-scroll">
            <CommandGroup className="p-1.25">
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={o.label}
                  onSelect={() => toggle(o.value)}
                  className={cn(
                    "gap-2 px-2.25 py-1.75 text-[13px] text-foreground",
                    sel.includes(o.value) &&
                      "bg-accent-dim text-accent data-selected:text-accent",
                  )}
                >
                  <span
                    className={cn(
                      "grid size-3.75 shrink-0 place-items-center rounded border-[1.5px] border-border-strong text-accent-foreground",
                      sel.includes(o.value) && "border-accent bg-accent",
                    )}
                  >
                    {sel.includes(o.value) && <PiCheck size={11} />}
                  </span>
                  <span className="min-w-0 flex-1 overflow-hidden text-ellipsis">
                    {o.label}
                  </span>
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default MultiCombobox;
