"use client";

import { useState } from "react";
import {
  PiCheck,
  PiCode,
  PiCopy,
  PiUploadSimple,
  PiWarningCircle,
  PiX,
} from "react-icons/pi";
import AppButton from "@/components/ui/app-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { SCHEMA } from "@/components/build-query/data";
import type { Group } from "@/components/build-query/types";

interface IOModalProps {
  tree: Group;
  onImport: (t: Group) => void;
  onClose: () => void;
}

const IOModal = ({ tree, onImport, onClose }: IOModalProps) => {
  const json = JSON.stringify({ source: SCHEMA.name, query: tree }, null, 2);
  const [text, setText] = useState(json);
  const [err, setErr] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const doImport = () => {
    try {
      const p = JSON.parse(text);
      const t = (p.query || p) as Group;
      if (!t.kind) throw new Error("bad");
      onImport(t);
      onClose();
    } catch {
      setErr("Not a valid query JSON object");
    }
  };
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
              <PiCode size={18} />
            </span>
            <div>
              <DialogTitle className="font-chakra-petch text-[16px] font-semibold tracking-[0.2px]">
                Import / Export
              </DialogTitle>
              <DialogDescription className="mt-px text-[12.5px] text-faint">
                Move query definitions as JSON
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
          <textarea
            className="qf-scroll h-80 w-full resize-y rounded-md border border-border bg-inset p-3.5 font-jetbrains-mono text-[12px] leading-[1.6] text-foreground outline-none focus:border-accent focus:ring-[3px] focus:ring-accent-dim"
            spellCheck={false}
            value={text}
            onChange={(e) => {
              setText(e.target.value);
              setErr(null);
            }}
          />
          {err && (
            <div className="mt-2.5 flex items-center gap-1.75 text-[12.5px] text-danger">
              <PiWarningCircle size={13} />
              {err}
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 border-t border-border-soft bg-surface-2 px-4.5 py-3.5">
          <AppButton
            variant="ghost"
            onClick={() => {
              if (navigator.clipboard) navigator.clipboard.writeText(text);
              setCopied(true);
              setTimeout(() => setCopied(false), 1400);
            }}
          >
            {copied ? <PiCheck /> : <PiCopy />}
            {copied ? "Copied" : "Copy JSON"}
          </AppButton>
          <div className="flex-1" />
          <AppButton variant="secondary" onClick={onClose}>
            Cancel
          </AppButton>
          <AppButton variant="default" onClick={doImport}>
            <PiUploadSimple />
            Import
          </AppButton>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default IOModal;
