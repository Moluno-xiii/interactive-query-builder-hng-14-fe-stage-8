import SchemaModal from "@/components/build-query/panels/SchemaModal";
import IOModal from "@/components/build-query/panels/IOModal";
import PresetsModal from "@/components/build-query/panels/PresetsModal";
import HistoryModal from "@/components/build-query/panels/HistoryModal";
import type { Group, HistoryEntry, Preset } from "@/components/build-query/types";
import { ModalKind } from ".";

interface QueryModalsProps {
  modal: ModalKind | null;
  tree: Group;
  presets: Preset[];
  history: HistoryEntry[];
  onClose: () => void;
  onImport: (t: Group) => void;
  onSavePreset: (name: string) => void;
  onLoadTree: (t: Group) => void;
  onDeletePreset: (ts: number) => void;
  onDeleteHistory: (ts: number) => void;
  onClearHistory: () => void;
}

const QueryModals = ({
  modal,
  tree,
  presets,
  history,
  onClose,
  onImport,
  onSavePreset,
  onLoadTree,
  onDeletePreset,
  onDeleteHistory,
  onClearHistory,
}: QueryModalsProps) => {
  if (!modal) return null;

  return (
    <>
      {modal === "schema" && <SchemaModal onClose={onClose} />}
      {modal === "io" && (
        <IOModal tree={tree} onImport={onImport} onClose={onClose} />
      )}
      {modal === "presets" && (
        <PresetsModal
          presets={presets}
          current={tree}
          onSave={onSavePreset}
          onLoad={onLoadTree}
          onDelete={onDeletePreset}
          onClose={onClose}
        />
      )}
      {modal === "history" && (
        <HistoryModal
          history={history}
          onLoad={onLoadTree}
          onDelete={onDeleteHistory}
          onClear={onClearHistory}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default QueryModals;
