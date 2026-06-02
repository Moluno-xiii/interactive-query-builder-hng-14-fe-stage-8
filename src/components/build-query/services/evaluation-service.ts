import type { Group, Row, Rule, Schema } from "../types";
import { ValidationService } from "./validation-service";

export class EvaluationService {
  constructor(private readonly validation: ValidationService) {}

  private splitList(v: string | string[]): string[] {
    if (Array.isArray(v)) return v.map(String);
    return String(v ?? "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);
  }

  private evalRule(row: Row, rule: Rule, schema: Schema): boolean {
    const f = schema.fieldMap[rule.field];
    if (!f) return false;
    const cell = row[rule.field];
    const op = rule.op;
    if (op === "isnull") return cell == null || cell === "";
    if (op === "notnull") return !(cell == null || cell === "");
    if (op === "istrue") return cell === true;
    if (op === "isfalse") return cell === false;
    if (cell == null) return false;

    if (f.type === "date") {
      const cd = new Date(cell as number);
      const vd = new Date(rule.value);
      if (op === "before") return cd < vd;
      if (op === "after") return cd > vd;
      if (op === "on") return cd.toISOString().slice(0, 10) === rule.value;
      if (op === "between") {
        const v2 = new Date(rule.value2);
        return cd >= vd && cd <= v2;
      }
    }
    if (f.type === "number") {
      const v = parseFloat(rule.value);
      const v2 = parseFloat(rule.value2);
      const c = +cell;
      if (op === "eq") return c === v;
      if (op === "neq") return c !== v;
      if (op === "gt") return c > v;
      if (op === "gte") return c >= v;
      if (op === "lt") return c < v;
      if (op === "lte") return c <= v;
      if (op === "between") return c >= v && c <= v2;
      if (op === "in") return this.splitList(rule.value).map(Number).includes(c);
    }
    const s = String(cell).toLowerCase();
    const t = String(rule.value ?? "").toLowerCase();
    if (op === "eq") return s === t;
    if (op === "neq") return s !== t;
    if (op === "contains") return s.includes(t);
    if (op === "starts") return s.startsWith(t);
    if (op === "ends") return s.endsWith(t);
    if (op === "regex") {
      try {
        return new RegExp(rule.value, "i").test(String(cell));
      } catch {
        return false;
      }
    }
    if (op === "in")
      return this.splitList(rule.value)
        .map((x) => x.toLowerCase())
        .includes(s);
    if (op === "notin")
      return !this.splitList(rule.value)
        .map((x) => x.toLowerCase())
        .includes(s);
    return false;
  }

  private evalGroup(row: Row, group: Group, schema: Schema): boolean {
    const kids = group.children.filter((c) =>
      c.kind === "group" ? c.children.length : this.validation.isComplete(c),
    );
    if (!kids.length) return true;
    const results = kids.map((c) =>
      c.kind === "group"
        ? this.evalGroup(row, c, schema)
        : this.evalRule(row, c, schema),
    );
    return group.combinator === "AND"
      ? results.every(Boolean)
      : results.some(Boolean);
  }

  runQuery(root: Group, schema: Schema): Row[] {
    return schema.rows.filter((r) => this.evalGroup(r, root, schema));
  }
}
