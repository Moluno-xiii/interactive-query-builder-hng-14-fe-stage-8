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

## Tech stack

Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS v4, Radix UI, and cmdk. Tested with Vitest and Testing Library.

## Getting started

```bash
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
