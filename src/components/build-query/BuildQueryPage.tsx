"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { FIELD_MAP } from "@/components/build-query/data";
import type {
  Action,
  Group,
  HistoryEntry,
  Preset,
  Row,
} from "@/components/build-query/types";
import queryEngine from "@/components/build-query/query-engine";
import Loading from "@/components/build-query/Loading";
import Toolbar from "@/components/build-query/Toolbar";
import BuilderPane from "@/components/build-query/BuilderPane";
import OutputPane from "@/components/build-query/OutputPane";
import QueryModals from "@/components/build-query/QueryModals";
import localStorageStore from "@/lib/local-storage";
import { ModalKind } from "@/components/build-query";

type RunState = "idle" | "loading" | "done";
type Sort = { col: string | null; dir: "asc" | "desc" };

const BuildQueryPage = () => {
  const [mounted, setMounted] = useState(false);
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

  const dispatch = useCallback(
    (a: Action) => setTree((t) => queryEngine.tree.applyAction(t, a)),
    [],
  );
  const errors = queryEngine.validation.validate(tree);
  const errorCount = Object.keys(errors).length;
  const completeCount = queryEngine.tree.countComplete(tree);

  useEffect(() => setMounted(true), []);

  useEffect(() => {
    if (mounted) localStorageStore.set("qf_tree", tree);
  }, [tree, mounted]);
  useEffect(() => {
    if (mounted) localStorageStore.set("qf_presets", presets);
  }, [presets, mounted]);
  useEffect(() => {
    if (mounted) localStorageStore.set("qf_history", history);
  }, [history, mounted]);

  const sortedResults = useMemo(() => {
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
  }, [results, sort]);

  const run = useCallback(() => {
    setRunState("loading");
    setPage(0);
    setTimeout(() => {
      const rows = queryEngine.evaluation.runQuery(tree);
      setResults(rows);
      setRunState("done");
      const sql = queryEngine.sql
        .sqlString(tree)
        .replace(/\s+/g, " ")
        .replace("SELECT * FROM orders WHERE ", "")
        .replace(";", "");
      setHistory((h) =>
        [
          {
            ts: Date.now(),
            sql: sql.length > 92 ? sql.slice(0, 92) + "…" : sql,
            count: rows.length,
            tree: queryEngine.tree.clone(tree),
          },
          ...h,
        ].slice(0, 12),
      );
    }, 620);
  }, [tree]);

  const ranOnce = useRef(false);
  useEffect(() => {
    if (mounted && !ranOnce.current) {
      ranOnce.current = true;
      run();
    }
  }, [mounted, run]);

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "Enter") {
        e.preventDefault();
        run();
      }
      if ((e.metaKey || e.ctrlKey) && e.key === "s") {
        e.preventDefault();
        setModal("presets");
      }
    };
    window.addEventListener("keydown", h);
    return () => window.removeEventListener("keydown", h);
  }, [run]);

  const onSort = (col: string) =>
    setSort((s) =>
      s.col === col
        ? { col, dir: s.dir === "asc" ? "desc" : "asc" }
        : { col, dir: "asc" },
    );

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

  if (!mounted) {
    return <Loading />;
  }

  return (
    <div className="qf-scroll flex h-dvh flex-col overflow-hidden bg-background text-foreground transition-colors duration-300">
      <Toolbar onRun={run} running={runState === "loading"} onOpen={setModal} />

      <div className="flex min-h-0 flex-1 gap-px bg-border-soft max-[940px]:flex-col max-[940px]:overflow-auto">
        <BuilderPane
          tree={tree}
          errors={errors}
          errorCount={errorCount}
          completeCount={completeCount}
          allCollapsed={allCollapsed}
          dispatch={dispatch}
          onClear={() => setTree(queryEngine.tree.makeGroup("AND", []))}
        />
        <OutputPane
          tree={tree}
          errorCount={errorCount}
          runState={runState}
          rows={sortedResults}
          sort={sort}
          onSort={onSort}
          page={page}
          onPage={setPage}
        />
      </div>

      <QueryModals
        modal={modal}
        tree={tree}
        presets={presets}
        history={history}
        onClose={() => setModal(null)}
        onImport={(t) => {
          queryEngine.tree.reId(t);
          setTree(t);
        }}
        onSavePreset={(name) =>
          setPresets((p) => [queryEngine.presets.buildPreset(name, tree), ...p])
        }
        onLoadTree={(t) => {
          const c = queryEngine.tree.clone(t);
          queryEngine.tree.reId(c);
          setTree(c);
        }}
        onDeletePreset={(ts) => setPresets((p) => p.filter((x) => x.ts !== ts))}
        onDeleteHistory={(ts) =>
          setHistory((h) => h.filter((x) => x.ts !== ts))
        }
        onClearHistory={() => setHistory([])}
      />
    </div>
  );
};

export default BuildQueryPage;
