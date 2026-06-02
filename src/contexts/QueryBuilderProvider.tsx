"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import type {
  Action,
  Group,
  HistoryEntry,
  Preset,
  Row,
} from "@/components/build-query/types";
import type { ModalKind } from "@/components/build-query";
import { FIELD_MAP } from "@/components/build-query/data";
import queryEngine from "@/components/build-query/query-engine";
import localStorageStore from "@/lib/local-storage";
import Loading from "@/components/build-query/Loading";
import QueryStateProvider, {
  type QueryState,
  type RunState,
  type Sort,
} from "@/contexts/QueryStateContext";
import QueryActionsProvider, {
  type QueryActions,
} from "@/contexts/QueryActionsContext";

const subscribeMounted = () => () => {};
const getMounted = () => true;
const getMountedServer = () => false;

const QueryBuilderProvider = ({ children }: { children: ReactNode }) => {
  const mounted = useSyncExternalStore(
    subscribeMounted,
    getMounted,
    getMountedServer,
  );

  const [tree, setTree] = useState<Group>(
    () =>
      localStorageStore.get<Group | null>("qf_tree") ||
      queryEngine.tree.starterTree(),
  );
  const [modal, setModal] = useState<ModalKind | null>(null);
  const [presets, setPresets] = useState<Preset[]>(
    () => localStorageStore.get<Preset[]>("qf_presets") ?? [],
  );
  const [history, setHistory] = useState<HistoryEntry[]>(
    () => localStorageStore.get<HistoryEntry[]>("qf_history") ?? [],
  );
  const [runState, setRunState] = useState<RunState>("idle");
  const [results, setResults] = useState<Row[]>([]);
  const [sort, setSort] = useState<Sort>({ col: null, dir: "asc" });
  const [page, setPage] = useState(0);

  const treeRef = useRef(tree);
  useEffect(() => {
    treeRef.current = tree;
  }, [tree]);

  useEffect(() => {
    if (mounted) localStorageStore.set("qf_tree", tree);
  }, [tree, mounted]);
  useEffect(() => {
    if (mounted) localStorageStore.set("qf_presets", presets);
  }, [presets, mounted]);
  useEffect(() => {
    if (mounted) localStorageStore.set("qf_history", history);
  }, [history, mounted]);

  const dispatch = (a: Action) =>
    setTree((t) => queryEngine.tree.applyAction(t, a));

  const run = useCallback(() => {
    setRunState("loading");
    setPage(0);
    setTimeout(() => {
      const t = treeRef.current;
      const rows = queryEngine.evaluation.runQuery(t);
      setResults(rows);
      setRunState("done");
      const sql = queryEngine.sql
        .sqlString(t)
        .replace(/\s+/g, " ")
        .replace("SELECT * FROM orders WHERE ", "")
        .replace(";", "");
      setHistory((h) =>
        [
          {
            ts: Date.now(),
            sql: sql.length > 92 ? sql.slice(0, 92) + "…" : sql,
            count: rows.length,
            tree: queryEngine.tree.clone(t),
          },
          ...h,
        ].slice(0, 12),
      );
    }, 500);
  }, []);

  const onSort = (col: string) =>
    setSort((s) =>
      s.col === col
        ? { col, dir: s.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" },
    );

  const clearBuilder = () => setTree(queryEngine.tree.makeGroup("AND", []));
  const savePreset = (name: string) =>
    setPresets((p) => [
      queryEngine.presets.buildPreset(name, treeRef.current),
      ...p,
    ]);
  const deletePreset = (ts: number) =>
    setPresets((p) => p.filter((x) => x.ts !== ts));
  const importTree = (t: Group) => {
    queryEngine.tree.reId(t);
    setTree(t);
  };
  const loadTree = (t: Group) => {
    const c = queryEngine.tree.clone(t);
    queryEngine.tree.reId(c);
    setTree(c);
  };
  const deleteHistory = (ts: number) =>
    setHistory((h) => h.filter((x) => x.ts !== ts));
  const clearHistory = () => setHistory([]);

  const ranOnce = useRef(false);
  useEffect(() => {
    if (mounted && !ranOnce.current) {
      ranOnce.current = true;
      run();
    }
  }, [mounted, run]);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        setModal("presets");
      }
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [run]);

  const errors = queryEngine.validation.validate(tree);
  const errorCount = Object.keys(errors).length;
  const completeCount = queryEngine.tree.countComplete(tree);

  const sortedResults = (() => {
    if (!sort.col) return results;
    const col = sort.col;
    const f = FIELD_MAP[col];
    const arr = [...results].sort((a, b) => {
      const x = a[col];
      const y = b[col];
      if (f.type === "number" || f.type === "date") {
        return (Number(x) || 0) - (Number(y) || 0);
      }
      return String(x).localeCompare(String(y));
    });
    return sort.dir === "desc" ? arr.reverse() : arr;
  })();

  const allCollapsed = (() => {
    let any = false;
    let all = true;
    queryEngine.tree.walkTree(tree, (n) => {
      if (n.kind === "group" && n.id !== tree.id) {
        any = true;
        if (!n.collapsed) all = false;
      }
    });
    return any && all;
  })();

  const actions: QueryActions = {
    dispatch,
    run,
    setModal,
    setPage,
    onSort,
    clearBuilder,
    savePreset,
    deletePreset,
    importTree,
    loadTree,
    deleteHistory,
    clearHistory,
  };

  const state: QueryState = {
    tree,
    errors,
    errorCount,
    completeCount,
    allCollapsed,
    runState,
    results: sortedResults,
    sort,
    page,
    modal,
    presets,
    history,
  };

  return (
    <QueryActionsProvider value={actions}>
      <QueryStateProvider value={state}>
        {mounted ? children : <Loading />}
      </QueryStateProvider>
    </QueryActionsProvider>
  );
};

export default QueryBuilderProvider;
