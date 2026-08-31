import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  size?: "sm" | "md";
  className?: string;
}

export function Rating({ value, count, size = "sm", className }: RatingProps) {
  const starSize = size === "sm" ? 13 : 16;

  return (
    <div className={cn("inline-flex items-center gap-1.5", className)}>
      <div className="flex items-center gap-0.5" role="img" aria-label={`Rated ${value.toFixed(1)} out of 5`}>
        {Array.from({ length: 5 }).map((_, i) => {
          const filled = i + 1 <= Math.round(value);
          return (
            <Star
              key={i}
              size={starSize}
              className={filled ? "fill-accent text-accent" : "fill-transparent text-border-strong"}
              strokeWidth={1.5}
            />
          );
        })}
      </div>
      {typeof count === "number" && (
        <span className="text-xs text-ink-soft">({count.toLocaleString()})</span>
      )}
    </div>
  );
}
