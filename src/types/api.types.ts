/**
 * API types generated from api.json (OpenAPI 3.0)
 * Request and response DTOs for all endpoints.
 */

// --- Base response wrapper ---

export type ApiStatus = "success" | "error";

export interface ApiResponse<T> {
  data: T;
  message: string;
  error: string;
  status: ApiStatus;
}

// --- Auth DTOs ---

export interface SignUpRequest {
  name: string;
  email: string;
  password: string;
  whatsapp_number: string;
  governorate?: string;
  education_administration?: string;
  subjects?: string[];
  schools?: string[];
  grades?: string[];
}

export interface SignInRequest {
  email: string;
  password: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  expires_in: number;
}

// --- User DTOs ---

export interface UserResponse {
  _id: string;
  name: string;
  email: string;
  sessionId: string;
  deletedAt?: string | null;
  updatedAt?: string | null;
  createdAt?: string | null;
}

// --- License / Coupon DTOs ---

export interface CreateCouponRequest {
  duration?: number;
}

export interface RedeemCouponRequest {
  code: string;
}

export interface RevokeCouponRequest {
  reason?: string;
}

export interface ReissueCouponRequest {
  reason?: string;
}

export interface CouponResponse {
  _id: string;
  code: string;
  issuedBy: string;
  duration: number;
  isRedeemed: boolean;
  createdAt: string;
  updatedAt: string;
  isFirstCode: boolean;
  expiresAt?: string;
  firstCouponId?: string;
  redeemedBy?: string;
  redeemedAt?: string;
}

export interface CreateCouponResponse {
  firstCoupon: CouponResponse;
  secondCoupon: CouponResponse;
}

export interface RedeemCouponResponse {
  license: string;
  expiresAt: string;
  message: string;
}

export interface CouponAdminUser {
  _id: string;
  name?: string;
  email?: string;
}

export interface CouponAdminItem {
  _id: string;
  code: string;
  duration: number;
  isRedeemed: boolean;
  isRevoked: boolean;
  isFirstCode: boolean;
  firstCouponId?: string;
  redeemedAt?: string;
  expiresAt?: string;
  revokedAt?: string;
  revokeReason?: string;
  issuedBy?: CouponAdminUser;
  redeemedBy?: CouponAdminUser;
  revokedBy?: CouponAdminUser;
}

export interface PaginatedAdminCouponsResponse {
  items: CouponAdminItem[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CouponsStatsResponse {
  totalCoupons: number;
  validCoupons: number;
  invalidCoupons: number;
  redeemedCoupons: number;
  revokedCoupons: number;
  availableCoupons: number;
  activeLicenses: number;
  expiredLicenses: number;
}

export interface ReissueCouponResponse {
  oldCoupon: CouponResponse;
  newCoupon: CouponResponse;
}

export interface DeleteCouponResponse {
  deleted: boolean;
}

// --- Query params for list endpoints ---

export type CouponStatusFilter =
  | "all"
  | "valid"
  | "invalid"
  | "redeemed"
  | "revoked";

export interface ListCouponsQueryParams {
  status?: CouponStatusFilter;
  search?: string;
  createdFrom?: string;
  createdTo?: string;
  redeemedFrom?: string;
  redeemedTo?: string;
  expiresFrom?: string;
  expiresTo?: string;
  page?: number;
  limit?: number;
}
