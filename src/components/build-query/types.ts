export type FieldType =
  | "id"
  | "string"
  | "number"
  | "enum"
  | "date"
  | "boolean";

export type EnumKey =
  | "status"
  | "region"
  | "category"
  | "payment"
  | "channel"
  | "plan"
  | "role"
  | "account_status"
  | "country"
  | "event_type"
  | "platform"
  | "severity"
  | "env";

export interface Field {
  key: string;
  label: string;
  type: FieldType;
  icon: string;
  enum?: EnumKey;
  fmt?: "currency";
}

export interface Operator {
  label: string;
  sym: string;
  arity: 0 | 1 | 2;
  multi?: boolean;
}

export interface Rule {
  id: string;
  kind: "rule";
  field: string;
  op: string;
  value: string;
  value2: string;
}

export interface Group {
  id: string;
  kind: "group";
  combinator: "AND" | "OR";
  collapsed: boolean;
  children: QueryNode[];
}

export type QueryNode = Rule | Group;

export type DataValue = string | number | boolean | null;
export type Row = Record<string, DataValue>;

export type ValidationLevel = "error" | "warn";
export type Errors = Record<string, { level: ValidationLevel; msg: string }>;

export type Edge = "before" | "after" | "inside";

export type NodePatch = Partial<
  Pick<Rule, "field" | "op" | "value" | "value2">
> &
  Partial<Pick<Group, "combinator" | "collapsed">>;

export type Action =
  | { t: "patch"; id: string; patch: NodePatch }
  | { t: "addRule"; id: string }
  | { t: "addGroup"; id: string }
  | { t: "remove"; id: string }
  | { t: "duplicate"; id: string }
  | { t: "collapseAll"; collapsed: boolean }
  | { t: "move"; dragId: string; targetId: string; edge: Edge };

export interface Located {
  node: QueryNode;
  parent: Group | null;
  index: number;
}

export interface SqlLine {
  pad: string;
  text: string;
  kind: "comment" | "paren" | "rule";
  conj?: string;
}

export interface Schema {
  id: string;
  name: string;
  label: string;
  fields: Field[];
  fieldMap: Record<string, Field>;
  rows: Row[];
}

export interface Preset {
  name: string;
  ts: number;
  schemaId: string;
  tree: Group;
}

export interface HistoryEntry {
  ts: number;
  schemaId: string;
  sql: string;
  count: number;
  tree: Group;
}
