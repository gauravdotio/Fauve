import { Badge } from "@/components/ui/badge";
import { ORDER_STATUS_LABELS, ORDER_STATUS_TONE } from "@/lib/orders";

const VARIANT_MAP = { neutral: "neutral", success: "success", warning: "warning", error: "sale" } as const;

export function OrderStatusBadge({ status }: { status: string }) {
  const tone = ORDER_STATUS_TONE[status] ?? "neutral";
  return <Badge variant={VARIANT_MAP[tone]}>{ORDER_STATUS_LABELS[status] ?? status}</Badge>;
}
