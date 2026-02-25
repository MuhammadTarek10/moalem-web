"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown, MoreHorizontal, RotateCcw, Ban } from "lucide-react";

import { Badge } from "@/common/components/ui/badge";
import { Button } from "@/common/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/common/components/ui/dropdown-menu";
import type { CouponAdminItem } from "@/types/api.types";
import { format, parseISO } from "date-fns";

function formatDate(iso?: string): string {
  if (!iso) return "—";
  try {
    return format(parseISO(iso), "MMM d, yyyy");
  } catch {
    return iso;
  }
}

function UserCell({ user }: { user?: { name?: string; email?: string } }) {
  if (!user) return <span className="text-muted-foreground">—</span>;
  return (
    <div className="flex flex-col">
      <span className="font-medium">{user.name || "—"}</span>
      {user.email && (
        <span className="text-xs text-muted-foreground">{user.email}</span>
      )}
    </div>
  );
}

function StatusBadge({ item }: { item: CouponAdminItem }) {
  if (item.isRevoked) {
    return (
      <Badge variant="secondary" className="border-amber-500/50 bg-amber-50 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200">
        Revoked
      </Badge>
    );
  }
  if (item.isRedeemed) {
    return (
      <Badge variant="secondary" className="border-emerald-500/50 bg-emerald-50 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200">
        Redeemed
      </Badge>
    );
  }
  return (
    <Badge variant="secondary" className="border-green-500/50 bg-green-50 text-green-800 dark:bg-green-950/50 dark:text-green-200">
      Valid
    </Badge>
  );
}

export interface CouponColumnsOptions {
  onRevoke?: (coupon: CouponAdminItem) => void;
  onReissue?: (coupon: CouponAdminItem) => void;
}

export function getColumns(
  options?: CouponColumnsOptions
): ColumnDef<CouponAdminItem>[] {
  const { onRevoke, onReissue } = options ?? {};

  return [
    {
      accessorKey: "code",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Code
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="font-mono font-medium">{row.getValue("code")}</span>
      ),
    },
    {
      accessorKey: "duration",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Duration
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => `${row.getValue("duration")} days`,
    },
    {
      accessorKey: "isRedeemed",
      header: "Status",
      cell: ({ row }) => <StatusBadge item={row.original} />,
    },
    {
      accessorKey: "issuedBy",
      header: "Issued By",
      cell: ({ row }) => <UserCell user={row.original.issuedBy} />,
    },
    {
      accessorKey: "redeemedBy",
      header: "Redeemed By",
      cell: ({ row }) => <UserCell user={row.original.redeemedBy} />,
    },
    {
      accessorKey: "redeemedAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Redeemed At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.original.redeemedAt)}
        </span>
      ),
    },
    {
      accessorKey: "expiresAt",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="-ml-3"
        >
          Expires At
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => (
        <span className="text-muted-foreground">
          {formatDate(row.original.expiresAt)}
        </span>
      ),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const coupon = row.original;
        const canRevoke = !coupon.isRevoked && !coupon.isRedeemed;
        const canReissue = !coupon.isRevoked && !coupon.isRedeemed && coupon.isFirstCode;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(coupon.code)}
              >
                Copy coupon code
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => navigator.clipboard.writeText(coupon._id)}
              >
                Copy coupon ID
              </DropdownMenuItem>
              {(onRevoke || onReissue) && <DropdownMenuSeparator />}
              {onRevoke && canRevoke && (
                <DropdownMenuItem
                  variant="destructive"
                  onClick={() => onRevoke(coupon)}
                >
                  <Ban className="mr-2 h-4 w-4" />
                  Revoke
                </DropdownMenuItem>
              )}
              {onReissue && canReissue && (
                <DropdownMenuItem onClick={() => onReissue(coupon)}>
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reissue
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
  ];
}
