import { cn } from "@/lib/utils";

const DropLine = ({ edge }: { edge: "before" | "after" }) => {
  return (
    <span
      className={cn(
        "pointer-events-none absolute inset-x-1.5 z-5 h-[2.5px] rounded-full bg-accent shadow-[0_0_0_1px_var(--bg),0_0_8px_var(--accent)] before:absolute before:-left-1 before:top-1/2 before:h-1.75 before:w-1.75 before:-translate-y-1/2 before:rounded-full before:bg-accent before:content-['']",
        edge === "before" ? "-top-0.75" : "-bottom-0.75",
      )}
    />
  );
};

export default DropLine;
