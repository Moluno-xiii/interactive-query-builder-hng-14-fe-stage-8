import { FIELD_MAP } from "../data";
import type { DataValue } from "../types";

export class FormatService {
  fmtCurrency(v: DataValue): string {
    return (
      "$" +
      Number(v).toLocaleString("en-US", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })
    );
  }

  fmtDate(ms: DataValue): string {
    return ms == null
      ? "—"
      : new Date(ms as number).toLocaleDateString("en-US", {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
  }

  fmtCell(field: string, v: DataValue): string {
    const f = FIELD_MAP[field];
    if (v == null) return "—";
    if (f.type === "date") return this.fmtDate(v);
    if (f.fmt === "currency") return this.fmtCurrency(v);
    if (f.type === "boolean") return v ? "true" : "false";
    return String(v);
  }
}
