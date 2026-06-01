import { ChevronRight } from "lucide-react";
import Link from "next/link";

const CTASection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center">
      <h2 className="font-chakra-petch text-3xl font-bold tracking-tight sm:text-4xl">Ready to forge a query?</h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
        Jump straight into the builder — it loads with a sample nested query you can take apart.
      </p>
      <Link
        href="/build-query"
        className="mt-8 inline-flex h-11 items-center gap-2 rounded-md bg-accent px-6 text-[14px] font-semibold text-accent-foreground shadow-md transition hover:bg-accent-hover"
      >
        Open the builder
        <ChevronRight size={16} />
      </Link>
    </section>
  );
};

export default CTASection;
