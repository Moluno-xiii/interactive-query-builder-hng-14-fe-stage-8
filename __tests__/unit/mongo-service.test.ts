import { describe, it, expect } from "vitest";
import { MongoService } from "@/components/build-query/services/mongo-service";
import { SCHEMAS } from "@/components/build-query/data";
import type { Group, Rule } from "@/components/build-query/types";

const orders = SCHEMAS[0];
const mongo = new MongoService();

const rule = (over: Partial<Rule>): Rule => ({
  id: "r",
  kind: "rule",
  field: "status",
  op: "eq",
  value: "paid",
  value2: "",
  ...over,
});

const group = (
  children: (Rule | Group)[],
  combinator: "AND" | "OR" = "AND",
): Group => ({
  id: "g",
  kind: "group",
  combinator,
  collapsed: false,
  children,
});

describe("MongoService.mongoQuery (rules)", () => {
  it("maps equality to a direct value", () => {
    expect(mongo.mongoQuery(group([rule({ op: "eq", value: "paid" })]), orders)).toEqual({
      status: "paid",
    });
  });

  it("maps not-equals to $ne", () => {
    expect(mongo.mongoQuery(group([rule({ op: "neq", value: "paid" })]), orders)).toEqual({
      status: { $ne: "paid" },
    });
  });

  it("coerces numeric values to numbers", () => {
    expect(
      mongo.mongoQuery(group([rule({ field: "amount", op: "gt", value: "100" })]), orders),
    ).toEqual({ amount_usd: { $gt: 100 } });
  });

  it("maps between to $gte and $lte", () => {
    expect(
      mongo.mongoQuery(
        group([rule({ field: "amount", op: "between", value: "10", value2: "100" })]),
        orders,
      ),
    ).toEqual({ amount_usd: { $gte: 10, $lte: 100 } });
  });

  it("maps contains to a case-insensitive $regex", () => {
    expect(
      mongo.mongoQuery(group([rule({ field: "customer", op: "contains", value: "gmail" })]), orders),
    ).toEqual({ customer_email: { $regex: "gmail", $options: "i" } });
  });

  it("anchors starts-with and ends-with regexes", () => {
    expect(
      mongo.mongoQuery(group([rule({ field: "customer", op: "starts", value: "a" })]), orders),
    ).toEqual({ customer_email: { $regex: "^a" } });
    expect(
      mongo.mongoQuery(group([rule({ field: "customer", op: "ends", value: ".com" })]), orders),
    ).toEqual({ customer_email: { $regex: ".com$" } });
  });

  it("maps in and not in to $in and $nin arrays", () => {
    expect(
      mongo.mongoQuery(group([rule({ field: "region", op: "in", value: "Europe, APAC" })]), orders),
    ).toEqual({ region: { $in: ["Europe", "APAC"] } });
    expect(
      mongo.mongoQuery(group([rule({ field: "region", op: "notin", value: "Europe" })]), orders),
    ).toEqual({ region: { $nin: ["Europe"] } });
  });

  it("maps null and boolean checks", () => {
    expect(mongo.mongoQuery(group([rule({ op: "isnull" })]), orders)).toEqual({ status: null });
    expect(mongo.mongoQuery(group([rule({ op: "notnull" })]), orders)).toEqual({
      status: { $ne: null },
    });
    expect(mongo.mongoQuery(group([rule({ field: "is_gift", op: "istrue" })]), orders)).toEqual({
      is_gift: true,
    });
  });

  it("falls back to a null match for an unknown field", () => {
    expect(mongo.mongoQuery(group([rule({ field: "ghost" })]), orders)).toEqual({ ghost: null });
  });
});

describe("MongoService.mongoQuery (groups)", () => {
  it("returns a bare expression for a single child", () => {
    expect(mongo.mongoQuery(group([rule({ op: "eq", value: "paid" })]), orders)).toEqual({
      status: "paid",
    });
  });

  it("wraps multiple children in $or", () => {
    const g = group(
      [rule({ op: "eq", value: "paid" }), rule({ field: "amount", op: "gt", value: "100" })],
      "OR",
    );
    expect(mongo.mongoQuery(g, orders)).toEqual({
      $or: [{ status: "paid" }, { amount_usd: { $gt: 100 } }],
    });
  });

  it("nests groups recursively", () => {
    const nested = group(
      [
        rule({ op: "eq", value: "paid" }),
        group(
          [
            rule({ field: "amount", op: "gt", value: "100" }),
            rule({ field: "amount", op: "lt", value: "10" }),
          ],
          "OR",
        ),
      ],
      "AND",
    );
    expect(mongo.mongoQuery(nested, orders)).toEqual({
      $and: [
        { status: "paid" },
        { $or: [{ amount_usd: { $gt: 100 } }, { amount_usd: { $lt: 10 } }] },
      ],
    });
  });

  it("returns an empty object for an empty tree", () => {
    expect(mongo.mongoQuery(group([]), orders)).toEqual({});
  });
});

describe("MongoService.mongoString", () => {
  it("pretty-prints the query as JSON", () => {
    expect(mongo.mongoString(group([rule({ op: "eq", value: "paid" })]), orders)).toBe(
      JSON.stringify({ status: "paid" }, null, 2),
    );
  });
});
