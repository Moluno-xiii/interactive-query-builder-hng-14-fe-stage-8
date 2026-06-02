import { useContext } from "react";
import {
  QueryActionsContext,
  type QueryActions,
} from "@/contexts/QueryActionsContext";

const useQueryActions = (): QueryActions => {
  const ctx = useContext(QueryActionsContext);
  if (!ctx)
    throw new Error(
      "useQueryActions must be used within a QueryBuilderProvider",
    );
  return ctx;
};

export default useQueryActions;
