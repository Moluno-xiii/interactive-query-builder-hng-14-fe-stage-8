# Interactive Query Builder

A visual query builder built with Next.js. Compose complex, nested database queries through a graphical interface instead of writing raw syntax, preview the generated SQL live, and run simulated queries against sample datasets.

## Features

**Rule builder**

- Every condition has a field selector, an operator selector, and a value input.
- 20 operators: equals, not equals, greater than, less than (with or-equal variants), between, contains, starts with, ends with, matches regex, in, not in, before, after, on, plus boolean and null checks (is true, is false, is null, is not null).
- Operators are filtered to those valid for the selected field type.
- Inputs adapt to the field type: text, number, enum dropdown, multi-select for in/not in, date pickers, and value-less toggles for boolean and null checks.

**Nested logic**

- AND/OR groups with unlimited nesting depth.
- Add, remove, and duplicate rules and groups.
- Collapsible groups, plus collapse and expand all.
- Drag and drop to reorder conditions and groups, including moving them between groups.

**Schema driven**

- Three data sources (Orders, Users, Events), each with its own fields and generated sample rows.
- Switch the active data source at any time, which starts a fresh query.

**Validation**

- Live validation with inline messages per rule and a header banner counting unresolved issues.

**Preview and results**

- Live SQL preview with syntax highlighting and one-click copy.
- Simulated execution with a sortable, paginated results table and row count.

**Save, history, and sharing**

- Save named presets.
- Query history of recent runs, with load, delete, and clear.
- Import and export the whole query as JSON.
- Builder state, presets, and history persist in localStorage across reloads.

**Interface**

- Light and dark theme toggle.
- Responsive layout: panes stack on small screens, and the toolbar actions (data source, history, presets, import/export, theme, run) collapse into a mobile sidebar.
- Landing page with feature highlights and a how-it-works section.

## Keyboard shortcuts (build query route)

- `Cmd/Ctrl + Enter`: run the query.
- `Cmd/Ctrl + S`: open the presets panel to save the current query.
- `Esc`: close the open modal or the mobile sidebar.

## Architecture

### Layers

The code is organized by feature, with a hard split between UI, state, and pure logic.

```
src/
  app/                     Next App Router entry points (landing, /build-query, layout)
  components/
    landing-page/          marketing sections
    build-query/           the query builder feature
      builder/             recursive builder UI (groups, rules, value controls, drag and drop)
      panels/              preview, results, and modals (schema, import/export, presets, history)
      services/            pure, framework-free logic (one class per concern)
      query-engine.ts      composes the services into a single injected instance
      data.ts              schemas and seeded mock datasets
      types.ts             typed query models
      query-schema.ts      Zod validation for untrusted input
    ui/                    shared primitives (button, combobox, badge, icons)
  contexts/                React providers (query state/actions, theme, tour)
  hooks/                   thin context consumers and interaction hooks
  lib/                     storage, storage keys, theme, utilities
```

The query model lives in `types.ts`: a `QueryNode` is a discriminated union of `Rule` and `Group`, and a `Group` holds an array of child `QueryNode`s. That one recursive type drives rendering, SQL generation, evaluation, and validation.

### Recursive rendering strategy

The builder is a single recursive component, `ConditionGroup`. It renders a group's header, then maps its children: a `group` child renders another `<ConditionGroup>` with `depth + 1`, and a `rule` child renders a `<RuleRow>`. Nesting has no fixed limit; it is bounded only by the data. Depth is passed down purely for styling (the colored rails and combinator hue key off `data-depth`, capped at 4 so the palette cycles).

The recursion is mirrored on the logic side: `tree-service` walks and locates nodes recursively, `sql-service` builds nested parenthesized clauses recursively, and `evaluation-service` evaluates a group by recursively combining its children under AND/OR. The same shape is traversed the same way everywhere.

### State management

A single provider, `QueryBuilderProvider`, owns all builder state (tree, active schema, presets, history, run state, results, sort, page, open modal) and exposes it through two separate contexts:

- `QueryStateContext` for reads
- `QueryActionsContext` for actions (`dispatch`, `run`, `setModal`, ...)

Splitting them means a component that only triggers actions does not re-subscribe to state, and the read/write surfaces stay small and explicit. Components reach them via `useQueryState` and `useQueryActions`.

Every tree edit goes through a reducer-style entry point: `dispatch(action)` calls `queryEngine.tree.applyAction(tree, action, schema)`, which clones the tree, locates the target node, applies the change, and returns a new tree. Updates are immutable, so React sees a fresh reference. Each node carries a unique `id` minted by the tree service and regenerated on duplicate and import, which keeps React keys and drag-and-drop stable. State persists to `localStorage` (keys centralized in `lib/storage-keys.ts`) and is validated with Zod on hydration, so corrupt or stale storage falls back gracefully instead of crashing.

### Query model: nested tree, not a normalized store

The brief calls for a "normalized query tree." This app deliberately uses a nested recursive tree instead: a `Group` holds its children inline (`children: QueryNode[]`), rather than a flat map of nodes keyed by id with parents pointing at children by reference.

The reasons:

- The tree mirrors the UI one to one. `ConditionGroup` recurses over the same shape that SQL generation, evaluation, and validation traverse, so there is a single mental model from data to pixels.
- Immutable edits stay simple. `applyAction` clones the tree, locates the target, mutates the copy, and returns it; subtree operations (move, duplicate, remove) are plain array splices on the located parent.
- The usual payoff of normalization, stable addressable identity, is already covered: every node carries a unique `id`, so React keys, drag-and-drop, and lookups stay stable without flattening the structure.

The cost is that `locate` is an O(n) recursive walk rather than an O(1) map lookup, and each edit clones the whole tree. For realistic queries (tens to low hundreds of nodes) that is negligible next to React's render work, and it keeps the code obvious. If a query ever grew to thousands of nodes, an `id`-to-node index could be layered alongside the tree for O(1) access without changing its shape or the components that render it.

### Query engine

`query-engine.ts` is a small composition root: one `QueryEngine` instance wires six single-responsibility services together with constructor injection, exported as a singleton.

- `TreeService`: immutable tree operations (add, remove, duplicate, move, collapse, patch), recursive locate and walk, id minting, and a drag-and-drop move with an ancestor guard that refuses to drop a group into its own descendant.
- `SqlService`: turns a tree into both a flat SQL string and structured, highlightable lines; string values are quote-escaped to keep generated SQL safe.
- `EvaluationService`: compiles a tree into a predicate and filters the dataset (the simulated execution).
- `ValidationService`: semantic validation (operator/field compatibility, range and date order, regex compile, empty groups) producing a node-keyed error map.
- `FormatService`: cell and value formatting for the results grid.
- `PresetService`: preset serialization.

Each service is a plain class with no React or DOM dependency, which is why they are unit-tested directly. `query-schema.ts` (Zod) sits in front of the untrusted boundaries (imported JSON and persisted state) and does structural validation only, keeping it separate from the semantic rules in `ValidationService`.

### Performance

- The React Compiler is enabled (`reactCompiler: true`), so components and derived values are auto-memoized without hand-written `useMemo`/`useCallback`.
- Read and write contexts are split to keep re-render scope tight.
- Derived data (error map, completed-filter count, collapse state, sorted results) is computed from the tree on render rather than stored, keeping one source of truth and avoiding sync bugs.
- Every node uses its stable `id` as its React key, so reordering and nesting reconcile cleanly.
- `useSyncExternalStore` gates the first client render to avoid hydration mismatch with `localStorage`-backed state.

### Trade-offs

- Custom drag-and-drop over a library: native HTML5 DnD with a custom drop-line keeps dependencies down and gives full control over the nesting UX, at the cost of more manual edge handling.
- SQL-only preview: the spec allows SQL or Mongo or GraphQL, so the preview targets one format well rather than three partially.
- Context plus a reducer-style service instead of Redux or Zustand: no extra state library for a single-feature surface, and the React Compiler covers memoization.
- Seeded in-memory data: execution runs against deterministically generated rows (a seeded PRNG) instead of a backend, so the app stays front-end-only and reproducible across reloads.
- Zod only at the edges: structural validation guards imports and storage, while semantic validation stays in `ValidationService`, keeping the two concerns separate.

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI, and cmdk. Tested with Vitest and Testing Library.

## Getting started

Clone the repository:

```bash
git clone https://github.com/Moluno-xiii/interactive-query-builder-hng-14-fe-stage-8.git
```

Then install dependencies and start the dev server:

```bash
cd interactive-query-builder-hng-14-fe-stage-8
pnpm install
pnpm dev
```

Open http://localhost:3000, then go to `/build-query`.

## Scripts

- `pnpm dev`: start the dev server.
- `pnpm build`: create a production build.
- `pnpm start`: serve the production build.
- `pnpm lint`: run ESLint.
- `pnpm test`: run the test suite.

---

Built for the HNG 14 Frontend Stage 8 task.
