import type { FieldType, Group, Rule, Schema } from "../types";

type MongoExpr = Record<string, unknown>;

export class MongoService {
  private value(v: string, type: FieldType): unknown {
    if (type === "number") {
      const n = Number(v);
      return v !== "" && Number.isFinite(n) ? n : v;
    }
    return v;
  }

  private list(v: string, type: FieldType): unknown[] {
    if (!v) return [];
    return v
      .split(",")
      .map((s) => s.trim())
      .filter((s) => s.length > 0)
      .map((s) => this.value(s, type));
  }

  private ruleToMongo(rule: Rule, schema: Schema): MongoExpr {
    const f = schema.fieldMap[rule.field];
    if (!f) return { [rule.field]: null };
    const col = f.label;
    const v = this.value(rule.value, f.type);
    switch (rule.op) {
      case "eq":
      case "on":
        return { [col]: v };
      case "neq":
        return { [col]: { $ne: v } };
      case "gt":
      case "after":
        return { [col]: { $gt: v } };
      case "gte":
        return { [col]: { $gte: v } };
      case "lt":
      case "before":
        return { [col]: { $lt: v } };
      case "lte":
        return { [col]: { $lte: v } };
      case "between":
        return { [col]: { $gte: v, $lte: this.value(rule.value2, f.type) } };
      case "contains":
        return { [col]: { $regex: rule.value, $options: "i" } };
      case "starts":
        return { [col]: { $regex: `^${rule.value}` } };
      case "ends":
        return { [col]: { $regex: `${rule.value}$` } };
      case "regex":
        return { [col]: { $regex: rule.value } };
      case "in":
        return { [col]: { $in: this.list(rule.value, f.type) } };
      case "notin":
        return { [col]: { $nin: this.list(rule.value, f.type) } };
      case "istrue":
        return { [col]: true };
      case "isfalse":
        return { [col]: false };
      case "isnull":
        return { [col]: null };
      case "notnull":
        return { [col]: { $ne: null } };
      default:
        return { [col]: v };
    }
  }

  private groupToMongo(group: Group, schema: Schema): MongoExpr {
    const parts = group.children.map((c) =>
      c.kind === "group"
        ? this.groupToMongo(c, schema)
        : this.ruleToMongo(c, schema),
    );
    if (parts.length === 0) return {};
    if (parts.length === 1) return parts[0];
    return { [group.combinator === "AND" ? "$and" : "$or"]: parts };
  }

  mongoQuery(tree: Group, schema: Schema): MongoExpr {
    return this.groupToMongo(tree, schema);
  }

  mongoString(tree: Group, schema: Schema): string {
    return JSON.stringify(this.groupToMongo(tree, schema), null, 2);
  }
}
