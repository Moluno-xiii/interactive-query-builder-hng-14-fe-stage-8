import { useContext } from "react";
import {
  QueryStateContext,
  type QueryState,
} from "@/contexts/QueryStateContext";

const useQueryState = (): QueryState => {
  const ctx = useContext(QueryStateContext);
  if (!ctx)
    throw new Error("useQueryState must be used within a QueryBuilderProvider");
  return ctx;
};

export default useQueryState;
