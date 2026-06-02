import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, screen, fireEvent } from "@testing-library/react";
import { mkRule, mkGroup, seed, renderBuilder } from "../helpers/render-builder";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Builder interactions", () => {
  it("adds a rule when the Rule button is clicked", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: "Rule" }));
    expect(screen.queryAllByLabelText("Remove rule")).toHaveLength(2);
  });

  it("removes a rule when its Remove button is clicked", () => {
    seed(mkGroup("root", [mkRule("a"), mkRule("b")]));
    renderBuilder();
    fireEvent.click(screen.getAllByLabelText("Remove rule")[0]);
    expect(screen.queryAllByLabelText("Remove rule")).toHaveLength(1);
  });

  it("adds a nested group when the Group button is clicked", () => {
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: "Group" }));
    expect(screen.queryAllByLabelText("Remove group")).toHaveLength(1);
  });

  it("switches the combinator when OR is selected", () => {
    seed(mkGroup("root", [mkRule("a"), mkRule("b")]));
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: "OR" }));
    expect(screen.getAllByText("AND")).toHaveLength(1);
    expect(screen.getAllByText("OR")).toHaveLength(2);
  });

  it("collapses nested groups when Collapse all is clicked", () => {
    seed(mkGroup("root", [mkRule("a"), mkGroup("g", [mkRule("b")])]));
    renderBuilder();
    fireEvent.click(screen.getByLabelText("Collapse all"));
    expect(screen.queryAllByLabelText("Remove rule")).toHaveLength(1);
  });

  it("clears the builder when Clear is clicked", () => {
    seed(mkGroup("root", [mkRule("a")]));
    renderBuilder();
    fireEvent.click(screen.getByRole("button", { name: "Clear" }));
    expect(screen.queryAllByLabelText("Remove rule")).toHaveLength(0);
  });
});
