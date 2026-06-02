import { PiPlay } from "react-icons/pi";
import { FaYCombinator } from "react-icons/fa";
import Link from "next/link";
import PreviewCard from "@/components/landing-page/PreviewCard";
import { Badge } from "@/components/ui/badge";
import AppButton from "@/components/ui/app-button";

const HeroSection = () => {
  return (
    <section className="relative overflow-hidden">
      <div
        className="qf-hero-grid pointer-events-none absolute inset-0 opacity-60"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-16 pt-20 text-center sm:pt-28">
        <Badge
          variant={"destructive"}
          className="mx-auto inline-flex items-center justify-center gap-1.5"
        >
          <span className="text-[8px] font-semibold lowercase tracking-wider opacity-60">
            not
          </span>
          <span className="uppercase">backed by</span>
          <FaYCombinator className="text-[#ff6600]" size={13} />
        </Badge>

        <h1 className="mx-auto mt-6 max-w-3xl font-chakra-petch text-4xl font-bold leading-[1.05] tracking-tight sm:text-6xl">
          Build complex queries <span className="text-accent">visually.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-xl text-[15px] leading-relaxed text-muted-foreground">
          QueryForge turns clicks into queries. Compose deeply nested AND / OR
          logic, watch the SQL generate in real time, and run it against a live
          dataset, no raw syntax required.
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <AppButton asChild size={"lg"}>
            <Link href="/build-query">
              <PiPlay size={15} />
              Launch the builder
            </Link>
          </AppButton>
          <AppButton asChild variant="secondary" size={"lg"}>
            <a href="#features">Explore features</a>
          </AppButton>
        </div>
        <PreviewCard />
      </div>
    </section>
  );
};

export default HeroSection;
