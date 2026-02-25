import { APIS } from "@/common/api";
import { ApiService } from "./api.service";
import type {
  ApiResponse,
  CreateCouponResponse,
  CouponsStatsResponse,
  ListCouponsQueryParams,
  PaginatedAdminCouponsResponse,
} from "./types";

export class LicenseService {
  private static instance: LicenseService;
  private readonly apiService: ApiService;

  private constructor() {
    this.apiService = ApiService.getInstance();
  }

  public static getInstance(): LicenseService {
    if (!LicenseService.instance) {
      LicenseService.instance = new LicenseService();
    }
    return LicenseService.instance;
  }

  public async getCouponStats(): Promise<ApiResponse<CouponsStatsResponse>> {
    return this.apiService.get<CouponsStatsResponse>(
      APIS.LICENSE_ADMIN.COUPONS_STATS
    );
  }

  public async listCoupons(
    params?: ListCouponsQueryParams
  ): Promise<ApiResponse<PaginatedAdminCouponsResponse>> {
    const queryParams = this.buildQueryParams(params);
    return this.apiService.get<PaginatedAdminCouponsResponse>(
      APIS.LICENSE_ADMIN.COUPONS,
      queryParams
    );
  }

  public async exportCouponsCsv(
    params?: ListCouponsQueryParams
  ): Promise<Blob> {
    const queryParams = this.buildQueryParams(params);
    return this.apiService.getBlob(
      APIS.LICENSE_ADMIN.COUPONS_EXPORT_CSV,
      queryParams
    );
  }

  public async createCoupon(
    duration?: number
  ): Promise<ApiResponse<CreateCouponResponse>> {
    return this.apiService.post<CreateCouponResponse>(
      APIS.LICENSE.CREATE_COUPON,
      { duration: duration ?? 30 }
    );
  }

  public async revokeCoupon(
    couponId: string,
    reason?: string
  ): Promise<ApiResponse<unknown>> {
    return this.apiService.patch(
      APIS.LICENSE_ADMIN.COUPON_REVOKE(couponId),
      { reason }
    );
  }

  public async reissueCoupon(
    couponId: string,
    reason?: string
  ): Promise<ApiResponse<unknown>> {
    return this.apiService.post(
      APIS.LICENSE_ADMIN.COUPON_REISSUE(couponId),
      { reason }
    );
  }

  private buildQueryParams(
    params?: ListCouponsQueryParams
  ): Record<string, string> | undefined {
    if (!params) return undefined;
    return Object.fromEntries(
      Object.entries(params)
        .filter(([, v]) => v != null && v !== "")
        .map(([k, v]) => [k, String(v)])
    ) as Record<string, string>;
  }
}

export const licenseService = LicenseService.getInstance();
