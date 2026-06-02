import { describe, it, expect } from "vitest";
import { TreeService } from "@/components/build-query/services/tree-service";
import { ValidationService } from "@/components/build-query/services/validation-service";
import { SCHEMAS } from "@/components/build-query/data";
import type { Group, Rule } from "@/components/build-query/types";

const orders = SCHEMAS[0];
const make = () => new TreeService(new ValidationService());

const rule = (id: string, over: Partial<Rule> = {}): Rule => ({
  id,
  kind: "rule",
  field: "status",
  op: "eq",
  value: "paid",
  value2: "",
  ...over,
});

const group = (id: string, children: (Rule | Group)[], over: Partial<Group> = {}): Group => ({
  id,
  kind: "group",
  combinator: "AND",
  collapsed: false,
  children,
  ...over,
});

describe("TreeService construction helpers", () => {
  it("makeRule uses the default operator for the field type", () => {
    expect(make().makeRule("status", orders).op).toBe("eq");
  });

  it("makeRule starts with an empty value", () => {
    expect(make().makeRule("status", orders).value).toBe("");
  });

  it("makeGroup defaults to an AND combinator", () => {
    expect(make().makeGroup().combinator).toBe("AND");
  });

  it("makeGroup defaults to expanded with no children", () => {
    expect(make().makeGroup().children).toHaveLength(0);
  });

  it("starterTree wraps a single rule in an AND group", () => {
    expect(make().starterTree(orders).children).toHaveLength(1);
  });

  it("defaultOperator returns the first operator for the type", () => {
    expect(make().defaultOperator("number")).toBe("eq");
  });
});

describe("TreeService.clone", () => {
  it("returns a copy that is a different reference", () => {
    const t = make();
    const g = group("g", [rule("r")]);
    expect(t.clone(g) === g).toBe(false);
  });

  it("returns structurally-equal data", () => {
    const t = make();
    const g = group("g", [rule("r")]);
    expect(JSON.stringify(t.clone(g))).toBe(JSON.stringify(g));
  });
});

describe("TreeService.applyAction", () => {
  it("addRule appends a rule without mutating the input", () => {
    const t = make();
    const tree = group("root", [rule("a")]);
    const next = t.applyAction(tree, { t: "addRule", id: "root" }, orders);
    expect(next.children).toHaveLength(2);
    expect(tree.children).toHaveLength(1);
  });

  it("addGroup appends an OR group seeded with one rule", () => {
    const t = make();
    const next = t.applyAction(group("root", []), { t: "addGroup", id: "root" }, orders);
    const child = next.children[0] as Group;
    expect(child.combinator).toBe("OR");
    expect(child.children).toHaveLength(1);
  });

  it("remove deletes the targeted node", () => {
    const t = make();
    const next = t.applyAction(group("root", [rule("a"), rule("b")]), { t: "remove", id: "a" }, orders);
    expect(next.children).toHaveLength(1);
  });

  it("duplicate copies a node with a fresh id", () => {
    const t = make();
    const next = t.applyAction(group("root", [rule("a", { value: "paid" })]), { t: "duplicate", id: "a" }, orders);
    expect(next.children).toHaveLength(2);
    const copy = next.children[1] as Rule;
    expect(copy.id).not.toBe("a");
    expect(copy.value).toBe("paid");
  });

  it("patch updates fields on the targeted node", () => {
    const t = make();
    const next = t.applyAction(group("root", [rule("a")]), { t: "patch", id: "a", patch: { value: "shipped" } }, orders);
    expect((next.children[0] as Rule).value).toBe("shipped");
  });

  it("collapseAll collapses nested groups but not the root", () => {
    const t = make();
    const next = t.applyAction(group("root", [group("inner", [rule("a")])]), { t: "collapseAll", collapsed: true }, orders);
    expect(next.collapsed).toBe(false);
    expect((next.children[0] as Group).collapsed).toBe(true);
  });

  it("move reorders siblings with the after edge", () => {
    const t = make();
    const next = t.applyAction(group("root", [rule("a"), rule("b")]), { t: "move", dragId: "a", targetId: "b", edge: "after" }, orders);
    expect(next.children.map((c) => c.id)).toEqual(["b", "a"]);
  });

  it("move into a group nests the dragged node", () => {
    const t = make();
    const next = t.applyAction(
      group("root", [rule("a"), group("g", [rule("b")])]),
      { t: "move", dragId: "a", targetId: "g", edge: "inside" },
      orders,
    );
    expect(next.children).toHaveLength(1);
    expect((next.children[0] as Group).children).toHaveLength(2);
  });

  it("move refuses to drop a group inside its own descendant", () => {
    const t = make();
    const next = t.applyAction(
      group("root", [group("outer", [group("inner", [rule("a")])])]),
      { t: "move", dragId: "outer", targetId: "inner", edge: "inside" },
      orders,
    );
    expect(next.children).toHaveLength(1);
  });
});

describe("TreeService traversal", () => {
  it("reId assigns new ids to every node", () => {
    const t = make();
    const g = group("g", [rule("a")]);
    t.reId(g);
    expect(g.id).not.toBe("g");
  });

  it("countComplete counts only complete rules", () => {
    const t = make();
    expect(t.countComplete(group("g", [rule("a"), rule("b", { value: "" })]))).toBe(1);
  });

  it("walkTree visits the group and all descendants", () => {
    const t = make();
    let n = 0;
    t.walkTree(group("g", [rule("a"), group("h", [rule("b")])]), () => {
      n++;
    });
    expect(n).toBe(4);
  });
});
