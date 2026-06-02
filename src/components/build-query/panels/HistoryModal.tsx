import {
  PiArrowCounterClockwise,
  PiClockCounterClockwise,
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
import type { Group, HistoryEntry } from "@/components/build-query/types";

interface HistoryModalProps {
  history: HistoryEntry[];
  onLoad: (t: Group) => void;
  onClose: () => void;
}

const HistoryModal = ({ history, onLoad, onClose }: HistoryModalProps) => {
  return (
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
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default HistoryModal;
