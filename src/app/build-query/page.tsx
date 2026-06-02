import BuildQueryPage from "@/components/build-query/BuildQueryPage";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Build a query | QueryForge",
  description:
    "Visually construct nested AND/OR queries, preview live SQL, and run them against a sample dataset.",
};

const Page = () => {
  return <BuildQueryPage />;
};

export default Page;
