import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/common/components/ui/sidebar";
import { createFileRoute, Link, Outlet, redirect, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, Ticket, Users, User } from "lucide-react";

export const Route = createFileRoute("/(main)")({
  component: RouteComponent,
  beforeLoad: async ({ context }) => {
    if (!context.auth.user) {
      throw redirect({ to: "/sign-in" });
    }
  },
});

const navItems = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/coupons", label: "Coupons", icon: Ticket },
  { to: "/users", label: "Users", icon: Users },
  { to: "/profile", label: "Profile", icon: User },
] as const;

function RouteComponent() {
  const { location } = useRouterState();
  const pathname = location.pathname;

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <Link
            to="/dashboard"
            className="flex items-center gap-2 px-2 py-2 text-lg font-semibold">
            Mr. Assistant
          </Link>
        </SidebarHeader>
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Pages</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {navItems.map(({ to, label, icon: Icon }) => (
                  <SidebarMenuItem key={to}>
                    <SidebarMenuButton asChild isActive={pathname === to || (to !== "/dashboard" && pathname.startsWith(to))}>
                      <Link to={to}>
                        <Icon className="size-4" />
                        <span>{label}</span>
                        {to === "/users" && (
                          <span className="ml-auto text-xs text-muted-foreground">Soon</span>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
      </Sidebar>
      <SidebarInset>
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60 px-4">
          <SidebarTrigger />
        </header>
        <Outlet />
      </SidebarInset>
    </SidebarProvider>
  );
}
