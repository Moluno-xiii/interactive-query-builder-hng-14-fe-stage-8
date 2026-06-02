import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { cleanup, screen, fireEvent } from "@testing-library/react";
import { renderWithPreview } from "../helpers/render-builder";

beforeEach(() => {
  localStorage.clear();
  vi.useFakeTimers();
});

afterEach(() => {
  cleanup();
  vi.useRealTimers();
});

describe("Live query preview", () => {
  it("shows the SELECT/FROM clause for the active schema", () => {
    const { container } = renderWithPreview();
    expect(container.querySelector("pre")?.textContent ?? "").toContain("FROM orders");
  });

  it("updates the generated SQL as a rule value changes", () => {
    const { container } = renderWithPreview();
    fireEvent.change(screen.getByPlaceholderText("value…"), {
      target: { value: "ORD-42" },
    });
    expect(container.querySelector("pre")?.textContent ?? "").toContain("ORD-42");
  });
});
