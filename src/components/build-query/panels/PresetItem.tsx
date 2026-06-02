import AppButton from "@/components/ui/app-button";
import { PiBookmark, PiTrash } from "react-icons/pi";
import BrandMark from "../ui/BrandMark";
import { schemaById } from "@/components/build-query/data";
import type { Preset } from "@/components/build-query/types";

const PresetItem = ({
  p,
  onClick,
  onDelete,
}: {
  p: Preset;
  onDelete: (a: number) => void;
  onClick: () => void;
}) => {
  return (
    <div
      key={p.ts}
      className="flex items-center gap-2.75 rounded-md border border-border-soft bg-surface-2 px-3 py-2.5 transition hover:border-border-strong"
    >
      <BrandMark size="sm" ghost icon={<PiBookmark size={14} />} />
      <div className="min-w-0 flex-1">
        <div className="text-[13px] font-semibold">{p.name}</div>
        <div className="mt-px font-jetbrains-mono text-[11px] text-faint">
          {schemaById(p.schemaId).label} ·{" "}
          {new Date(p.ts).toLocaleString("en-US", {
            month: "short",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </div>
      </div>
      <AppButton variant="secondary" size="sm" onClick={onClick}>
        Load
      </AppButton>
      <AppButton
        variant="ghost"
        size="icon-sm"
        aria-label="Delete preset"
        title="Delete preset"
        className="hover:bg-danger-dim hover:text-danger"
        onClick={() => onDelete(p.ts)}
      >
        <PiTrash />
      </AppButton>
    </div>
  );
};

export default PresetItem;
