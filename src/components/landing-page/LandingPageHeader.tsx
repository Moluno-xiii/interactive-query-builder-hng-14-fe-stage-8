import Link from "next/link";
import AppIcon from "@/components/ui/AppIcon";
import { PiArrowBendUpRightFill } from "react-icons/pi";
import { Button } from "@/components/ui/button";
import ThemeSwitcher from "@/components/ThemeSwitcher";

const LandingPageHeader = () => {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-surface/80 backdrop-blur">
      <nav className="mx-auto flex h-14 max-w-6xl items-center gap-3 px-5">
        <AppIcon />
        <span className="ml-2 hidden text-[12px] text-faint sm:inline">
          Visual Query Builder
        </span>
        <div className="ml-auto flex items-center gap-1">
          <a
            href="#features"
            className="hidden rounded-md px-3 py-2 text-[13px] text-muted-foreground transition hover:text-foreground sm:inline-block"
          >
            Features
          </a>
          <a
            href="#how"
            className="hidden rounded-md px-3 py-2 text-[13px] text-muted-foreground transition hover:text-foreground sm:inline-block"
          >
            How it works
          </a>
          <ThemeSwitcher />
          <Link href="/build-query">
            <Button className="bg-accent cursor-pointer transitionall duration-300 hover:bg-accent-hover text-white">
              Open builder
              <PiArrowBendUpRightFill size={14} />
            </Button>
          </Link>
        </div>
      </nav>
    </header>
  );
};

export default LandingPageHeader;
