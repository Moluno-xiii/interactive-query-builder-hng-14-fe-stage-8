"use client";

import SchemaModal from "@/components/build-query/panels/SchemaModal";
import IOModal from "@/components/build-query/panels/IOModal";
import PresetsModal from "@/components/build-query/panels/PresetsModal";
import HistoryModal from "@/components/build-query/panels/HistoryModal";
import ShortcutsModal from "@/components/build-query/panels/ShortcutsModal";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";

const QueryModals = () => {
  const { modal, tree, presets, history } = useQueryState();
  const {
    setModal,
    savePreset,
    deletePreset,
    deleteHistory,
    clearHistory,
    loadQuery,
  } = useQueryActions();

  if (!modal) return null;
  const onClose = () => setModal(null);

  return (
    <>
      {modal === "schema" && <SchemaModal onClose={onClose} />}
      {modal === "io" && (
        <IOModal tree={tree} onImport={loadQuery} onClose={onClose} />
      )}
      {modal === "presets" && (
        <PresetsModal
          presets={presets}
          current={tree}
          onSave={savePreset}
          onLoad={loadQuery}
          onDelete={deletePreset}
          onClose={onClose}
        />
      )}
      {modal === "history" && (
        <HistoryModal
          history={history}
          onLoad={loadQuery}
          onDelete={deleteHistory}
          onClear={clearHistory}
          onClose={onClose}
        />
      )}
      {modal === "shortcuts" && <ShortcutsModal onClose={onClose} />}
    </>
  );
};

export default QueryModals;
