"use client";

import { useState } from "react";
import { PiBookmark, PiX } from "react-icons/pi";
import { cn } from "@/lib/utils";
import AppButton from "@/components/ui/app-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { Group, Preset } from "@/components/build-query/types";
import { inputBase } from "..";
import PresetItem from "./PresetItem";

interface PresetsModalProps {
  presets: Preset[];
  current: Group;
  onSave: (name: string) => void;
  onLoad: (tree: Group, schemaId: string) => void;
  onDelete: (ts: number) => void;
  onClose: () => void;
}

const PresetsModal = ({
  presets,
  onSave,
  onLoad,
  onDelete,
  onClose,
}: PresetsModalProps) => {
  const [name, setName] = useState("");
  return (
    <Dialog
      open
      onOpenChange={(o) => {
        if (!o) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex max-h-[88vh] w-full flex-col gap-0 overflow-hidden rounded-xl border border-border-strong bg-surface p-0 ring-0 sm:max-w-135"
      >
        <DialogHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-border-soft px-4.5 pb-3.5 pt-4.5 text-left">
          <div className="flex items-center gap-3">
            <span className="grid size-8.5 place-items-center rounded-[10px] bg-accent-dim text-accent">
              <PiBookmark size={18} />
            </span>
            <div>
              <DialogTitle className="font-chakra-petch text-[16px] font-semibold tracking-[0.2px]">
                Saved presets
              </DialogTitle>
              <DialogDescription className="mt-px text-[12.5px] text-faint">
                Name and reuse query configurations
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
          <div className="mb-4 flex gap-2">
            <input
              className={cn(inputBase, "h-9 flex-1 font-space-grotesk")}
              placeholder="Name this query…"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && name.trim()) {
                  onSave(name.trim());
                  setName("");
                }
              }}
            />
            <AppButton
              variant="default"
              disabled={!name.trim()}
              onClick={() => {
                onSave(name.trim());
                setName("");
              }}
            >
              <PiBookmark />
              Save current
            </AppButton>
          </div>
          <div className="qf-scroll flex max-h-[50vh] flex-col gap-1.5 overflow-auto">
            {presets.length === 0 && (
              <div className="p-7.5 text-center font-jetbrains-mono text-[12.5px] text-faint">
                No presets saved yet
              </div>
            )}
            {presets.map((p) => (
              <PresetItem
                key={p.ts}
                p={p}
                onClick={() => {
                  onLoad(p.tree, p.schemaId);
                  onClose();
                }}
                onDelete={onDelete}
              />
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PresetsModal;
