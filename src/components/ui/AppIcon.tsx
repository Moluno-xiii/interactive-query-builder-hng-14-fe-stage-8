import { DatabaseZap } from "lucide-react";
import Link from "next/link";

const AppIcon = () => {
  return (
    <Link href={"/"} className="flex items-center gap-2">
      <span className="grid size-9 place-items-center rounded-lg bg-accent text-accent-foreground">
        <DatabaseZap size={20} />
      </span>
      <span className="font-chakra-petch text-base font-bold tracking-[0.3px]">
        QueryForge
      </span>
    </Link>
  );
};

export default AppIcon;
