import { describe, it, expect } from "vitest";
import {
  parseTree,
  parseImport,
  parsePresets,
  parseHistory,
} from "@/components/build-query/query-schema";

const rule = (over: Record<string, unknown> = {}) => ({
  id: "r1",
  kind: "rule",
  field: "status",
  op: "eq",
  value: "paid",
  value2: "",
  ...over,
});

const group = (children: unknown[], over: Record<string, unknown> = {}) => ({
  id: "g1",
  kind: "group",
  combinator: "AND",
  collapsed: false,
  children,
  ...over,
});

describe("parseTree", () => {
  it("accepts a well-formed nested tree", () => {
    const tree = group([
      rule(),
      group([rule({ id: "r2" })], { id: "g2", combinator: "OR" }),
    ]);
    const parsed = parseTree(tree);
    expect(parsed).not.toBeNull();
    expect(parsed?.children).toHaveLength(2);
    expect(parsed?.children[1]).toMatchObject({ kind: "group", combinator: "OR" });
  });

  it("defaults missing rule values to empty strings", () => {
    const parsed = parseTree(
      group([{ id: "r", kind: "rule", field: "amount", op: "gt" }]),
    );
    expect(parsed?.children[0]).toMatchObject({ value: "", value2: "" });
  });

  it("rejects values that are not objects", () => {
    expect(parseTree(null)).toBeNull();
    expect(parseTree("not a tree")).toBeNull();
    expect(parseTree(42)).toBeNull();
  });

  it("rejects a group missing required fields", () => {
    expect(parseTree({ kind: "group" })).toBeNull();
    expect(
      parseTree({ id: "g", kind: "group", combinator: "AND", collapsed: false }),
    ).toBeNull();
  });

  it("rejects an invalid combinator", () => {
    expect(parseTree(group([rule()], { combinator: "XOR" }))).toBeNull();
  });

  it("rejects a malformed nested node", () => {
    const tree = group([rule(), group([{ kind: "rule" }], { id: "g2" })]);
    expect(parseTree(tree)).toBeNull();
  });
});

describe("parseImport", () => {
  it("reads the { source, query } envelope", () => {
    const result = parseImport({ source: "users", query: group([rule()]) });
    expect(result).not.toBeNull();
    expect(result?.source).toBe("users");
    expect(result?.tree.children).toHaveLength(1);
  });

  it("reads a bare query tree with no source", () => {
    const result = parseImport(group([rule()]));
    expect(result?.source).toBeUndefined();
    expect(result?.tree.kind).toBe("group");
  });

  it("returns null for an invalid payload", () => {
    expect(parseImport({ query: { kind: "group" } })).toBeNull();
    expect(parseImport(42)).toBeNull();
  });
});

describe("parsePresets", () => {
  it("keeps only well-formed entries", () => {
    const presets = parsePresets([
      { name: "p1", ts: 1, schemaId: "orders", tree: group([rule()]) },
      { name: "broken", ts: 2, schemaId: "orders", tree: { kind: "group" } },
      "garbage",
    ]);
    expect(presets).toHaveLength(1);
    expect(presets[0].name).toBe("p1");
  });

  it("returns an empty array for non-array input", () => {
    expect(parsePresets(null)).toEqual([]);
    expect(parsePresets("nope")).toEqual([]);
  });
});

describe("parseHistory", () => {
  it("keeps only well-formed entries", () => {
    const history = parseHistory([
      { ts: 1, schemaId: "orders", sql: "SELECT 1", count: 5, tree: group([rule()]) },
      { ts: "bad", schemaId: "orders", sql: "x", count: 0, tree: group([rule()]) },
    ]);
    expect(history).toHaveLength(1);
    expect(history[0].count).toBe(5);
  });

  it("returns an empty array for non-array input", () => {
    expect(parseHistory(undefined)).toEqual([]);
  });
});
