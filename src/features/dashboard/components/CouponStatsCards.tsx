import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { licenseService } from "@/services/license.service";
import type { CouponsStatsResponse } from "@/types/api.types";
import { useEffect, useState } from "react";

const statCards: Array<{
  key: keyof CouponsStatsResponse;
  label: string;
  icon: string;
  colorClass: string;
}> = [
  { key: "totalCoupons", label: "Total Coupons", icon: "📋", colorClass: "text-foreground" },
  { key: "validCoupons", label: "Valid", icon: "✓", colorClass: "text-green-600 dark:text-green-400" },
  { key: "invalidCoupons", label: "Invalid", icon: "✗", colorClass: "text-red-600 dark:text-red-400" },
  { key: "availableCoupons", label: "Available", icon: "📦", colorClass: "text-blue-600 dark:text-blue-400" },
  { key: "redeemedCoupons", label: "Redeemed", icon: "🎫", colorClass: "text-emerald-600 dark:text-emerald-400" },
  { key: "revokedCoupons", label: "Revoked", icon: "🚫", colorClass: "text-amber-600 dark:text-amber-400" },
  { key: "activeLicenses", label: "Active Licenses", icon: "🔑", colorClass: "text-primary" },
  { key: "expiredLicenses", label: "Expired Licenses", icon: "⏱", colorClass: "text-muted-foreground" },
];

export function CouponStatsCards() {
  const [stats, setStats] = useState<CouponsStatsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    licenseService
      .getCouponStats()
      .then((res) => {
        setStats(res.data);
        setError(null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load stats");
        setStats(null);
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <Card className="border-2 shadow-lg md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Coupon Statistics
          </CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-amber-200 dark:border-amber-800 md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Coupon Statistics
          </CardTitle>
          <CardDescription className="text-amber-600 dark:text-amber-400">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  return (
    <>
      <Card className="border-2 shadow-lg md:col-span-2 lg:col-span-3">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <svg
              className="h-6 w-6 text-primary"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
              />
            </svg>
            Coupon Statistics
          </CardTitle>
          <CardDescription>Overview of coupon and license metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-8">
            {statCards.map(({ key, label, icon, colorClass }) => (
              <div
                key={key}
                className="rounded-lg border bg-muted/50 p-4 transition-colors hover:bg-muted/70"
              >
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span>{icon}</span>
                  <span>{label}</span>
                </div>
                <p className={`mt-2 text-2xl font-bold ${colorClass}`}>
                  {stats?.[key] ?? 0}
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </>
  );
}
