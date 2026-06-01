import Link from "next/link";
import { Code, Home, Play } from "lucide-react";
import AppButton from "@/components/ui/app-button";
import { Badge } from "@/components/ui/badge";

const NotFound = () => {
  return (
    <main className="flex min-h-dvh flex-col items-center justify-center gap-8 bg-background px-5 py-16 text-center text-foreground">
      <div className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-surface text-left shadow-lg">
        <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-or/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="ml-2 inline-flex items-center gap-1.5 text-[11px] text-faint">
            <Code size={12} /> query result
          </span>
          <Badge variant="destructive" className="ml-auto font-jetbrains-mono">
            404
          </Badge>
        </div>
        <pre className="overflow-x-auto px-5 py-4 font-jetbrains-mono text-[12.5px] leading-[1.85]">
          <div>
            <span className="font-semibold text-and">SELECT</span>{" "}
            <span className="text-muted-foreground">*</span>{" "}
            <span className="font-semibold text-and">FROM</span>{" "}
            <span className="font-semibold text-accent">pages</span>
          </div>
          <div>
            <span className="font-semibold text-and">WHERE</span> path{" "}
            <span className="text-muted-foreground">=</span>{" "}
            <span className="text-accent">&apos;the_one_you_wanted&apos;</span>;
          </div>
          <div className="text-faint">{"-- 0 rows returned"}</div>
        </pre>
      </div>

      <div className="max-w-md">
        <h1 className="font-chakra-petch text-4xl font-bold tracking-tight sm:text-5xl">
          No rows matched.
        </h1>
        <p className="mt-3 text-[15px] leading-relaxed text-muted-foreground">
          This page didn&apos;t satisfy a single{" "}
          <span className="font-jetbrains-mono text-accent">WHERE</span> clause
          we know about; either it never existed, or someone{" "}
          <span className="font-jetbrains-mono text-or">DROP</span>ped it.
          Loosen a condition and head back.
        </p>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-3">
        <AppButton
          asChild
          className="h-11 gap-2 px-6 text-[14px] font-semibold shadow-md"
        >
          <Link href="/" replace>
            <Home size={16} />
            Back home
          </Link>
        </AppButton>
        <AppButton
          asChild
          variant="secondary"
          className="h-11 gap-2 px-6 text-[14px] font-semibold"
        >
          <Link href="/build-query" replace>
            <Play size={15} />
            Open the builder
          </Link>
        </AppButton>
      </div>
    </main>
  );
};

export default NotFound;
