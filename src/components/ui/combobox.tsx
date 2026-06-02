"use client";

import { useState, type ReactNode } from "react";
import { PiCaretDown, PiCheck } from "react-icons/pi";
import { cn } from "@/lib/utils";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import type { Option } from "@/components/build-query";

interface ComboboxProps {
  value: string;
  options: Option[];
  onChange: (v: string) => void;
  placeholder?: string;
  searchable?: boolean;
  renderValue?: (o: Option) => ReactNode;
  renderOption?: (o: Option) => ReactNode;
  width?: number;
  minWidth?: number;
  error?: boolean;
  className?: string;
}

const Combobox = ({
  value,
  options,
  onChange,
  placeholder = "Select…",
  searchable = true,
  renderValue,
  renderOption,
  width,
  minWidth,
  error,
  className,
}: ComboboxProps) => {
  const [open, setOpen] = useState(false);
  const sel = options.find((o) => o.value === value);
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          type="button"
          className={cn(
            "inline-flex h-8 min-w-0 items-center justify-between gap-1.75 rounded-sm border border-border bg-inset pl-2.5 pr-2 text-[13px] text-foreground transition-[background-color,border-color,box-shadow] duration-150 hover:border-border-strong hover:bg-surface",
            open && "border-accent bg-surface ring-[3px] ring-accent-dim",
            error && "border-danger",
            className,
          )}
          style={{ width, minWidth }}
        >
          <span className="min-w-0 overflow-hidden text-ellipsis whitespace-nowrap">
            {sel ? (
              renderValue ? (
                renderValue(sel)
              ) : (
                sel.label
              )
            ) : (
              <span className="text-faint">{placeholder}</span>
            )}
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
        className="w-(--radix-popover-trigger-width) min-w-49 gap-0 rounded-md border border-border-strong bg-surface p-0 shadow-pop ring-0"
      >
        <Command className="bg-transparent">
          {searchable && options.length > 6 && (
            <CommandInput placeholder="Filter…" />
          )}
          <CommandList className="qf-scroll">
            <CommandEmpty className="p-3.5 text-[12px] text-faint">
              No matches
            </CommandEmpty>
            <CommandGroup className="p-1.25">
              {options.map((o) => (
                <CommandItem
                  key={o.value}
                  value={`${o.label} ${o.sub ?? ""}`}
                  onSelect={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={cn(
                    "gap-2 px-2.25 py-1.75 text-[13px] text-foreground",
                    o.value === value &&
                      "bg-accent-dim text-accent data-selected:bg-accent-dim data-selected:text-accent",
                  )}
                >
                  {renderOption ? (
                    renderOption(o)
                  ) : (
                    <>
                      <span className="min-w-0 flex-1 overflow-hidden text-ellipsis">
                        {o.label}
                      </span>
                      {o.sub && (
                        <span className="font-jetbrains-mono text-[10.5px] text-faint">
                          {o.sub}
                        </span>
                      )}
                    </>
                  )}
                  {o.value === value && (
                    <PiCheck
                      size={14}
                      className="ml-auto shrink-0 text-accent"
                    />
                  )}
                </CommandItem>
              ))}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default Combobox;
