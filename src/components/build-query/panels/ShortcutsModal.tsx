"use client";

import { type ReactNode } from "react";
import { PiKeyboard, PiX } from "react-icons/pi";
import AppButton from "@/components/ui/app-button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const GROUPS: { title: string; items: { label: string; keys: string[] }[] }[] = [
  {
    title: "Builder",
    items: [
      { label: "Run the query", keys: ["⌘ / Ctrl", "↵"] },
      { label: "Save as a preset", keys: ["⌘ / Ctrl", "S"] },
      { label: "Open keyboard shortcuts", keys: ["?"] },
      { label: "Close a dialog or the menu", keys: ["Esc"] },
    ],
  },
  {
    title: "Guided tour",
    items: [
      { label: "Next step", keys: ["→"] },
      { label: "Previous step", keys: ["←"] },
      { label: "Dismiss the tour", keys: ["Esc"] },
    ],
  },
];

const Kbd = ({ children }: { children: ReactNode }) => (
  <kbd className="inline-flex h-5.5 min-w-5.5 items-center justify-center rounded border border-border bg-surface-2 px-1.5 font-jetbrains-mono text-[11px] font-medium text-muted-foreground">
    {children}
  </kbd>
);

const ShortcutsModal = ({ onClose }: { onClose: () => void }) => (
  <Dialog
    open
    onOpenChange={(o) => {
      if (!o) onClose();
    }}
  >
    <DialogContent
      showCloseButton={false}
      className="flex max-h-[88vh] w-full flex-col gap-0 overflow-hidden rounded-xl border border-border-strong bg-surface p-0 ring-0 sm:max-w-115"
    >
      <DialogHeader className="flex flex-row items-start justify-between gap-3 space-y-0 border-b border-border-soft px-4.5 pb-3.5 pt-4.5 text-left">
        <div className="flex items-center gap-3">
          <span className="grid size-8.5 place-items-center rounded-[10px] bg-accent-dim text-accent">
            <PiKeyboard size={18} />
          </span>
          <div>
            <DialogTitle className="font-chakra-petch text-[16px] font-semibold tracking-[0.2px]">
              Keyboard shortcuts
            </DialogTitle>
            <DialogDescription className="mt-px text-[12.5px] text-faint">
              Drive the builder without leaving the keyboard
            </DialogDescription>
          </div>
        </div>
        <DialogClose asChild>
          <AppButton variant="ghost" size="icon" aria-label="Close" title="Close">
            <PiX />
          </AppButton>
        </DialogClose>
      </DialogHeader>

      <div className="qf-scroll flex flex-col gap-5 overflow-auto p-4.5">
        {GROUPS.map((group) => (
          <div key={group.title}>
            <div className="mb-2 font-jetbrains-mono text-[11px] font-semibold uppercase tracking-[0.6px] text-faint">
              {group.title}
            </div>
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 rounded-md px-2.5 py-2 transition hover:bg-surface-2"
                >
                  <span className="text-[13.5px] text-foreground">
                    {item.label}
                  </span>
                  <span className="flex shrink-0 items-center gap-1">
                    {item.keys.map((key) => (
                      <Kbd key={key}>{key}</Kbd>
                    ))}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </DialogContent>
  </Dialog>
);

export default ShortcutsModal;
