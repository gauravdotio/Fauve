import Link from "next/link";
import type { LucideIcon } from "lucide-react";
import { PackageSearch } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
  actionHref?: string;
}

export function EmptyState({
  icon: Icon = PackageSearch,
  title,
  description,
  actionLabel,
  onAction,
  actionHref,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border-strong px-6 py-20 text-center">
      <Icon size={32} className="text-ink-faint" strokeWidth={1.25} aria-hidden />
      <div className="flex flex-col gap-1.5">
        <p className="text-base font-medium text-ink">{title}</p>
        {description && <p className="max-w-sm text-sm text-ink-soft">{description}</p>}
      </div>
      {actionLabel && actionHref && (
        <Link href={actionHref} className={buttonVariants({ variant: "secondary", size: "sm" })}>
          {actionLabel}
        </Link>
      )}
      {actionLabel && !actionHref && onAction && (
        <Button variant="secondary" size="sm" onClick={onAction}>
          {actionLabel}
        </Button>
      )}
    </div>
  );
}
