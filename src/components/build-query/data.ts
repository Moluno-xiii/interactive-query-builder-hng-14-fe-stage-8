import type { EnumKey, Field, FieldType, Operator, Row } from "./types";
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
};
export const SCHEMA = {
  name: "orders",
  label: "Orders",
  rows: "48,219",
  fields: [
    { key: "order_id", label: "order_id", type: "id", icon: "hash" },
    { key: "customer", label: "customer_email", type: "string", icon: "text" },
    {
      key: "category",
      label: "category",
      type: "enum",
      icon: "tag",
      enum: "category",
    },
    { key: "product", label: "product", type: "string", icon: "text" },
    {
      key: "amount",
      label: "amount_usd",
      type: "number",
      icon: "num",
      fmt: "currency",
    },
    { key: "quantity", label: "quantity", type: "number", icon: "num" },
    {
      key: "status",
      label: "status",
      type: "enum",
      icon: "tag",
      enum: "status",
    },
    {
      key: "region",
      label: "region",
      type: "enum",
      icon: "tag",
      enum: "region",
    },
    {
      key: "payment",
      label: "payment_method",
      type: "enum",
      icon: "tag",
      enum: "payment",
    },
    {
      key: "channel",
      label: "channel",
      type: "enum",
      icon: "tag",
      enum: "channel",
    },
    { key: "is_gift", label: "is_gift", type: "boolean", icon: "bool" },
    { key: "created_at", label: "created_at", type: "date", icon: "date" },
    { key: "shipped_at", label: "shipped_at", type: "date", icon: "date" },
  ] as Field[],
};

export const FIELD_MAP: Record<string, Field> = Object.fromEntries(
  SCHEMA.fields.map((f) => [f.key, f]),
);
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

function buildDataset(n = 260): Row[] {
  const rnd = mulberry32(20260530);
  const pick = <T>(arr: readonly T[]): T => arr[Math.floor(rnd() * arr.length)];
  const rows: Row[] = [];
  const now = new Date("2026-05-28T00:00:00Z").getTime();
  const day = 86400000;
  const handles = [
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
  const domains = [
    "gmail.com",
    "fastmail.com",
    "proton.me",
    "outlook.com",
    "hey.com",
  ];
  for (let i = 0; i < n; i++) {
    const category = pick(ENUMS.category);
    const product = pick(PRODUCTS[category]);
    const status = pick(ENUMS.status);
    const created =
      now - Math.floor(rnd() * 420) * day - Math.floor(rnd() * day);
    const shipDelay =
      status === "pending" || status === "cancelled"
        ? null
        : Math.floor(rnd() * 6 + 1) * day;
    const qty = 1 + Math.floor(rnd() * rnd() * 6);
    const unit = +(8 + rnd() * rnd() * 740).toFixed(2);
    rows.push({
      order_id: "ORD-" + (104832 + i),
      customer:
        pick(handles) + (Math.floor(rnd() * 89) + 10) + "@" + pick(domains),
      category,
      product,
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

export const DATASET: Row[] = buildDataset();
