import { ReactNode } from "react";
import {
  PiStack,
  PiDatabase,
  PiCode,
  PiTable,
  PiWarningCircle,
  PiCommand,
} from "react-icons/pi";

const FEATURES: { icon: ReactNode; title: string; desc: string }[] = [
  {
    icon: <PiStack size={20} />,
    title: "Unlimited nested logic",
    desc: "Group conditions and nest groups within groups — each with its own AND / OR. Build (A AND B) OR (C AND D) without writing a line of SQL.",
  },
  {
    icon: <PiDatabase size={20} />,
    title: "Schema-driven controls",
    desc: "The builder reads the field schema and renders the right input every time — number fields, date pickers, enum dropdowns, multi-select.",
  },
  {
    icon: <PiCode size={20} />,
    title: "Live query preview",
    desc: "A syntax-highlighted SQL preview regenerates on every keystroke, so the query you’re building is always in front of you.",
  },
  {
    icon: <PiTable size={20} />,
    title: "Execution simulator",
    desc: "Run the query against a seeded dataset of orders. Sortable, paginated results with loading, empty, and ready states.",
  },
  {
    icon: <PiWarningCircle size={20} />,
    title: "Validation engine",
    desc: "Incompatible operators, empty groups, and invalid ranges are caught and surfaced inline before the query ever runs.",
  },
  {
    icon: <PiCommand size={20} />,
    title: "Built for real work",
    desc: "Drag-and-drop reordering, collapsible groups, query history, saved presets, JSON import/export, and a light/dark toggle.",
  },
];

const STEPS: { n: string; title: string; desc: string }[] = [
  {
    n: "01",
    title: "Pick fields & operators",
    desc: "Add rules from the schema and choose how each one compares.",
  },
  {
    n: "02",
    title: "Group & nest the logic",
    desc: "Wrap rules in AND/OR groups and nest them as deep as you need.",
  },
  {
    n: "03",
    title: "Preview & run",
    desc: "Watch the SQL build live, then execute it against the dataset.",
  },
];

export { FEATURES, STEPS };
