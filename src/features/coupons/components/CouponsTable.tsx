import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/common/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/common/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/common/components/ui/select";
import { DataTable } from "@/common/components/ui/data-table";
import { Button } from "@/common/components/ui/button";
import { Input } from "@/common/components/ui/input";
import { Label } from "@/common/components/ui/label";
import { licenseService } from "@/services/license.service";
import type { CouponAdminItem } from "@/types/api.types";
import type { CouponStatusFilter } from "@/types/api.types";
import { useCallback, useEffect, useState } from "react";
import { getColumns } from "../columns";
import { toast } from "sonner";
import { Download, Plus } from "lucide-react";

const SEARCH_DEBOUNCE_MS = 300;

export function CouponsTable() {
  const [data, setData] = useState<{
    items: CouponAdminItem[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  } | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [status, setStatus] = useState<CouponStatusFilter>("all");

  const [createOpen, setCreateOpen] = useState(false);
  const [createDuration, setCreateDuration] = useState(30);
  const [createLoading, setCreateLoading] = useState(false);

  const [revokeCoupon, setRevokeCoupon] = useState<CouponAdminItem | null>(null);
  const [revokeReason, setRevokeReason] = useState("");
  const [revokeLoading, setRevokeLoading] = useState(false);

  const [reissueCoupon, setReissueCoupon] = useState<CouponAdminItem | null>(null);
  const [reissueReason, setReissueReason] = useState("");
  const [reissueLoading, setReissueLoading] = useState(false);

  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search), SEARCH_DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [search]);

  const fetchCoupons = useCallback(
    (pageNum: number, searchTerm: string, statusFilter: CouponStatusFilter) => {
      setLoading(true);
      licenseService
        .listCoupons({
          page: pageNum,
          limit: 20,
          search: searchTerm || undefined,
          status: statusFilter !== "all" ? statusFilter : undefined,
        })
        .then((res) => {
          setData(res.data);
          setError(null);
        })
        .catch((err) => {
          setError(err instanceof Error ? err.message : "Failed to load coupons");
          setData(null);
        })
        .finally(() => setLoading(false));
    },
    []
  );

  useEffect(() => {
    fetchCoupons(1, debouncedSearch, status);
  }, [debouncedSearch, status, fetchCoupons]);

  const handlePageChange = useCallback(
    (newPage: number) => {
      fetchCoupons(newPage, debouncedSearch, status);
    },
    [debouncedSearch, status, fetchCoupons]
  );

  const refresh = useCallback(() => {
    fetchCoupons(data?.page ?? 1, debouncedSearch, status);
  }, [data?.page, debouncedSearch, status, fetchCoupons]);

  const handleExportCsv = async () => {
    setExporting(true);
    try {
      const blob = await licenseService.exportCouponsCsv({
        search: debouncedSearch || undefined,
        status: status !== "all" ? status : undefined,
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `coupons-${new Date().toISOString().slice(0, 10)}.csv`;
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Coupons exported successfully");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Export failed");
    } finally {
      setExporting(false);
    }
  };

  const handleCreateCoupon = async () => {
    setCreateLoading(true);
    try {
      const res = await licenseService.createCoupon(createDuration);
      toast.success("Coupon created. Codes: " + res.data.firstCoupon.code + ", " + res.data.secondCoupon.code);
      setCreateOpen(false);
      setCreateDuration(30);
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to create coupon");
    } finally {
      setCreateLoading(false);
    }
  };

  const handleRevoke = async () => {
    if (!revokeCoupon) return;
    setRevokeLoading(true);
    try {
      await licenseService.revokeCoupon(revokeCoupon._id, revokeReason || undefined);
      toast.success("Coupon revoked");
      setRevokeCoupon(null);
      setRevokeReason("");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to revoke coupon");
    } finally {
      setRevokeLoading(false);
    }
  };

  const handleReissue = async () => {
    if (!reissueCoupon) return;
    setReissueLoading(true);
    try {
      const res = await licenseService.reissueCoupon(reissueCoupon._id, reissueReason || undefined);
      const newCode = (res.data as { newCoupon?: { code?: string } })?.newCoupon?.code;
      toast.success(newCode ? `New code: ${newCode}` : "Coupon reissued");
      setReissueCoupon(null);
      setReissueReason("");
      refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to reissue coupon");
    } finally {
      setReissueLoading(false);
    }
  };

  const columns = getColumns({
    onRevoke: (c) => setRevokeCoupon(c),
    onReissue: (c) => setReissueCoupon(c),
  });

  if (loading && !data) {
    return (
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <CardDescription>Loading...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center py-12">
            <div className="h-8 w-8 animate-spin rounded-full border-2 border-primary border-t-transparent" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="border-2 border-amber-200 dark:border-amber-800">
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <CardDescription className="text-amber-600 dark:text-amber-400">
            {error}
          </CardDescription>
        </CardHeader>
      </Card>
    );
  }

  const items = data?.items ?? [];

  return (
    <>
      <Card className="border-2 shadow-lg">
        <CardHeader>
          <CardTitle>Coupons</CardTitle>
          <CardDescription>
            {data ? `${data.total} coupon${data.total !== 1 ? "s" : ""} total` : ""}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={items}
            toolbar={
              <div className="flex flex-wrap items-center gap-2">
                <Select value={status} onValueChange={(v) => setStatus(v as CouponStatusFilter)}>
                  <SelectTrigger className="w-[140px]">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All</SelectItem>
                    <SelectItem value="valid">Valid</SelectItem>
                    <SelectItem value="redeemed">Redeemed</SelectItem>
                    <SelectItem value="revoked">Revoked</SelectItem>
                    <SelectItem value="invalid">Invalid</SelectItem>
                  </SelectContent>
                </Select>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleExportCsv}
                  disabled={exporting}
                >
                  <Download className="mr-2 h-4 w-4" />
                  {exporting ? "Exporting..." : "Export CSV"}
                </Button>
                <Button size="sm" onClick={() => setCreateOpen(true)}>
                  <Plus className="mr-2 h-4 w-4" />
                  Create Coupon
                </Button>
              </div>
            }
            filterPlaceholder="Search by code, issuer, or redeemer..."
            filterColumn="code"
            searchValue={search}
            onSearchChange={setSearch}
            serverPagination={
              data
                ? {
                    page: data.page,
                    pageCount: data.totalPages,
                    total: data.total,
                    limit: data.limit,
                    onPageChange: handlePageChange,
                  }
                : undefined
            }
          />
        </CardContent>
      </Card>

      <Dialog open={createOpen} onOpenChange={setCreateOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create Coupon</DialogTitle>
            <DialogDescription>
              Create a new coupon pair. Default duration is 30 days.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="duration">Duration (days)</Label>
              <Input
                id="duration"
                type="number"
                min={1}
                value={createDuration}
                onChange={(e) => setCreateDuration(Number(e.target.value) || 30)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleCreateCoupon} disabled={createLoading}>
              {createLoading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!revokeCoupon} onOpenChange={(o) => !o && setRevokeCoupon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Revoke Coupon</DialogTitle>
            <DialogDescription>
              Revoke coupon {revokeCoupon?.code}. This cannot be undone. Optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="revoke-reason">Reason (optional)</Label>
              <Input
                id="revoke-reason"
                placeholder="e.g. Coupon leaked publicly"
                value={revokeReason}
                onChange={(e) => setRevokeReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setRevokeCoupon(null)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleRevoke} disabled={revokeLoading}>
              {revokeLoading ? "Revoking..." : "Revoke"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!reissueCoupon} onOpenChange={(o) => !o && setReissueCoupon(null)}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reissue Coupon</DialogTitle>
            <DialogDescription>
              Reissue a new second code for {reissueCoupon?.code}. Optionally provide a reason.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="reissue-reason">Reason (optional)</Label>
              <Input
                id="reissue-reason"
                placeholder="e.g. User lost original code"
                value={reissueReason}
                onChange={(e) => setReissueReason(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReissueCoupon(null)}>
              Cancel
            </Button>
            <Button onClick={handleReissue} disabled={reissueLoading}>
              {reissueLoading ? "Reissuing..." : "Reissue"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
