"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu } from "lucide-react";
import { PiArrowBendUpRightFill } from "react-icons/pi";
import AppIcon from "@/components/ui/AppIcon";
import AppButton from "@/components/ui/app-button";
import ThemeSwitcher from "@/components/ThemeSwitcher";
import MobileNav from "@/components/landing-page/MobileNav";

const LandingPageHeader = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
        <nav className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-5">
          <AppIcon />
          <span className="ml-2 hidden text-[12px] text-faint sm:inline">
            Visual Query Builder
          </span>

          <div className="ml-auto hidden items-center gap-1 sm:flex">
            <a
              href="#features"
              className="rounded-md px-3 py-2 text-[13px] text-muted-foreground transition hover:text-foreground"
            >
              Features
            </a>
            <a
              href="#how"
              className="rounded-md px-3 py-2 text-[13px] text-muted-foreground transition hover:text-foreground"
            >
              How it works
            </a>
            <ThemeSwitcher />
            <AppButton asChild>
              <Link href="/build-query">
                Open builder
                <PiArrowBendUpRightFill size={14} />
              </Link>
            </AppButton>
          </div>

          <button
            type="button"
            onClick={() => setMenuOpen(true)}
            aria-label="Open menu"
            aria-expanded={menuOpen}
            className="ml-auto grid size-9 place-items-center rounded-md border border-border bg-surface-2 text-foreground transition hover:border-border-strong hover:bg-surface-3 sm:hidden"
          >
            <Menu size={18} />
          </button>
        </nav>
      </header>

      <MobileNav open={menuOpen} onClose={() => setMenuOpen(false)} />
    </>
  );
};

export default LandingPageHeader;
