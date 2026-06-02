"use client";

import SchemaModal from "@/components/build-query/panels/SchemaModal";
import IOModal from "@/components/build-query/panels/IOModal";
import PresetsModal from "@/components/build-query/panels/PresetsModal";
import HistoryModal from "@/components/build-query/panels/HistoryModal";
import useQueryActions from "@/hooks/useQueryActions";
import useQueryState from "@/hooks/useQueryState";

const QueryModals = () => {
  const { modal, tree, presets, history } = useQueryState();
  const {
    setModal,
    importTree,
    savePreset,
    loadTree,
    deletePreset,
    deleteHistory,
    clearHistory,
  } = useQueryActions();

  if (!modal) return null;
  const onClose = () => setModal(null);

  return (
    <>
      {modal === "schema" && <SchemaModal onClose={onClose} />}
      {modal === "io" && (
        <IOModal tree={tree} onImport={importTree} onClose={onClose} />
      )}
      {modal === "presets" && (
        <PresetsModal
          presets={presets}
          current={tree}
          onSave={savePreset}
          onLoad={loadTree}
          onDelete={deletePreset}
          onClose={onClose}
        />
      )}
      {modal === "history" && (
        <HistoryModal
          history={history}
          onLoad={loadTree}
          onDelete={deleteHistory}
          onClear={clearHistory}
          onClose={onClose}
        />
      )}
    </>
  );
};

export default QueryModals;
