"use client";

import { useEffect, useRef } from "react";

const HeroGrid = () => {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    const section = root?.parentElement;
    if (!root || !section) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;

    const onMove = (e: PointerEvent) => {
      const r = root.getBoundingClientRect();
      root.style.setProperty("--mx", `${e.clientX - r.left}px`);
      root.style.setProperty("--my", `${e.clientY - r.top}px`);
      root.style.setProperty("--glow-op", "1");
    };
    const onLeave = () => root.style.setProperty("--glow-op", "0");

    section.addEventListener("pointermove", onMove);
    section.addEventListener("pointerleave", onLeave);
    return () => {
      section.removeEventListener("pointermove", onMove);
      section.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div ref={rootRef} aria-hidden className="pointer-events-none absolute inset-0">
      <div className="qf-hero-grid absolute inset-0 opacity-60" />
      <div className="qf-hero-glow absolute inset-0" />
    </div>
  );
};

export default HeroGrid;
