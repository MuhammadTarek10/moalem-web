/**
 * Re-export API types. Prefer importing from @/types for new code.
 */
export type {
  ApiResponse,
  ApiStatus,
  TokenResponse,
  SignUpRequest,
  SignInRequest,
  UserResponse,
  CreateCouponRequest,
  RedeemCouponRequest,
  RevokeCouponRequest,
  ReissueCouponRequest,
  CouponResponse,
  CreateCouponResponse,
  RedeemCouponResponse,
  CouponAdminUser,
  CouponAdminItem,
  PaginatedAdminCouponsResponse,
  CouponsStatsResponse,
  ReissueCouponResponse,
  DeleteCouponResponse,
  CouponStatusFilter,
  ListCouponsQueryParams,
} from "@/types/api.types";
