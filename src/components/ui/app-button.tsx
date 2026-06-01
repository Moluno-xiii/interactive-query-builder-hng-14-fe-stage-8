import type { ComponentProps } from "react";
import type { VariantProps } from "class-variance-authority";
import { Button, buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type ButtonVariant = NonNullable<
  VariantProps<typeof buttonVariants>["variant"]
>;

const variantColors: Record<ButtonVariant, string> = {
  default: "bg-accent text-accent-foreground shadow-sm hover:bg-accent-hover",
  secondary:
    "border-border bg-surface-2 text-foreground hover:border-border-strong hover:bg-surface-3",
  outline:
    "border-border bg-transparent text-foreground hover:border-border-strong hover:bg-surface-2",
  ghost: "text-muted-foreground hover:bg-surface-2 hover:text-foreground",
  destructive: "bg-danger-dim text-danger hover:bg-danger/20",
  link: "text-accent underline-offset-4 hover:underline",
};

type AppButtonProps = ComponentProps<typeof Button>;

const AppButton = ({ variant, className, ...props }: AppButtonProps) => {
  const resolved = variant ?? "default";
  return (
    <Button
      variant={resolved}
      className={cn(variantColors[resolved], className)}
      {...props}
    />
  );
};

export default AppButton;
export type { AppButtonProps };
