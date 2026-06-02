import { FIELD_MAP, OPERATORS, SCHEMA } from "../data";
import type { Group, Rule, SqlLine } from "../types";

export class SqlService {
  private sqlValue(field: string, v: string): string {
    const f = FIELD_MAP[field];
    if (f.type === "number") return v === "" || v == null ? "∅" : String(v);
    if (f.type === "date") return `'${v || "????-??-??"}'`;
    return `'${String(v ?? "")}'`;
  }

  ruleToSQL(rule: Rule): string {
    const f = FIELD_MAP[rule.field];
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
            .map((v: string) => (f.type === "number" ? v : `'${v}'`))
            .join(", ")
        : "…";
      return `${col} ${rule.op === "notin" ? "NOT IN" : "IN"} (${list})`;
    }
    if (o.arity === 2) {
      return `${col} BETWEEN ${this.sqlValue(
        rule.field,
        rule.value,
      )} AND ${this.sqlValue(rule.field, rule.value2)}`;
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
      return `${col} LIKE ${this.sqlValue(rule.field, "%" + rule.value + "%")}`;
    if (rule.op === "starts")
      return `${col} LIKE ${this.sqlValue(rule.field, rule.value + "%")}`;
    if (rule.op === "ends")
      return `${col} LIKE ${this.sqlValue(rule.field, "%" + rule.value)}`;
    if (rule.op === "regex")
      return `${col} ~ ${this.sqlValue(rule.field, rule.value)}`;
    return `${col} ${map[rule.op] || o.sym} ${this.sqlValue(rule.field, rule.value)}`;
  }

  private groupToSQL(group: Group, depth = 0): SqlLine[] {
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
        this.groupToSQL(child, depth + 1).forEach((l) => lines.push(l));
        lines.push({ pad, text: ")", kind: "paren", conj });
      } else {
        lines.push({ pad, text: this.ruleToSQL(child), kind: "rule", conj });
      }
    });
    return lines;
  }

  fullSQL(root: Group): { select: string; where: SqlLine[] } {
    return {
      select: `SELECT * FROM ${SCHEMA.name}`,
      where: this.groupToSQL(root, 0),
    };
  }

  sqlString(root: Group): string {
    const walk = (group: Group): string => {
      const parts = group.children.map((c) =>
        c.kind === "group" ? "(" + walk(c) + ")" : this.ruleToSQL(c),
      );
      return parts.join(" " + group.combinator + " ");
    };
    return `SELECT * FROM ${SCHEMA.name}\nWHERE ${walk(root) || "TRUE"};`;
  }
}
