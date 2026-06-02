"use client";

import { useState } from "react";
import {
  PiArrowCounterClockwise,
  PiClockCounterClockwise,
  PiTrash,
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
import BrandMark from "@/components/build-query/ui/BrandMark";
import ConfirmDialog from "@/components/build-query/panels/ConfirmDialog";
import type { Group, HistoryEntry } from "@/components/build-query/types";

interface HistoryModalProps {
  history: HistoryEntry[];
  onLoad: (t: Group) => void;
  onDelete: (ts: number) => void;
  onClear: () => void;
  onClose: () => void;
}

type Confirm = { kind: "one"; ts: number } | { kind: "all" };

const HistoryModal = ({
  history,
  onLoad,
  onDelete,
  onClear,
  onClose,
}: HistoryModalProps) => {
  const [confirm, setConfirm] = useState<Confirm | null>(null);

  return (
    <>
      <Dialog
        open
        onOpenChange={(o) => {
          if (!o) onClose();
        }}
      >
        <DialogContent
          showCloseButton={false}
          className="flex max-h-[88vh] w-full flex-col gap-0 overflow-hidden rounded-xl border border-border-strong bg-surface p-0 ring-0 sm:max-w-140"
        >
          <DialogHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-border-soft px-4.5 pb-3.5 pt-4.5 text-left">
            <div className="flex items-center gap-3">
              <span className="grid size-8.5 place-items-center rounded-[10px] bg-accent-dim text-accent">
                <PiClockCounterClockwise size={18} />
              </span>
              <div>
                <DialogTitle className="font-chakra-petch text-[16px] font-semibold tracking-[0.2px]">
                  Query history
                </DialogTitle>
                <DialogDescription className="mt-px text-[12.5px] text-faint">
                  Recent runs — restore any to continue
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
            <div className="qf-scroll flex max-h-[50vh] flex-col gap-1.5 overflow-auto">
              {history.length === 0 && (
                <div className="p-7.5 text-center font-jetbrains-mono text-[12.5px] text-faint">
                  No queries run yet
                </div>
              )}
              {history.map((h) => (
                <div
                  key={h.ts}
                  className="flex items-center gap-2.75 rounded-md border border-border-soft bg-surface-2 px-3 py-2.5 transition hover:border-border-strong"
                >
                  <BrandMark
                    size="sm"
                    ghost
                    icon={<PiClockCounterClockwise size={14} />}
                  />
                  <div className="min-w-0 flex-1">
                    <code className="block max-w-90 overflow-hidden text-ellipsis whitespace-nowrap font-jetbrains-mono text-[11.5px] text-muted-foreground">
                      {h.sql}
                    </code>
                    <div className="mt-px font-jetbrains-mono text-[11px] text-faint">
                      {h.count.toLocaleString()} rows ·{" "}
                      {new Date(h.ts).toLocaleTimeString("en-US", {
                        hour: "2-digit",
                        minute: "2-digit",
                        second: "2-digit",
                      })}
                    </div>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <AppButton
                      variant="secondary"
                      size="sm"
                      onClick={() => {
                        onLoad(h.tree);
                        onClose();
                      }}
                    >
                      <PiArrowCounterClockwise />
                      Restore
                    </AppButton>
                    <AppButton
                      variant="ghost"
                      size="icon-sm"
                      aria-label="Delete from history"
                      title="Delete from history"
                      className="hover:bg-danger-dim hover:text-danger"
                      onClick={() => setConfirm({ kind: "one", ts: h.ts })}
                    >
                      <PiTrash />
                    </AppButton>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {history.length > 0 && (
            <div className="flex items-center justify-between border-t border-border-soft bg-surface-2 px-4.5 py-3">
              <span className="font-jetbrains-mono text-[11.5px] text-faint">
                {history.length} {history.length === 1 ? "query" : "queries"}
              </span>
              <AppButton
                variant="destructive"
                size="sm"
                onClick={() => setConfirm({ kind: "all" })}
              >
                <PiTrash />
                Delete all history
              </AppButton>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <ConfirmDialog
        open={confirm !== null}
        title={confirm?.kind === "all" ? "Delete all history?" : "Delete query?"}
        description={
          confirm?.kind === "all"
            ? `All ${history.length} ${history.length === 1 ? "query" : "queries"} will be removed from your history. This can't be undone.`
            : "This query will be removed from your history. This can't be undone."
        }
        confirmLabel={confirm?.kind === "all" ? "Delete all" : "Delete"}
        onCancel={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.kind === "all") onClear();
          else if (confirm?.kind === "one") onDelete(confirm.ts);
          setConfirm(null);
        }}
      />
    </>
  );
};

export default HistoryModal;
