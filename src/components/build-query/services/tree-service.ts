import { OPS_BY_TYPE } from "../data";
import type {
  Action,
  Edge,
  FieldType,
  Group,
  Located,
  QueryNode,
  Rule,
  Schema,
} from "../types";
import { ValidationService } from "./validation-service";

export class TreeService {
  private idSeq = 1;

  constructor(private readonly validation: ValidationService) {}

  private uid(prefix = "n"): string {
    return `${prefix}${(this.idSeq++).toString(36)}${Math.floor(
      Math.random() * 1296,
    ).toString(36)}`;
  }

  defaultOperator(type: FieldType): string {
    return OPS_BY_TYPE[type][0];
  }

  clone<T>(x: T): T {
    return JSON.parse(JSON.stringify(x));
  }

  makeRule(field: string, schema: Schema): Rule {
    const f = schema.fieldMap[field] || schema.fields[0];
    return {
      id: this.uid("r"),
      kind: "rule",
      field: f.key,
      op: this.defaultOperator(f.type),
      value: "",
      value2: "",
    };
  }

  makeGroup(
    combinator: "AND" | "OR" = "AND",
    children: QueryNode[] | null = null,
  ): Group {
    return {
      id: this.uid("g"),
      kind: "group",
      combinator,
      collapsed: false,
      children: children || [],
    };
  }

  reId(node: QueryNode): void {
    node.id = this.uid(node.kind === "group" ? "g" : "r");
    if (node.kind === "group") node.children.forEach((c) => this.reId(c));
  }

  walkTree(node: QueryNode, fn: (n: QueryNode) => void): void {
    fn(node);
    if (node.kind === "group")
      node.children.forEach((c) => this.walkTree(c, fn));
  }

  countComplete(tree: Group): number {
    let n = 0;
    this.walkTree(tree, (x) => {
      if (x.kind === "rule" && this.validation.isComplete(x)) n++;
    });
    return n;
  }

  private locate(
    node: QueryNode,
    id: string,
    parent: Group | null = null,
    index = -1,
  ): Located | null {
    if (node.id === id) return { node, parent, index };
    if (node.kind === "group") {
      for (let i = 0; i < node.children.length; i++) {
        const r = this.locate(node.children[i], id, node, i);
        if (r) return r;
      }
    }
    return null;
  }

  private isAncestor(
    root: QueryNode,
    maybeAncestorId: string,
    id: string,
  ): boolean {
    const a = this.locate(root, maybeAncestorId);
    if (!a || a.node.kind !== "group") return false;
    return !!this.locate(a.node, id);
  }

  private moveNode(
    root: Group,
    dragId: string,
    targetId: string,
    edge: Edge,
  ): Group {
    if (dragId === targetId) return root;
    if (this.isAncestor(root, dragId, targetId)) return root;
    const r = this.clone(root);
    const dl = this.locate(r, dragId);
    if (!dl || !dl.parent) return root;
    dl.parent.children.splice(dl.index, 1);
    if (edge === "inside") {
      const tg = this.locate(r, targetId);
      if (tg && tg.node.kind === "group") tg.node.children.push(dl.node);
      return r;
    }
    const tl = this.locate(r, targetId);
    if (!tl || !tl.parent) return root;
    tl.parent.children.splice(tl.index + (edge === "after" ? 1 : 0), 0, dl.node);
    return r;
  }

  applyAction(tree: Group, a: Action, schema: Schema): Group {
    const r = this.clone(tree);
    if (a.t === "patch") {
      const l = this.locate(r, a.id);
      if (l) Object.assign(l.node, a.patch);
      return r;
    }
    if (a.t === "addRule") {
      const l = this.locate(r, a.id);
      if (l && l.node.kind === "group") {
        l.node.children.push(this.makeRule(schema.fields[0].key, schema));
        l.node.collapsed = false;
      }
      return r;
    }
    if (a.t === "addGroup") {
      const l = this.locate(r, a.id);
      if (l && l.node.kind === "group") {
        l.node.children.push(
          this.makeGroup("OR", [this.makeRule(schema.fields[0].key, schema)]),
        );
        l.node.collapsed = false;
      }
      return r;
    }
    if (a.t === "remove") {
      const l = this.locate(r, a.id);
      if (l && l.parent) l.parent.children.splice(l.index, 1);
      return r;
    }
    if (a.t === "duplicate") {
      const l = this.locate(r, a.id);
      if (l && l.parent) {
        const c = this.clone(l.node);
        this.reId(c);
        l.parent.children.splice(l.index + 1, 0, c);
      }
      return r;
    }
    if (a.t === "collapseAll") {
      this.walkTree(r, (n) => {
        if (n.kind === "group" && n.id !== r.id) n.collapsed = a.collapsed;
      });
      return r;
    }
    if (a.t === "move") return this.moveNode(tree, a.dragId, a.targetId, a.edge);
    return tree;
  }

  starterTree(schema: Schema): Group {
    return this.makeGroup("AND", [this.makeRule(schema.fields[0].key, schema)]);
  }
}
