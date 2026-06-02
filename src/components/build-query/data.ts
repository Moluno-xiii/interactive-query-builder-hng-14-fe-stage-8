import type { EnumKey, Field, FieldType, Operator, Row, Schema } from "./types";

export const ENUMS: Record<EnumKey, readonly string[]> = {
  status: ["pending", "paid", "shipped", "delivered", "refunded", "cancelled"],
  region: ["North America", "Europe", "APAC", "LATAM", "MEA"],
  category: [
    "Electronics",
    "Apparel",
    "Home & Kitchen",
    "Books",
    "Toys",
    "Beauty",
  ],
  payment: ["Credit Card", "PayPal", "Apple Pay", "Wire Transfer", "Gift Card"],
  channel: ["Web", "iOS", "Android", "Marketplace", "Phone"],
  plan: ["Free", "Pro", "Team", "Enterprise"],
  role: ["Owner", "Admin", "Member", "Viewer"],
  account_status: ["active", "invited", "suspended", "churned"],
  country: [
    "United States",
    "United Kingdom",
    "Germany",
    "India",
    "Nigeria",
    "Brazil",
  ],
  event_type: ["page_view", "click", "signup", "purchase", "error", "login"],
  platform: ["Web", "iOS", "Android", "API"],
  severity: ["debug", "info", "warn", "error"],
  env: ["production", "staging", "development"],
};

export const OPERATORS: Record<string, Operator> = {
  eq: { label: "equals", sym: "=", arity: 1 },
  neq: { label: "not equals", sym: "≠", arity: 1 },
  gt: { label: "greater than", sym: ">", arity: 1 },
  gte: { label: "greater or equal", sym: "≥", arity: 1 },
  lt: { label: "less than", sym: "<", arity: 1 },
  lte: { label: "less or equal", sym: "≤", arity: 1 },
  between: { label: "between", sym: "⋯", arity: 2 },
  contains: { label: "contains", sym: "∋", arity: 1 },
  starts: { label: "starts with", sym: "^", arity: 1 },
  ends: { label: "ends with", sym: "$", arity: 1 },
  regex: { label: "matches regex", sym: ".*", arity: 1 },
  in: { label: "in", sym: "∈", arity: 1, multi: true },
  notin: { label: "not in", sym: "∉", arity: 1, multi: true },
  before: { label: "before", sym: "<", arity: 1 },
  after: { label: "after", sym: ">", arity: 1 },
  on: { label: "on", sym: "=", arity: 1 },
  istrue: { label: "is true", sym: "✓", arity: 0 },
  isfalse: { label: "is false", sym: "✕", arity: 0 },
  isnull: { label: "is null", sym: "∅", arity: 0 },
  notnull: { label: "is not null", sym: "∃", arity: 0 },
};

export const OPS_BY_TYPE: Record<FieldType, string[]> = {
  id: ["eq", "neq", "in", "notnull", "isnull"],
  string: [
    "eq",
    "neq",
    "contains",
    "starts",
    "ends",
    "regex",
    "in",
    "isnull",
    "notnull",
  ],
  number: [
    "eq",
    "neq",
    "gt",
    "gte",
    "lt",
    "lte",
    "between",
    "in",
    "isnull",
    "notnull",
  ],
  enum: ["eq", "neq", "in", "notin", "isnull", "notnull"],
  date: ["on", "before", "after", "between", "isnull", "notnull"],
  boolean: ["istrue", "isfalse"],
};

function mulberry32(a: number): () => number {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const fieldMapOf = (fields: Field[]): Record<string, Field> =>
  Object.fromEntries(fields.map((f) => [f.key, f]));

const HANDLES = [
  "amelia",
  "noah",
  "priya",
  "kenji",
  "sofia",
  "liam",
  "zara",
  "mateo",
  "wei",
  "olu",
  "hana",
  "diego",
];
const DOMAINS = ["gmail.com", "fastmail.com", "proton.me", "outlook.com", "hey.com"];
const DAY = 86400000;
const NOW = new Date("2026-05-28T00:00:00Z").getTime();

const email = (rnd: () => number) =>
  HANDLES[Math.floor(rnd() * HANDLES.length)] +
  (Math.floor(rnd() * 89) + 10) +
  "@" +
  DOMAINS[Math.floor(rnd() * DOMAINS.length)];

/* ----------------------------- ORDERS ----------------------------------- */
const ordersFields = [
  { key: "order_id", label: "order_id", type: "id", icon: "hash" },
  { key: "customer", label: "customer_email", type: "string", icon: "text" },
  { key: "category", label: "category", type: "enum", icon: "tag", enum: "category" },
  { key: "product", label: "product", type: "string", icon: "text" },
  { key: "amount", label: "amount_usd", type: "number", icon: "num", fmt: "currency" },
  { key: "quantity", label: "quantity", type: "number", icon: "num" },
  { key: "status", label: "status", type: "enum", icon: "tag", enum: "status" },
  { key: "region", label: "region", type: "enum", icon: "tag", enum: "region" },
  { key: "payment", label: "payment_method", type: "enum", icon: "tag", enum: "payment" },
  { key: "channel", label: "channel", type: "enum", icon: "tag", enum: "channel" },
  { key: "is_gift", label: "is_gift", type: "boolean", icon: "bool" },
  { key: "created_at", label: "created_at", type: "date", icon: "date" },
  { key: "shipped_at", label: "shipped_at", type: "date", icon: "date" },
] as Field[];

const PRODUCTS: Record<string, string[]> = {
  Electronics: [
    "Aurora Wireless Earbuds",
    "Nimbus 4K Webcam",
    "Volt Power Bank 20k",
    "Pulse Mechanical Keyboard",
    "Helio Desk Lamp",
    "Quartz Smart Watch",
  ],
  Apparel: [
    "Merino Crew Sweater",
    "Trailhead Rain Shell",
    "Linen Oxford Shirt",
    "Everyday Chino Pants",
    "Cloudfoam Runners",
  ],
  "Home & Kitchen": [
    'Cast Iron Skillet 12"',
    "Pour-Over Coffee Set",
    "Linen Duvet Cover",
    "Ceramic Knife Block",
    "Stoneware Mug Set",
  ],
  Books: [
    "The Pragmatic Engineer",
    "Designing Data Systems",
    "Atlas of Quiet Places",
    "Foundations of Type",
  ],
  Toys: [
    "Modular Robotics Kit",
    "Constellation Puzzle 1000pc",
    "Wooden Train Set",
    "Hydro Rocket Launcher",
  ],
  Beauty: [
    "Botanical Day Serum",
    "Charcoal Clay Mask",
    "Silk Press Hair Oil",
    "Mineral SPF 40",
  ],
};

function buildOrders(n = 260): Row[] {
  const rnd = mulberry32(20260530);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
  const rows: Row[] = [];
  for (let i = 0; i < n; i++) {
    const category = pick(ENUMS.category);
    const status = pick(ENUMS.status);
    const created = NOW - Math.floor(rnd() * 420) * DAY - Math.floor(rnd() * DAY);
    const shipDelay =
      status === "pending" || status === "cancelled"
        ? null
        : Math.floor(rnd() * 6 + 1) * DAY;
    const qty = 1 + Math.floor(rnd() * rnd() * 6);
    const unit = +(8 + rnd() * rnd() * 740).toFixed(2);
    rows.push({
      order_id: "ORD-" + (104832 + i),
      customer: email(rnd),
      category,
      product: pick(PRODUCTS[category]),
      amount: +(unit * qty).toFixed(2),
      quantity: qty,
      status,
      region: pick(ENUMS.region),
      payment: pick(ENUMS.payment),
      channel: pick(ENUMS.channel),
      is_gift: rnd() > 0.78,
      created_at: created,
      shipped_at: shipDelay == null ? null : created + shipDelay,
    });
  }
  return rows;
}

/* ----------------------------- USERS ------------------------------------ */
const usersFields = [
  { key: "user_id", label: "user_id", type: "id", icon: "hash" },
  { key: "email", label: "email", type: "string", icon: "text" },
  { key: "name", label: "full_name", type: "string", icon: "text" },
  { key: "plan", label: "plan", type: "enum", icon: "tag", enum: "plan" },
  { key: "role", label: "role", type: "enum", icon: "tag", enum: "role" },
  { key: "account_status", label: "status", type: "enum", icon: "tag", enum: "account_status" },
  { key: "country", label: "country", type: "enum", icon: "tag", enum: "country" },
  { key: "seats", label: "seats", type: "number", icon: "num" },
  { key: "mrr", label: "mrr_usd", type: "number", icon: "num", fmt: "currency" },
  { key: "is_verified", label: "is_verified", type: "boolean", icon: "bool" },
  { key: "signed_up_at", label: "signed_up_at", type: "date", icon: "date" },
  { key: "last_active_at", label: "last_active_at", type: "date", icon: "date" },
] as Field[];

const FIRST_NAMES = [
  "Amelia",
  "Noah",
  "Priya",
  "Kenji",
  "Sofia",
  "Liam",
  "Zara",
  "Mateo",
  "Wei",
  "Olu",
  "Hana",
  "Diego",
];
const LAST_NAMES = [
  "Okafor",
  "Nguyen",
  "Schmidt",
  "Rossi",
  "Patel",
  "Garcia",
  "Kim",
  "Silva",
  "Haddad",
  "Novak",
];
const PLAN_MRR: Record<string, number> = {
  Free: 0,
  Pro: 29,
  Team: 99,
  Enterprise: 499,
};

function buildUsers(n = 180): Row[] {
  const rnd = mulberry32(8675309);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
  const rows: Row[] = [];
  for (let i = 0; i < n; i++) {
    const plan = pick(ENUMS.plan);
    const seats = 1 + Math.floor(rnd() * rnd() * 60);
    const signed = NOW - Math.floor(rnd() * 900) * DAY - Math.floor(rnd() * DAY);
    const active = Math.min(NOW, signed + Math.floor(rnd() * 200) * DAY);
    rows.push({
      user_id: "USR-" + (40219 + i),
      email: email(rnd),
      name: pick(FIRST_NAMES) + " " + pick(LAST_NAMES),
      plan,
      role: pick(ENUMS.role),
      account_status: pick(ENUMS.account_status),
      country: pick(ENUMS.country),
      seats,
      mrr: +(PLAN_MRR[plan] * seats).toFixed(2),
      is_verified: rnd() > 0.32,
      signed_up_at: signed,
      last_active_at: active,
    });
  }
  return rows;
}

/* ----------------------------- EVENTS ----------------------------------- */
const eventsFields = [
  { key: "event_id", label: "event_id", type: "id", icon: "hash" },
  { key: "user", label: "user_email", type: "string", icon: "text" },
  { key: "event_type", label: "event_type", type: "enum", icon: "tag", enum: "event_type" },
  { key: "platform", label: "platform", type: "enum", icon: "tag", enum: "platform" },
  { key: "severity", label: "severity", type: "enum", icon: "tag", enum: "severity" },
  { key: "env", label: "environment", type: "enum", icon: "tag", enum: "env" },
  { key: "duration_ms", label: "duration_ms", type: "number", icon: "num" },
  { key: "value", label: "value_usd", type: "number", icon: "num", fmt: "currency" },
  { key: "is_bot", label: "is_bot", type: "boolean", icon: "bool" },
  { key: "occurred_at", label: "occurred_at", type: "date", icon: "date" },
] as Field[];

function buildEvents(n = 320): Row[] {
  const rnd = mulberry32(31337);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
  const rows: Row[] = [];
  for (let i = 0; i < n; i++) {
    const type = pick(ENUMS.event_type);
    const severity =
      type === "error" ? "error" : pick(["debug", "info", "warn"]);
    rows.push({
      event_id: "EVT-" + (900001 + i),
      user: email(rnd),
      event_type: type,
      platform: pick(ENUMS.platform),
      severity,
      env: pick(ENUMS.env),
      duration_ms: Math.floor(rnd() * rnd() * 4000),
      value: type === "purchase" ? +(5 + rnd() * rnd() * 900).toFixed(2) : 0,
      is_bot: rnd() > 0.85,
      occurred_at: NOW - Math.floor(rnd() * 90) * DAY - Math.floor(rnd() * DAY),
    });
  }
  return rows;
}

/* ----------------------------- REGISTRY --------------------------------- */
export const SCHEMAS: Schema[] = [
  {
    id: "orders",
    name: "orders",
    label: "Orders",
    fields: ordersFields,
    fieldMap: fieldMapOf(ordersFields),
    rows: buildOrders(),
    resultCols: [
      "order_id",
      "customer",
      "category",
      "product",
      "amount",
      "status",
      "region",
      "created_at",
    ],
  },
  {
    id: "users",
    name: "users",
    label: "Users",
    fields: usersFields,
    fieldMap: fieldMapOf(usersFields),
    rows: buildUsers(),
    resultCols: [
      "user_id",
      "email",
      "name",
      "plan",
      "role",
      "account_status",
      "mrr",
      "signed_up_at",
    ],
  },
  {
    id: "events",
    name: "events",
    label: "Events",
    fields: eventsFields,
    fieldMap: fieldMapOf(eventsFields),
    rows: buildEvents(),
    resultCols: [
      "event_id",
      "user",
      "event_type",
      "platform",
      "severity",
      "duration_ms",
      "occurred_at",
    ],
  },
];

export const DEFAULT_SCHEMA_ID = "orders";

export const schemaById = (id: string | null): Schema =>
  SCHEMAS.find((s) => s.id === id) ?? SCHEMAS[0];
