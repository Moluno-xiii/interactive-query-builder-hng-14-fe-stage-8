import { DatabaseZap } from "lucide-react";
import Link from "next/link";

const AppIcon = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <span className="grid h-[24px] w-[24px] place-items-center rounded-[7px] bg-[linear-gradient(150deg,var(--accent),color-mix(in_oklch,var(--accent)_62%,var(--and)))] text-accent-foreground shadow-[0_2px_10px_-2px_var(--accent-dim),inset_0_1px_0_rgba(255,255,255,0.25)]">
        <DatabaseZap size={14} />
      </span>
      <span className="font-chakra-petch text-[14px] font-bold tracking-[0.3px]">QueryForge</span>
    </Link>
  );
};

export default AppIcon;
