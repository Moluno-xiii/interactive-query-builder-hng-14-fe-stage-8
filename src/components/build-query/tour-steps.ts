import type { IconType } from "react-icons";
import {
  PiCode,
  PiDatabase,
  PiFunnel,
  PiHandWaving,
  PiPlay,
  PiTreeStructure,
} from "react-icons/pi";

export interface TourStep {
  /** CSS selector for the element to highlight, or null for a centered card. */
  target: string | null;
  /** Selector tried when the primary target is hidden (e.g. on mobile). */
  fallback?: string;
  title: string;
  body: string;
  icon: IconType;
  /** Extra spotlight padding around the target, in pixels. */
  pad?: number;
}

export const TOUR_STEPS: TourStep[] = [
  {
    target: null,
    title: "Welcome to QueryForge",
    body: "Build database queries visually, with no SQL to write. Here is a quick tour. You can skip it anytime, and reopen it later from the help icon in the toolbar.",
    icon: PiHandWaving,
  },
  {
    target: '[data-tour="source"]',
    fallback: '[data-tour="menu"]',
    title: "Pick a data source",
    body: "Choose the table your query runs against. Switching tables starts a fresh query.",
    icon: PiDatabase,
    pad: 6,
  },
  {
    target: '[data-tour="builder"]',
    title: "Build your conditions",
    body: "This is the query builder. Compose filters visually, and the rest of the screen updates as you go.",
    icon: PiFunnel,
    pad: 4,
  },
  {
    target: '[data-tour="logic"]',
    title: "Combine and nest",
    body: "Each rule is a field, an operator, and a value. Switch AND or OR, add rules, or nest groups for logic of any depth.",
    icon: PiTreeStructure,
    pad: 6,
  },
  {
    target: '[data-tour="preview"]',
    title: "Live SQL preview",
    body: "Your query compiles to SQL as you build. Copy it whenever you need it.",
    icon: PiCode,
    pad: 4,
  },
  {
    target: '[data-tour="run"]',
    title: "Run and inspect",
    body: "Execute against the data and explore the results below. Shortcut: Cmd or Ctrl plus Enter.",
    icon: PiPlay,
    pad: 6,
  },
];
