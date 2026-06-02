import { describe, it, expect } from "vitest";
import { ValidationService } from "@/components/build-query/services/validation-service";
import { SCHEMAS } from "@/components/build-query/data";
import type { Group, Rule } from "@/components/build-query/types";

const orders = SCHEMAS[0];
const v = new ValidationService();

const rule = (over: Partial<Rule> = {}): Rule => ({
  id: "r1",
  kind: "rule",
  field: "status",
  op: "eq",
  value: "paid",
  value2: "",
  ...over,
});

const root = (children: (Rule | Group)[]): Group => ({
  id: "root",
  kind: "group",
  combinator: "AND",
  collapsed: false,
  children,
});

describe("ValidationService.isComplete", () => {
  it("is true for an arity-1 rule with a value", () => {
    expect(v.isComplete(rule())).toBe(true);
  });

  it("is false for an arity-1 rule with an empty value", () => {
    expect(v.isComplete(rule({ value: "" }))).toBe(false);
  });

  it("is true for an arity-0 rule regardless of value", () => {
    expect(v.isComplete(rule({ op: "isnull", value: "" }))).toBe(true);
  });

  it("requires both bounds for an arity-2 rule", () => {
    expect(
      v.isComplete(rule({ field: "amount", op: "between", value: "1", value2: "" })),
    ).toBe(false);
  });

  it("is true when both range bounds are present", () => {
    expect(
      v.isComplete(rule({ field: "amount", op: "between", value: "1", value2: "9" })),
    ).toBe(true);
  });

  it("is false for an unknown operator", () => {
    expect(v.isComplete(rule({ op: "nope" }))).toBe(false);
  });
});

describe("ValidationService.validate", () => {
  it("flags an empty non-root group", () => {
    const errs = v.validate(
      root([{ id: "child", kind: "group", combinator: "AND", collapsed: false, children: [] }]),
      orders,
    );
    expect(errs["child"]?.level).toBe("error");
  });

  it("does not flag the root group when it is empty", () => {
    const emptyRoot: Group = {
      id: "root",
      kind: "group",
      combinator: "AND",
      collapsed: false,
      children: [],
    };
    expect(Object.keys(v.validate(emptyRoot, orders))).toHaveLength(0);
  });

  it("rejects an operator incompatible with the field type", () => {
    const errs = v.validate(root([rule({ field: "amount", op: "contains", value: "x" })]), orders);
    expect(errs["r1"]?.msg).toContain("number");
  });

  it("rejects a numeric range whose min exceeds its max", () => {
    const errs = v.validate(
      root([rule({ field: "amount", op: "between", value: "100", value2: "10" })]),
      orders,
    );
    expect(errs["r1"]?.msg).toContain("greater");
  });

  it("rejects a date range whose start is after its end", () => {
    const errs = v.validate(
      root([rule({ field: "created_at", op: "between", value: "2024-12-01", value2: "2024-01-01" })]),
      orders,
    );
    expect(errs["r1"]?.msg).toContain("after");
  });

  it("rejects an invalid regular expression", () => {
    const errs = v.validate(root([rule({ field: "customer", op: "regex", value: "(" })]), orders);
    expect(errs["r1"]?.msg).toContain("regular");
  });

  it("requires a value for an arity-1 rule", () => {
    const errs = v.validate(root([rule({ value: "" })]), orders);
    expect(errs["r1"]?.msg).toContain("required");
  });

  it("rejects an unknown field", () => {
    const errs = v.validate(root([rule({ field: "ghost" })]), orders);
    expect(errs["r1"]?.level).toBe("error");
  });

  it("returns no errors for a valid tree", () => {
    expect(Object.keys(v.validate(root([rule()]), orders))).toHaveLength(0);
  });
});
