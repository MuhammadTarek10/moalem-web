import { CouponStatsCards } from "@/features/dashboard/components/CouponStatsCards";
import { CouponsTable } from "@/features/coupons/components/CouponsTable";

export function CouponsPage() {
  return (
    <div className="min-h-screen bg-linear-to-br from-background via-green-50/30 to-emerald-50/30 dark:from-background dark:via-green-950/20 dark:to-emerald-950/20">
      <div className="border-b bg-white/50 dark:bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">Coupons</h1>
          <p className="mt-2 text-muted-foreground">
            Coupon statistics and status overview.
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <CouponStatsCards />
        </div>
        <CouponsTable />
      </div>
    </div>
  );
}
