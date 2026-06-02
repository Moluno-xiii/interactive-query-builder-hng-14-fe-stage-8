"use client";

import { useEffect, useState, type CSSProperties } from "react";
import { PiArrowLeft, PiArrowRight, PiX } from "react-icons/pi";
import { cn } from "@/lib/utils";
import AppButton from "@/components/ui/app-button";
import { TOUR_STEPS } from "@/components/build-query/tour-steps";
import useTour from "@/hooks/useTour";

const GAP = 14;
const CARD_WIDTH = 340;
const MOBILE_BP = 640;

const isVisible = (el: Element | null): el is HTMLElement =>
  !!el && (el as HTMLElement).getClientRects().length > 0;

const findTarget = (
  selector: string | null,
  fallback?: string,
): HTMLElement | null => {
  if (!selector) return null;
  const primary = document.querySelector(selector);
  if (isVisible(primary)) return primary;
  if (fallback) {
    const fb = document.querySelector(fallback);
    if (isVisible(fb)) return fb;
  }
  return null;
};

const BuilderTour = () => {
  const { active, step, total, next, prev, close } = useTour();
  const [rect, setRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    if (!active) return;
    const s = TOUR_STEPS[step];
    const el = findTarget(s.target, s.fallback);
    if (el)
      el.scrollIntoView({
        block: "center",
        inline: "center",
        behavior: "smooth",
      });

    const measure = () => {
      const t = findTarget(s.target, s.fallback);
      setRect(t ? t.getBoundingClientRect() : null);
    };
    measure();
    const interval = window.setInterval(measure, 100);
    const stop = window.setTimeout(() => window.clearInterval(interval), 650);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", measure, true);
    return () => {
      window.clearInterval(interval);
      window.clearTimeout(stop);
      window.removeEventListener("resize", measure);
      window.removeEventListener("scroll", measure, true);
    };
  }, [active, step]);

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      } else if (e.key === "ArrowRight" || e.key === "Enter") {
        e.preventDefault();
        next();
      } else if (e.key === "ArrowLeft") {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [active, next, prev, close]);

  if (!active) return null;

  const s = TOUR_STEPS[step];
  const Icon = s.icon;
  const pad = s.pad ?? 6;
  const box = rect
    ? {
        top: rect.top - pad,
        left: rect.left - pad,
        width: rect.width + pad * 2,
        height: rect.height + pad * 2,
      }
    : null;

  const vw = typeof window !== "undefined" ? window.innerWidth : 1024;
  const vh = typeof window !== "undefined" ? window.innerHeight : 768;
  const isMobile = vw < MOBILE_BP;

  let cardStyle: CSSProperties;
  if (!box) {
    cardStyle = {
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      width: "min(92vw, 380px)",
    };
  } else if (isMobile) {
    const centerY = box.top + box.height / 2;
    cardStyle =
      centerY > vh * 0.55
        ? { top: 14, left: 12, right: 12 }
        : { bottom: 14, left: 12, right: 12 };
  } else {
    const left = Math.max(
      12,
      Math.min(box.left + box.width / 2 - CARD_WIDTH / 2, vw - CARD_WIDTH - 12),
    );
    const roomBelow = vh - (box.top + box.height);
    cardStyle =
      roomBelow > 210
        ? { top: box.top + box.height + GAP, left, width: CARD_WIDTH }
        : { bottom: vh - box.top + GAP, left, width: CARD_WIDTH };
  }

  const spotlightStyle: CSSProperties = box
    ? {
        top: box.top,
        left: box.left,
        width: box.width,
        height: box.height,
        boxShadow:
          "0 0 0 9999px color-mix(in oklch, var(--bg) 58%, transparent), 0 0 0 1.5px var(--accent), 0 0 26px 4px color-mix(in oklch, var(--accent) 42%, transparent)",
      }
    : {};

  const isLast = step === total - 1;

  return (
    <div
      className="fixed inset-0 z-70"
      role="dialog"
      aria-modal="true"
      aria-label="Product tour"
    >
      <div
        className={cn(
          "absolute inset-0",
          !box &&
            "bg-[color-mix(in_oklch,var(--bg)_58%,transparent)] backdrop-blur-[2px]",
        )}
        onClick={(e) => e.stopPropagation()}
        aria-hidden
      />
      {box && (
        <div
          className="pointer-events-none absolute rounded-lg transition-all duration-300 ease-out"
          style={spotlightStyle}
          aria-hidden
        />
      )}
      <div
        className="pointer-events-auto absolute animate-pop-in rounded-xl border border-border-strong bg-surface p-4 shadow-pop"
        style={cardStyle}
      >
        <div className="flex items-start gap-3">
          <span className="grid size-8.5 shrink-0 place-items-center rounded-[10px] bg-accent-dim text-accent">
            <Icon size={18} />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="font-chakra-petch text-[15px] font-semibold tracking-[0.2px]">
              {s.title}
            </h2>
            <p className="mt-1 text-[13px] leading-[1.55] text-muted-foreground">
              {s.body}
            </p>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label="Dismiss tour"
            title="Dismiss"
            className="grid size-7 shrink-0 place-items-center rounded-md text-faint transition hover:bg-surface-2 hover:text-foreground"
          >
            <PiX size={15} />
          </button>
        </div>

        <div className="mt-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-1.5" aria-hidden>
            {TOUR_STEPS.map((_, i) => (
              <span
                key={i}
                className={cn(
                  "h-1.5 rounded-full transition-all duration-200",
                  i === step ? "w-4 bg-accent" : "w-1.5 bg-border-strong",
                )}
              />
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            {step > 0 && (
              <AppButton variant="ghost" size="sm" onClick={prev}>
                <PiArrowLeft />
                Back
              </AppButton>
            )}
            <AppButton size="sm" onClick={next}>
              {isLast ? "Done" : "Next"}
              {!isLast && <PiArrowRight />}
            </AppButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BuilderTour;
