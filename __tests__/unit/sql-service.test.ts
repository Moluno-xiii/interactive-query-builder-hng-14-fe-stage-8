import { describe, it, expect } from "vitest";
import { SqlService } from "@/components/build-query/services/sql-service";
import { SCHEMAS } from "@/components/build-query/data";
import type { Group, Rule } from "@/components/build-query/types";

const orders = SCHEMAS[0];
const sql = new SqlService();

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

describe("SqlService.ruleToSQL", () => {
  it("renders equality on an enum field", () => {
    expect(sql.ruleToSQL(rule({ op: "eq", value: "paid" }), orders)).toBe("status = 'paid'");
  });

  it("renders inequality", () => {
    expect(sql.ruleToSQL(rule({ op: "neq", value: "paid" }), orders)).toBe("status != 'paid'");
  });

  it("renders greater-than on a numeric field without quotes", () => {
    expect(sql.ruleToSQL(rule({ field: "amount", op: "gt", value: "100" }), orders)).toBe("amount_usd > 100");
  });

  it("renders BETWEEN for a numeric range", () => {
    expect(sql.ruleToSQL(rule({ field: "amount", op: "between", value: "10", value2: "100" }), orders)).toBe("amount_usd BETWEEN 10 AND 100");
  });

  it("renders contains as a LIKE with wildcards", () => {
    expect(sql.ruleToSQL(rule({ field: "customer", op: "contains", value: "gmail" }), orders)).toBe("customer_email LIKE '%gmail%'");
  });

  it("renders starts-with as a trailing wildcard LIKE", () => {
    expect(sql.ruleToSQL(rule({ field: "customer", op: "starts", value: "a" }), orders)).toBe("customer_email LIKE 'a%'");
  });

  it("renders ends-with as a leading wildcard LIKE", () => {
    expect(sql.ruleToSQL(rule({ field: "customer", op: "ends", value: ".com" }), orders)).toBe("customer_email LIKE '%.com'");
  });

  it("renders regex with the ~ operator", () => {
    expect(sql.ruleToSQL(rule({ field: "customer", op: "regex", value: "^a" }), orders)).toBe("customer_email ~ '^a'");
  });

  it("renders IN with a quoted list for enums", () => {
    expect(sql.ruleToSQL(rule({ field: "region", op: "in", value: "Europe,APAC" }), orders)).toBe("region IN ('Europe', 'APAC')");
  });

  it("renders NOT IN", () => {
    expect(sql.ruleToSQL(rule({ field: "region", op: "notin", value: "Europe" }), orders)).toBe("region NOT IN ('Europe')");
  });

  it("renders IS NULL", () => {
    expect(sql.ruleToSQL(rule({ op: "isnull" }), orders)).toBe("status IS NULL");
  });

  it("renders IS NOT NULL", () => {
    expect(sql.ruleToSQL(rule({ op: "notnull" }), orders)).toBe("status IS NOT NULL");
  });

  it("renders a boolean true check", () => {
    expect(sql.ruleToSQL(rule({ field: "is_gift", op: "istrue" }), orders)).toBe("is_gift = TRUE");
  });

  it("renders a date comparison with a quoted value", () => {
    expect(sql.ruleToSQL(rule({ field: "created_at", op: "before", value: "2024-01-01" }), orders)).toBe("created_at < '2024-01-01'");
  });

  it("uses a placeholder for an empty numeric value", () => {
    expect(sql.ruleToSQL(rule({ field: "amount", op: "gt", value: "" }), orders)).toBe("amount_usd > ∅");
  });

  it("falls back to the raw field name when unknown", () => {
    expect(sql.ruleToSQL(rule({ field: "ghost" }), orders)).toBe("ghost");
  });
});

describe("SqlService.sqlString", () => {
  it("builds a single-condition statement", () => {
    expect(sql.sqlString(group([rule({ op: "eq", value: "paid" })]), orders)).toBe("SELECT * FROM orders\nWHERE status = 'paid';");
  });

  it("joins sibling conditions with the combinator", () => {
    const g = group([rule({ op: "eq", value: "paid" }), rule({ field: "amount", op: "gt", value: "100" })], "AND");
    expect(sql.sqlString(g, orders)).toBe("SELECT * FROM orders\nWHERE status = 'paid' AND amount_usd > 100;");
  });

  it("wraps nested groups in parentheses", () => {
    const nested = group(
      [
        rule({ op: "eq", value: "paid" }),
        group([rule({ field: "amount", op: "gt", value: "100" }), rule({ field: "amount", op: "lt", value: "10" })], "OR"),
      ],
      "AND",
    );
    expect(sql.sqlString(nested, orders)).toBe("SELECT * FROM orders\nWHERE status = 'paid' AND (amount_usd > 100 OR amount_usd < 10);");
  });

  it("emits WHERE TRUE for an empty tree", () => {
    expect(sql.sqlString(group([]), orders)).toBe("SELECT * FROM orders\nWHERE TRUE;");
  });
});

describe("SqlService.fullSQL", () => {
  it("returns the SELECT clause", () => {
    expect(sql.fullSQL(group([rule({})]), orders).select).toBe("SELECT * FROM orders");
  });

  it("returns one rule line for a single condition", () => {
    expect(sql.fullSQL(group([rule({ op: "eq", value: "paid" })]), orders).where[0].text).toBe("status = 'paid'");
  });

  it("emits a comment line for an empty group", () => {
    expect(sql.fullSQL(group([]), orders).where[0].kind).toBe("comment");
  });
});
