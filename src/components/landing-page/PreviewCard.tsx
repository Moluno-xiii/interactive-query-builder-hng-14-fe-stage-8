import { PiCode } from "react-icons/pi";
import { Badge } from "@/components/ui/badge";

const PreviewCard = () => {
  return (
    <div className="mx-auto mt-14 max-w-3xl text-left">
      <div className="overflow-hidden rounded-xl border border-border bg-surface shadow-lg">
        <div className="flex items-center gap-2 border-b border-border-soft bg-surface-2 px-4 py-2.5">
          <span className="h-2.5 w-2.5 rounded-full bg-danger/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-or/70" />
          <span className="h-2.5 w-2.5 rounded-full bg-accent/70" />
          <span className="ml-2 inline-flex items-center gap-1.5 text-[11px] text-faint">
            <PiCode size={15} /> generated query
          </span>
          <Badge
            variant={"outline"}
            className="ml-auto border-accent bg-accent/20 text-accent"
          >
            live
          </Badge>
        </div>
        <pre className="overflow-x-auto px-5 py-4 font-jetbrains-mono text-[12.5px] leading-[1.85]">
          <div>
            <span className="font-semibold text-and">SELECT</span>{" "}
            <span className="text-muted-foreground">*</span>{" "}
            <span className="font-semibold text-and">FROM</span>{" "}
            <span className="font-semibold text-accent">orders</span>
          </div>
          <div>
            <span className="font-semibold text-and">WHERE</span>
          </div>
          <div className="pl-4">
            status <span className="text-muted-foreground">IN</span>{" "}
            <span className="text-accent">
              (&apos;paid&apos;, &apos;shipped&apos;)
            </span>{" "}
            <span className="font-bold text-and">AND</span>
          </div>
          <div className="pl-4">
            amount_usd <span className="text-muted-foreground">&gt;=</span>{" "}
            <span className="text-or">120</span>{" "}
            <span className="font-bold text-and">AND</span>
          </div>
          <div className="pl-4">
            <span className="text-muted-foreground">(</span>
          </div>
          <div className="pl-8">
            region <span className="text-muted-foreground">=</span>{" "}
            <span className="text-accent">&apos;North America&apos;</span>{" "}
            <span className="font-bold text-or">OR</span>
          </div>
          <div className="pl-8">
            region <span className="text-muted-foreground">=</span>{" "}
            <span className="text-accent">&apos;Europe&apos;</span>
          </div>
          <div className="pl-4">
            <span className="text-muted-foreground">)</span>;
            <span className="ml-0.75 inline-block h-3.75 w-1.75 bg-accent align-text-bottom opacity-80 animate-blink" />
          </div>
        </pre>
      </div>
    </div>
  );
};

export default PreviewCard;
