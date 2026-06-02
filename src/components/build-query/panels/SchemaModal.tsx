import { PiDatabase, PiX } from "react-icons/pi";
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
import { DATASET, ENUMS, SCHEMA } from "@/components/build-query/data";

const SchemaModal = ({ onClose }: { onClose: () => void }) => {
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
                Data source
              </DialogTitle>
              <DialogDescription className="mt-px text-[12.5px] text-faint">
                The dataset your query runs against
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
          <div className="mb-4 rounded-md border border-border bg-surface-2 p-3.5">
            <div className="flex items-center gap-2.75">
              <BrandMark size="sm" icon={<PiDatabase size={14} />} />
              <div>
                <div className="font-jetbrains-mono text-[14px] font-semibold">
                  {SCHEMA.name}
                </div>
                <div className="mt-px text-[12px] text-faint">
                  {SCHEMA.fields.length} fields · {DATASET.length.toLocaleString()} rows ·
                  postgres
                </div>
              </div>
              <Badge className="ml-auto h-4.75 gap-1 rounded-sm border-transparent bg-accent-dim px-1.75 text-[11px] font-semibold leading-none tracking-[0.2px] text-accent">
                connected
              </Badge>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-4 gap-y-0.5 sm:grid-cols-2">
            {SCHEMA.fields.map((f) => (
              <div
                key={f.key}
                className="flex items-center gap-2.25 border-b border-border-soft px-1 py-1.75"
              >
                <FieldIcon name={f.icon} size={14} className="text-faint" />
                <span className="flex-1 font-jetbrains-mono text-[12.5px]">
                  {f.label}
                </span>
                <Badge className="h-4.75 gap-1 rounded-sm border-border-soft bg-surface-2 px-1.75 text-[11px] font-jetbrains-mono font-medium leading-none tracking-[0.2px] text-faint">
                  {f.type}
                  {f.enum ? ` · ${ENUMS[f.enum].length}` : ""}
                </Badge>
              </div>
            ))}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default SchemaModal;
