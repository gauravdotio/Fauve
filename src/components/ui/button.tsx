import { forwardRef } from "react";
import type { ButtonHTMLAttributes } from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const baseButtonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium tracking-tight transition-all duration-200 ease-out disabled:pointer-events-none disabled:opacity-40 cursor-pointer disabled:cursor-not-allowed",
  {
    variants: {
      variant: {
        primary: "bg-ink text-paper hover:bg-accent-dark active:scale-[0.98]",
        secondary:
          "bg-surface text-ink border border-border-strong hover:border-ink hover:bg-surface-alt active:scale-[0.98]",
        outline: "border border-ink text-ink hover:bg-ink hover:text-paper active:scale-[0.98]",
        ghost: "text-ink hover:bg-surface-alt active:scale-[0.98]",
        link: "text-ink underline underline-offset-4 decoration-border-strong hover:decoration-ink px-0",
        accent: "bg-accent text-paper hover:bg-accent-dark active:scale-[0.98]",
      },
      size: {
        sm: "h-9 px-4 text-xs",
        md: "h-11 px-6 text-sm",
        lg: "h-12 px-8 text-sm",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "md",
    },
  },
);

/** cva only concatenates, so overrides like `text-ink` must go through tailwind-merge to beat variant classes. */
export function buttonVariants({
  className,
  ...props
}: VariantProps<typeof baseButtonVariants> & { className?: string } = {}) {
  return cn(baseButtonVariants(props), className);
}

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof baseButtonVariants> {}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button ref={ref} className={buttonVariants({ variant, size, className })} {...props} />;
  },
);
Button.displayName = "Button";
