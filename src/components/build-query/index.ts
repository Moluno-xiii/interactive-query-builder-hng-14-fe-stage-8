const inputBase =
  "h-8 rounded-sm border border-border bg-inset px-2.5 text-[13px] text-foreground outline-none transition-[background-color,border-color,box-shadow] duration-150 placeholder:text-faint hover:border-border-strong focus:border-accent focus:bg-surface focus:ring-[3px] focus:ring-accent-dim";

const panelHead =
  "flex h-11.5 flex-none items-center justify-between border-b border-border-soft bg-surface pl-4 pr-3.5";

const panelTitle =
  "flex items-center gap-2.25 text-[13.5px] font-semibold tracking-[0.2px]";

interface Option {
  value: string;
  label: string;
  sub?: string;
  icon?: string;
}

type ModalKind = "schema" | "io" | "presets" | "history";

const PAGE_SIZE = 15;

interface Tone {
  pill: string;
  dot: string;
}

const TONES: Record<string, Tone> = {
  accent: { pill: "bg-accent-dim text-accent", dot: "bg-accent" },
  and: { pill: "bg-and-dim text-and", dot: "bg-and" },
  or: { pill: "bg-or-dim text-or", dot: "bg-or" },
  danger: { pill: "bg-danger-dim text-danger", dot: "bg-danger" },
  muted: { pill: "bg-surface-2 text-faint", dot: "bg-faint" },
};

const MUTED_TONE = TONES.muted;

const BADGE_TONES: Record<string, Record<string, Tone>> = {
  status: {
    paid: TONES.accent,
    delivered: TONES.accent,
    shipped: TONES.and,
    pending: TONES.or,
    refunded: TONES.danger,
    cancelled: TONES.muted,
  },
  account_status: {
    active: TONES.accent,
    invited: TONES.and,
    suspended: TONES.or,
    churned: TONES.danger,
  },
  event_type: {
    signup: TONES.accent,
    purchase: TONES.or,
    click: TONES.and,
    login: TONES.and,
    page_view: TONES.muted,
    error: TONES.danger,
  },
  severity: {
    debug: TONES.muted,
    info: TONES.and,
    warn: TONES.or,
    error: TONES.danger,
  },
};

const SQL_TOKENIZER =
  /('(?:[^']|'')*')|(\b\d+(?:\.\d+)?\b)|(\b(?:NOT IN|IN|NOT|LIKE|BETWEEN|AND|OR|IS|NULL|TRUE|FALSE|SELECT|FROM|WHERE)\b)|([=!<>~≥≤≠∋∈∉]+)/g;

const TOKEN_CLASS = {
  id: "text-foreground",
  str: "text-accent",
  num: "text-or",
  kw: "font-semibold text-and",
  op: "text-muted-foreground",
} as const;

export type { Option, ModalKind, Tone };
export {
  inputBase,
  panelHead,
  panelTitle,
  BADGE_TONES,
  MUTED_TONE,
  SQL_TOKENIZER,
  TOKEN_CLASS,
  PAGE_SIZE,
};
