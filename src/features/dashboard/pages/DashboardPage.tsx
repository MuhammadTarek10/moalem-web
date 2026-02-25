import { Button } from "@/common/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import { getFirstName } from "@/features/profile/utils";
import { useAuth } from "@/hooks/use-auth";
import { Link } from "@tanstack/react-router";
import { Ticket, Users, User } from "lucide-react";

export function DashboardPage() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-linear-to-br from-background via-green-50/30 to-emerald-50/30 dark:from-background dark:via-green-950/20 dark:to-emerald-950/20">
      {/* Header */}
      <div className="border-b bg-white/50 dark:bg-background/50 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold text-foreground">
            Welcome back, {getFirstName(user?.name)}! 👋
          </h1>
          <p className="mt-2 text-muted-foreground">
            Here's what's happening with your account today.
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="border-2 shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Ticket className="h-6 w-6 text-primary" />
                Coupons
              </CardTitle>
              <CardDescription>View coupon statistics and status</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="default" className="w-full">
                <Link to="/coupons">View Coupons</Link>
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-6 w-6 text-primary" />
                Users
              </CardTitle>
              <CardDescription>Manage users and permissions</CardDescription>
            </CardHeader>
            <CardContent>
              <Button variant="outline" className="w-full" disabled>
                Coming soon
              </Button>
            </CardContent>
          </Card>

          <Card className="border-2 shadow-lg transition-all duration-300 hover:shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-6 w-6 text-primary" />
                Profile
              </CardTitle>
              <CardDescription>View and manage your account</CardDescription>
            </CardHeader>
            <CardContent>
              <Button asChild variant="outline" className="w-full">
                <Link to="/profile">Go to Profile</Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
