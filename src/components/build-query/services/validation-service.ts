import { OPERATORS, OPS_BY_TYPE } from "../data";
import type { Errors, Group, QueryNode, Rule, Schema } from "../types";

export class ValidationService {
  isComplete(rule: Rule): boolean {
    const o = OPERATORS[rule.op];
    if (!o) return false;
    if (o.arity === 0) return true;
    if (o.arity === 2)
      return String(rule.value).length > 0 && String(rule.value2).length > 0;
    return String(rule.value ?? "").length > 0;
  }

  validate(root: Group, schema: Schema): Errors {
    const errs: Errors = {};
    const walk = (node: QueryNode) => {
      if (node.kind === "group") {
        if (node.children.length === 0 && node.id !== root.id)
          errs[node.id] = {
            level: "error",
            msg: "Empty group — add a rule or remove it",
          };
        node.children.forEach(walk);
        return;
      }
      const f = schema.fieldMap[node.field];
      if (!f) {
        errs[node.id] = {
          level: "error",
          msg: `Unknown field "${node.field}" for ${schema.label}`,
        };
        return;
      }
      const o = OPERATORS[node.op];
      if (!OPS_BY_TYPE[f.type].includes(node.op)) {
        errs[node.id] = {
          level: "error",
          msg: `"${o ? o.label : node.op}" can't be used on a ${f.type} field`,
        };
        return;
      }
      if (o.arity === 0) return;
      if (o.arity === 2) {
        if (!String(node.value).length || !String(node.value2).length) {
          errs[node.id] = {
            level: "error",
            msg: "Both range bounds are required",
          };
          return;
        }
        if (
          f.type === "number" &&
          parseFloat(node.value) > parseFloat(node.value2)
        ) {
          errs[node.id] = {
            level: "error",
            msg: "Range minimum is greater than maximum",
          };
          return;
        }
        if (f.type === "date" && new Date(node.value) > new Date(node.value2)) {
          errs[node.id] = {
            level: "error",
            msg: "Start date is after end date",
          };
          return;
        }
        return;
      }
      if (!String(node.value ?? "").length) {
        errs[node.id] = { level: "error", msg: "Value is required" };
        return;
      }
      if (node.op === "regex") {
        try {
          new RegExp(node.value);
        } catch {
          errs[node.id] = { level: "error", msg: "Invalid regular expression" };
        }
      }
    };
    walk(root);
    return errs;
  }
}
