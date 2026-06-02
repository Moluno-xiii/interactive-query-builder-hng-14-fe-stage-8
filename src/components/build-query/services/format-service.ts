import type { DataValue, Schema } from "../types";

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

  fmtCell(field: string, v: DataValue, schema: Schema): string {
    if (v == null) return "—";
    const f = schema.fieldMap[field];
    if (!f) return String(v);
    if (f.type === "date") return this.fmtDate(v);
    if (f.fmt === "currency") return this.fmtCurrency(v);
    if (f.type === "boolean") return v ? "true" : "false";
    return String(v);
  }
}
