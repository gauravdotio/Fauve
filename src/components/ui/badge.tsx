import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[11px] font-medium uppercase tracking-wide",
  {
    variants: {
      variant: {
        accent: "bg-accent text-paper",
        sale: "bg-error text-paper",
        new: "bg-ink text-paper",
        outline: "border border-border-strong text-ink-soft",
        success: "bg-success-soft text-success",
        warning: "bg-warning-soft text-warning",
        neutral: "bg-surface-alt text-ink-soft",
      },
    },
    defaultVariants: { variant: "neutral" },
  },
);

interface BadgeProps extends VariantProps<typeof badgeVariants> {
  children: React.ReactNode;
  className?: string;
}

export function Badge({ variant, children, className }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)}>{children}</span>;
}
