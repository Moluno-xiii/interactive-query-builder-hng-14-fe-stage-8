import { z } from "zod";
import type { Group, HistoryEntry, Preset } from "@/components/build-query/types";

const ruleSchema = z.object({
  id: z.string(),
  kind: z.literal("rule"),
  field: z.string(),
  op: z.string(),
  value: z.string().optional().default(""),
  value2: z.string().optional().default(""),
});

const groupSchema: z.ZodType<Group> = z.lazy(() =>
  z.object({
    id: z.string(),
    kind: z.literal("group"),
    combinator: z.enum(["AND", "OR"]),
    collapsed: z.boolean(),
    children: z.array(z.union([ruleSchema, groupSchema])),
  }),
);

const importEnvelopeSchema = z.object({
  source: z.string().optional(),
  query: groupSchema,
});

const presetSchema = z.object({
  name: z.string(),
  ts: z.number(),
  schemaId: z.string(),
  tree: groupSchema,
});

const historyEntrySchema = z.object({
  ts: z.number(),
  schemaId: z.string(),
  sql: z.string(),
  count: z.number(),
  tree: groupSchema,
});

export const queryTreeSchema = groupSchema;

export interface ParsedImport {
  tree: Group;
  source?: string;
}

export const parseTree = (data: unknown): Group | null => {
  const result = groupSchema.safeParse(data);
  return result.success ? result.data : null;
};

export const parseImport = (data: unknown): ParsedImport | null => {
  const envelope = importEnvelopeSchema.safeParse(data);
  if (envelope.success)
    return { tree: envelope.data.query, source: envelope.data.source };
  const bare = groupSchema.safeParse(data);
  return bare.success ? { tree: bare.data } : null;
};

export const parsePresets = (data: unknown): Preset[] =>
  Array.isArray(data)
    ? data.flatMap((entry) => {
        const result = presetSchema.safeParse(entry);
        return result.success ? [result.data] : [];
      })
    : [];

export const parseHistory = (data: unknown): HistoryEntry[] =>
  Array.isArray(data)
    ? data.flatMap((entry) => {
        const result = historyEntrySchema.safeParse(entry);
        return result.success ? [result.data] : [];
      })
    : [];
