import { type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ResultsPlaceholderProps {
  icon: ReactNode;
  iconClassName: string;
  title: string;
  description: string;
}

const ResultsPlaceholder = ({
  icon,
  iconClassName,
  title,
  description,
}: ResultsPlaceholderProps) => {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-2.5 p-10 text-center">
      <div
        className={cn(
          "mb-1 grid size-13 place-items-center rounded-[14px]",
          iconClassName,
        )}
      >
        {icon}
      </div>
      <div className="text-[15px] font-semibold">{title}</div>
      <div className="max-w-80 font-jetbrains-mono text-[12px] leading-[1.6] text-faint">
        {description}
      </div>
    </div>
  );
};

export default ResultsPlaceholder;
