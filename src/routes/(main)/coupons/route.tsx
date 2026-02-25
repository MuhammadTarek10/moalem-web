import { CouponsPage } from "@/features/coupons/pages/CouponsPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/coupons")({
  component: CouponsPage,
});
