import type { Metadata } from "next";
import { getAdminCoupons } from "@/lib/admin-data";
import { CouponManager } from "@/components/admin/coupon-manager";

export const metadata: Metadata = { title: "Coupons", robots: { index: false } };

export default async function AdminCouponsPage() {
  const coupons = await getAdminCoupons();
  return <CouponManager coupons={coupons} />;
}
