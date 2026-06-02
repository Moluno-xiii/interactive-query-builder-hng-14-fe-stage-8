import { describe, it, expect } from "vitest";
import { FormatService } from "@/components/build-query/services/format-service";
import { SCHEMAS } from "@/components/build-query/data";

const orders = SCHEMAS[0];
const fmt = new FormatService();

describe("FormatService.fmtCurrency", () => {
  it("formats a number as USD with grouping and two decimals", () => {
    expect(fmt.fmtCurrency(1234.5)).toBe("$1,234.50");
  });

  it("formats zero", () => {
    expect(fmt.fmtCurrency(0)).toBe("$0.00");
  });
});

describe("FormatService.fmtDate", () => {
  it("renders a dash for null", () => {
    expect(fmt.fmtDate(null)).toBe("—");
  });

  it("renders a localized date for a timestamp", () => {
    expect(fmt.fmtDate(Date.UTC(2024, 5, 15, 12))).toMatch(/^\w{3} \d{1,2}, 2024$/);
  });
});

describe("FormatService.fmtCell", () => {
  it("renders a dash for null", () => {
    expect(fmt.fmtCell("amount", null, orders)).toBe("—");
  });

  it("formats a currency field", () => {
    expect(fmt.fmtCell("amount", 1234.5, orders)).toBe("$1,234.50");
  });

  it("formats a boolean field", () => {
    expect(fmt.fmtCell("is_gift", true, orders)).toBe("true");
  });

  it("renders a date field in the localized format", () => {
    expect(fmt.fmtCell("created_at", Date.UTC(2024, 5, 15, 12), orders)).toMatch(/^\w{3} \d{1,2}, 2024$/);
  });

  it("stringifies an enum field", () => {
    expect(fmt.fmtCell("status", "paid", orders)).toBe("paid");
  });

  it("stringifies an unknown field", () => {
    expect(fmt.fmtCell("ghost", 42, orders)).toBe("42");
  });
});
