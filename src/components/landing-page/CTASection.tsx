import { PiCaretRight } from "react-icons/pi";
import Link from "next/link";
import AppButton from "@/components/ui/app-button";

const CTASection = () => {
  return (
    <section className="mx-auto max-w-6xl px-5 py-24 text-center">
      <h2 className="font-chakra-petch text-3xl font-bold tracking-tight sm:text-4xl">
        Ready to forge a query?
      </h2>
      <p className="mx-auto mt-3 max-w-md text-[15px] text-muted-foreground">
        Jump straight into the builder — it loads with a sample nested query you
        can take apart.
      </p>
      <AppButton
        asChild
        className="mt-8 h-11 gap-2 px-6 text-[14px] font-semibold shadow-md"
      >
        <Link href="/build-query">
          Open the builder
          <PiCaretRight size={16} />
        </Link>
      </AppButton>
    </section>
  );
};

export default CTASection;
