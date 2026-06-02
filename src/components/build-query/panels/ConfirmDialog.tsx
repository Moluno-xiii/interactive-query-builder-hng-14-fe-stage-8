"use client";

import { PiWarning } from "react-icons/pi";
import AppButton from "@/components/ui/app-button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface ConfirmDialogProps {
  open: boolean;
  title: string;
  description: string;
  confirmLabel?: string;
  cancelLabel?: string;
  onConfirm: () => void;
  onCancel: () => void;
}

const ConfirmDialog = ({
  open,
  title,
  description,
  confirmLabel = "Delete",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
}: ConfirmDialogProps) => (
  <Dialog
    open={open}
    onOpenChange={(o) => {
      if (!o) onCancel();
    }}
  >
    <DialogContent
      showCloseButton={false}
      className="flex w-full flex-col gap-0 overflow-hidden rounded-xl border border-border-strong bg-surface p-0 ring-0 sm:max-w-105"
    >
      <DialogHeader className="flex flex-row items-start gap-3 space-y-0 px-4.5 pb-2 pt-4.5 text-left">
        <span className="grid size-8.5 shrink-0 place-items-center rounded-[10px] bg-danger-dim text-danger">
          <PiWarning size={18} />
        </span>
        <div>
          <DialogTitle className="font-chakra-petch text-[16px] font-semibold tracking-[0.2px]">
            {title}
          </DialogTitle>
          <DialogDescription className="mt-px text-[12.5px] leading-[1.5] text-faint">
            {description}
          </DialogDescription>
        </div>
      </DialogHeader>
      <div className="flex items-center justify-end gap-2 px-4.5 pb-4.5 pt-4">
        <AppButton variant="secondary" onClick={onCancel}>
          {cancelLabel}
        </AppButton>
        <AppButton variant="destructive" onClick={onConfirm}>
          {confirmLabel}
        </AppButton>
      </div>
    </DialogContent>
  </Dialog>
);

export default ConfirmDialog;
