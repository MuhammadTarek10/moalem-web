import { UsersPage } from "@/features/users/pages/UsersPage";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/(main)/users")({
  component: UsersPage,
});
