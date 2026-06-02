import { useContext } from "react";
import { TourContext, type TourContextValue } from "@/contexts/TourContext";

const useTour = (): TourContextValue => {
  const ctx = useContext(TourContext);
  if (!ctx) throw new Error("useTour must be used within a TourProvider");
  return ctx;
};

export default useTour;
