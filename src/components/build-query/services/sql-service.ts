import { OPERATORS } from "../data";
import type { Group, Rule, Schema, SqlLine } from "../types";

export class SqlService {
  private quote(v: string): string {
    return `'${String(v ?? "").replace(/'/g, "''")}'`;
  }

  private sqlValue(field: string, v: string, schema: Schema): string {
    const f = schema.fieldMap[field];
    if (f?.type === "number") return v === "" || v == null ? "∅" : String(v);
    if (f?.type === "date") return this.quote(v || "????-??-??");
    return this.quote(v);
  }

  ruleToSQL(rule: Rule, schema: Schema): string {
    const f = schema.fieldMap[rule.field];
    if (!f) return rule.field;
    const o = OPERATORS[rule.op];
    const col = f.label;
    if (o.arity === 0) {
      if (rule.op === "isnull") return `${col} IS NULL`;
      if (rule.op === "notnull") return `${col} IS NOT NULL`;
      if (rule.op === "istrue") return `${col} = TRUE`;
      if (rule.op === "isfalse") return `${col} = FALSE`;
    }
    if (o.multi) {
      const arr = Array.isArray(rule.value)
        ? rule.value
        : rule.value
          ? String(rule.value)
              .split(",")
              .map((s) => s.trim())
          : [];
      const list = arr.length
        ? arr
            .map((v: string) => (f.type === "number" ? v : this.quote(v)))
            .join(", ")
        : "…";
      return `${col} ${rule.op === "notin" ? "NOT IN" : "IN"} (${list})`;
    }
    if (o.arity === 2) {
      return `${col} BETWEEN ${this.sqlValue(
        rule.field,
        rule.value,
        schema,
      )} AND ${this.sqlValue(rule.field, rule.value2, schema)}`;
    }
    const map: Record<string, string> = {
      eq: "=",
      neq: "!=",
      gt: ">",
      gte: ">=",
      lt: "<",
      lte: "<=",
      before: "<",
      after: ">",
      on: "=",
    };
    if (rule.op === "contains")
      return `${col} LIKE ${this.sqlValue(rule.field, "%" + rule.value + "%", schema)}`;
    if (rule.op === "starts")
      return `${col} LIKE ${this.sqlValue(rule.field, rule.value + "%", schema)}`;
    if (rule.op === "ends")
      return `${col} LIKE ${this.sqlValue(rule.field, "%" + rule.value, schema)}`;
    if (rule.op === "regex")
      return `${col} ~ ${this.sqlValue(rule.field, rule.value, schema)}`;
    return `${col} ${map[rule.op] || o.sym} ${this.sqlValue(rule.field, rule.value, schema)}`;
  }

  private groupToSQL(group: Group, schema: Schema, depth = 0): SqlLine[] {
    const lines: SqlLine[] = [];
    const pad = "  ".repeat(depth);
    const kids = group.children;
    if (!kids.length) {
      lines.push({ pad, text: "/* empty group */", kind: "comment" });
      return lines;
    }
    kids.forEach((child, i) => {
      const isLast = i === kids.length - 1;
      const conj = isLast ? "" : group.combinator;
      if (child.kind === "group") {
        lines.push({ pad, text: "(", kind: "paren" });
        this.groupToSQL(child, schema, depth + 1).forEach((l) => lines.push(l));
        lines.push({ pad, text: ")", kind: "paren", conj });
      } else {
        lines.push({
          pad,
          text: this.ruleToSQL(child, schema),
          kind: "rule",
          conj,
        });
      }
    });
    return lines;
  }

  fullSQL(root: Group, schema: Schema): { select: string; where: SqlLine[] } {
    return {
      select: `SELECT * FROM ${schema.name}`,
      where: this.groupToSQL(root, schema, 0),
    };
  }

  sqlString(root: Group, schema: Schema): string {
    const walk = (group: Group): string => {
      const parts = group.children.map((c) =>
        c.kind === "group" ? "(" + walk(c) + ")" : this.ruleToSQL(c, schema),
      );
      return parts.join(" " + group.combinator + " ");
    };
    return `SELECT * FROM ${schema.name}\nWHERE ${walk(root) || "TRUE"};`;
  }
}
