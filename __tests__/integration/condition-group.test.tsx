import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, screen } from "@testing-library/react";
import { mkRule, mkGroup, seed, renderBuilder } from "../helpers/render-builder";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

const nested = () =>
  mkGroup("root", [
    mkRule("a"),
    mkGroup("g", [mkRule("b", { field: "amount", op: "gt" }), mkRule("c")], "OR"),
  ]);

describe("ConditionGroup recursive rendering", () => {
  it("renders the root group with a WHERE label", () => {
    seed(nested());
    renderBuilder();
    expect(screen.queryAllByText("where")).toHaveLength(1);
  });

  it("renders a nested group with a group label", () => {
    seed(nested());
    renderBuilder();
    expect(screen.queryAllByText("group")).toHaveLength(1);
  });

  it("renders one row per rule across all depths", () => {
    seed(nested());
    renderBuilder();
    expect(screen.queryAllByLabelText("Remove rule")).toHaveLength(3);
  });

  it("makes only nested groups removable, not the root", () => {
    seed(nested());
    renderBuilder();
    expect(screen.queryAllByLabelText("Remove group")).toHaveLength(1);
  });

  it("marks nesting depth on each group", () => {
    seed(nested());
    const { container } = renderBuilder();
    expect(container.querySelectorAll("[data-depth]")).toHaveLength(2);
    expect(container.querySelectorAll('[data-depth="1"]')).toHaveLength(1);
  });
});
