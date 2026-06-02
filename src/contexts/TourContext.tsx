"use client";

import { createContext, useEffect, useState, type ReactNode } from "react";
import localStorageStore from "@/lib/local-storage";
import { storageKeys } from "@/lib/storage-keys";
import { TOUR_STEPS } from "@/components/build-query/tour-steps";

interface TourContextValue {
  active: boolean;
  step: number;
  total: number;
  start: () => void;
  close: () => void;
  next: () => void;
  prev: () => void;
}

const TOTAL = TOUR_STEPS.length;

const TourContext = createContext<TourContextValue | null>(null);

const TourProvider = ({ children }: { children: ReactNode }) => {
  const [active, setActive] = useState(false);
  const [step, setStep] = useState(0);

  const start = () => {
    localStorageStore.set(storageKeys.tour.seen, true);
    setStep(0);
    setActive(true);
  };
  const close = () => setActive(false);
  const next = () =>
    setStep((s) => {
      if (s >= TOTAL - 1) {
        setActive(false);
        return s;
      }
      return s + 1;
    });
  const prev = () => setStep((s) => Math.max(0, s - 1));

  useEffect(() => {
    if (localStorageStore.get<boolean>(storageKeys.tour.seen)) return;
    const id = window.setTimeout(() => {
      localStorageStore.set(storageKeys.tour.seen, true);
      setStep(0);
      setActive(true);
    }, 500);
    return () => window.clearTimeout(id);
  }, []);

  return (
    <TourContext.Provider
      value={{ active, step, total: TOTAL, start, close, next, prev }}
    >
      {children}
    </TourContext.Provider>
  );
};

export { TourContext };
export type { TourContextValue };
export default TourProvider;
