import { createFileRoute, Outlet, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/(auth)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (context.auth.user) {
      throw redirect({ to: "/dashboard" });
    }
  },
});

function RouteComponent() {
  return <Outlet />;
}
