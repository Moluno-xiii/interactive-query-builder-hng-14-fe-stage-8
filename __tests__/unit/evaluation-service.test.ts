import { describe, it, expect } from "vitest";
import { EvaluationService } from "@/components/build-query/services/evaluation-service";
import { ValidationService } from "@/components/build-query/services/validation-service";
import { SCHEMAS } from "@/components/build-query/data";
import type { Group, Rule } from "@/components/build-query/types";

const orders = SCHEMAS[0];
const evalSvc = new EvaluationService(new ValidationService());
const total = orders.rows.length;

const rule = (over: Partial<Rule>): Rule => ({
  id: "r",
  kind: "rule",
  field: "status",
  op: "eq",
  value: "paid",
  value2: "",
  ...over,
});

const group = (children: (Rule | Group)[], combinator: "AND" | "OR" = "AND"): Group => ({
  id: "g",
  kind: "group",
  combinator,
  collapsed: false,
  children,
});

describe("EvaluationService.runQuery", () => {
  it("returns every row for an empty group", () => {
    expect(evalSvc.runQuery(group([]), orders)).toHaveLength(total);
  });

  it("ignores incomplete rules", () => {
    expect(evalSvc.runQuery(group([rule({ op: "eq", value: "" })]), orders)).toHaveLength(total);
  });

  it("filters by enum equality", () => {
    const res = evalSvc.runQuery(group([rule({ op: "eq", value: "paid" })]), orders);
    expect(res.every((r) => r.status === "paid")).toBe(true);
    expect(res.length < total).toBe(true);
  });

  it("filters by numeric greater-than", () => {
    const res = evalSvc.runQuery(group([rule({ field: "amount", op: "gt", value: "100" })]), orders);
    expect(res.every((r) => Number(r.amount) > 100)).toBe(true);
  });

  it("filters by a numeric range", () => {
    const res = evalSvc.runQuery(group([rule({ field: "amount", op: "between", value: "10", value2: "100" })]), orders);
    expect(res.every((r) => Number(r.amount) >= 10 && Number(r.amount) <= 100)).toBe(true);
  });

  it("applies AND across conditions", () => {
    const res = evalSvc.runQuery(
      group([rule({ op: "eq", value: "paid" }), rule({ field: "amount", op: "gt", value: "100" })], "AND"),
      orders,
    );
    expect(res.every((r) => r.status === "paid" && Number(r.amount) > 100)).toBe(true);
  });

  it("applies OR across conditions", () => {
    const res = evalSvc.runQuery(
      group([rule({ op: "eq", value: "paid" }), rule({ op: "eq", value: "shipped" })], "OR"),
      orders,
    );
    expect(res.every((r) => r.status === "paid" || r.status === "shipped")).toBe(true);
  });

  it("matches all rows whose string contains a substring", () => {
    expect(evalSvc.runQuery(group([rule({ field: "customer", op: "contains", value: "@" })]), orders)).toHaveLength(total);
  });

  it("filters by IS NULL", () => {
    const res = evalSvc.runQuery(group([rule({ field: "shipped_at", op: "isnull" })]), orders);
    expect(res.every((r) => r.shipped_at == null)).toBe(true);
  });

  it("filters by IS NOT NULL", () => {
    const res = evalSvc.runQuery(group([rule({ field: "shipped_at", op: "notnull" })]), orders);
    expect(res.every((r) => r.shipped_at != null)).toBe(true);
  });

  it("filters by IN with a list", () => {
    const res = evalSvc.runQuery(group([rule({ field: "status", op: "in", value: "paid,shipped" })]), orders);
    expect(res.every((r) => r.status === "paid" || r.status === "shipped")).toBe(true);
  });

  it("filters by a boolean true check", () => {
    const res = evalSvc.runQuery(group([rule({ field: "is_gift", op: "istrue" })]), orders);
    expect(res.every((r) => r.is_gift === true)).toBe(true);
  });
});
