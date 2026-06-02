"use client";

import QueryBuilderProvider from "@/contexts/QueryBuilderProvider";
import Toolbar from "@/components/build-query/Toolbar";
import BuilderPane from "@/components/build-query/BuilderPane";
import OutputPane from "@/components/build-query/OutputPane";
import QueryModals from "@/components/build-query/QueryModals";

const BuildQueryPage = () => {
  return (
    <QueryBuilderProvider>
      <div className="qf-scroll flex h-dvh flex-col overflow-hidden bg-background text-foreground transition-colors duration-300">
        <Toolbar />
        <div className="flex min-h-0 flex-1 gap-px bg-border-soft max-[940px]:flex-col max-[940px]:overflow-auto">
          <BuilderPane />
          <OutputPane />
        </div>
        <QueryModals />
      </div>
    </QueryBuilderProvider>
  );
};

export default BuildQueryPage;
