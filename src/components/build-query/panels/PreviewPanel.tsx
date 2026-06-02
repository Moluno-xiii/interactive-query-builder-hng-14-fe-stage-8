"use client";

import { useState } from "react";
import { PiCheck, PiCode, PiCopy, PiWarningCircle } from "react-icons/pi";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Group } from "@/components/build-query/types";
import queryEngine from "@/components/build-query/query-engine";
import useQueryState from "@/hooks/useQueryState";
import { panelHead, panelTitle } from "..";
import highlightSql from "./highlightSql";
import highlightJson from "./highlightJson";

type PreviewFormat = "sql" | "mongo";

interface PreviewPanelProps {
  tree: Group;
  errorCount: number;
}

const PreviewPanel = ({ tree, errorCount }: PreviewPanelProps) => {
  const { schema } = useQueryState();
  const [format, setFormat] = useState<PreviewFormat>("sql");
  const [copied, setCopied] = useState(false);

  const { where } = queryEngine.sql.fullSQL(tree, schema);
  const mongo = queryEngine.mongo.mongoString(tree, schema);
  const mongoLines = mongo.split("\n");
  const lineCount = format === "sql" ? where.length + 2 : mongoLines.length;

  const copy = () => {
    const text =
      format === "sql" ? queryEngine.sql.sqlString(tree, schema) : mongo;
    if (navigator.clipboard) navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 1400);
  };

  return (
    <section
      data-tour="preview"
      className="flex max-h-[42%] flex-none flex-col bg-background"
    >
      <header className={panelHead}>
        <div className={panelTitle}>
          <PiCode size={15} className="text-accent" />
          <span>Query preview</span>
          <div
            className="inline-flex rounded-sm border border-border-soft bg-surface-2 p-0.5"
            role="group"
            aria-label="Preview format"
          >
            {(["sql", "mongo"] as const).map((f) => (
              <button
                key={f}
                type="button"
                onClick={() => setFormat(f)}
                aria-pressed={format === f}
                className={cn(
                  "rounded-[4px] px-2 py-0.5 font-jetbrains-mono text-[10.5px] font-semibold uppercase tracking-[0.4px] transition",
                  format === f
                    ? "bg-surface text-accent shadow-sm"
                    : "text-faint hover:text-muted-foreground",
                )}
              >
                {f}
              </button>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {errorCount > 0 && (
            <Badge className="h-4.75 gap-1 rounded-sm border-transparent bg-danger-dim px-1.75 text-[11px] font-semibold leading-none tracking-[0.2px] text-danger animate-pop-in">
              <PiWarningCircle size={11} />
              {errorCount}
            </Badge>
          )}
          <button
            className={cn(
              "flex h-6.75 items-center gap-1.5 rounded-sm border border-border-soft bg-surface-2 px-2.5 text-[12px] font-semibold text-muted-foreground transition hover:border-border-strong hover:text-foreground",
              copied && "border-accent text-accent",
            )}
            onClick={copy}
          >
            {copied ? <PiCheck size={13} /> : <PiCopy size={13} />}
            {copied ? "Copied" : "Copy"}
          </button>
        </div>
      </header>
      <div className="qf-scroll flex flex-1 overflow-auto bg-inset">
        <div
          className="flex-none select-none border-r border-border-soft py-3.5 text-right font-jetbrains-mono text-[12px] leading-[1.75] text-faint opacity-50"
          aria-hidden
        >
          {Array.from({ length: lineCount }).map((_, i) => (
            <div key={i} className="px-3">
              {i + 1}
            </div>
          ))}
        </div>
        <pre className="flex-1 overflow-x-auto px-4 py-3.5 font-jetbrains-mono text-[12.5px] leading-[1.75]">
          {format === "sql" ? (
            <>
              <div className="whitespace-pre">
                <span className="font-semibold text-and">SELECT</span>{" "}
                <span className="text-muted-foreground">*</span>{" "}
                <span className="font-semibold text-and">FROM</span>{" "}
                <span className="font-semibold text-accent">{schema.name}</span>
              </div>
              <div className="whitespace-pre">
                <span className="font-semibold text-and">WHERE</span>
              </div>
              {where.map((ln, idx) => (
                <div
                  className="whitespace-pre"
                  key={idx}
                  style={{ paddingLeft: 14 + ln.pad.length * 9 }}
                >
                  {ln.kind === "comment" ? (
                    <span className="italic text-faint">{ln.text}</span>
                  ) : (
                    <>
                      {highlightSql(ln.text)}
                      {ln.conj && (
                        <span
                          className={cn(
                            "font-bold",
                            ln.conj === "AND" ? "text-and" : "text-or",
                          )}
                        >
                          {" "}
                          {ln.conj}
                        </span>
                      )}
                    </>
                  )}
                </div>
              ))}
              <div className="whitespace-pre">
                <span className="text-muted-foreground">;</span>
                <span className="ml-0.75 inline-block h-3.75 w-1.75 bg-accent align-text-bottom opacity-80 animate-blink" />
              </div>
            </>
          ) : (
            <>
              {mongoLines.map((ln, idx) => (
                <div className="whitespace-pre" key={idx}>
                  {highlightJson(ln)}
                </div>
              ))}
              <div className="whitespace-pre">
                <span className="inline-block h-3.75 w-1.75 bg-accent align-text-bottom opacity-80 animate-blink" />
              </div>
            </>
          )}
        </pre>
      </div>
    </section>
  );
};

export default PreviewPanel;
