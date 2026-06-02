import { render } from "@testing-library/react";
import QueryBuilderProvider from "@/contexts/QueryBuilderProvider";
import BuilderPane from "@/components/build-query/BuilderPane";
import PreviewPanel from "@/components/build-query/panels/PreviewPanel";
import useQueryState from "@/hooks/useQueryState";
import type { Group, Rule } from "@/components/build-query/types";
import { storageKeys } from "@/lib/storage-keys";

export const mkRule = (id: string, over: Partial<Rule> = {}): Rule => ({
  id,
  kind: "rule",
  field: "order_id",
  op: "eq",
  value: "",
  value2: "",
  ...over,
});

export const mkGroup = (
  id: string,
  children: (Rule | Group)[],
  combinator: "AND" | "OR" = "AND",
): Group => ({ id, kind: "group", combinator, collapsed: false, children });

export const seed = (tree: Group, schemaId = "orders") => {
  localStorage.setItem(storageKeys.query.schema, JSON.stringify(schemaId));
  localStorage.setItem(storageKeys.query.tree, JSON.stringify(tree));
};

export const renderBuilder = () =>
  render(
    <QueryBuilderProvider>
      <BuilderPane />
    </QueryBuilderProvider>,
  );

const WithPreview = () => {
  const { tree, errorCount } = useQueryState();
  return (
    <>
      <BuilderPane />
      <PreviewPanel tree={tree} errorCount={errorCount} />
    </>
  );
};

export const renderWithPreview = () =>
  render(
    <QueryBuilderProvider>
      <WithPreview />
    </QueryBuilderProvider>,
  );
