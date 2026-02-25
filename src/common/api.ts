export const API_URL = import.meta.env.VITE_API_URL;
export const API_VERSION = import.meta.env.VITE_API_VERSION;

const base = (path: string) => `${API_URL}/api/${API_VERSION}${path}`;

export const APIS = {
    AUTH: {
        SIGN_IN: base('/auth/sign-in'),
        SIGN_UP: base('/auth/sign-up'),
        REFRESH: base('/auth/refresh'),
        SIGN_OUT: base('/auth/sign-out'),
    },

    USERS: {
        PROFILE: base('/users/profile'),
    },

    LICENSE: {
        CREATE_COUPON: base('/license/create-coupon'),
        REDEEM_COUPON: base('/license/redeem-coupon'),
    },

    LICENSE_ADMIN: {
        COUPONS: base('/license/admin/coupons'),
        COUPONS_REDEEMED: base('/license/admin/coupons/redeemed'),
        COUPONS_STATS: base('/license/admin/coupons/stats'),
        COUPONS_EXPORT_CSV: base('/license/admin/coupons/export/csv'),
        COUPONS_STATS_EXPORT_CSV: base('/license/admin/coupons/stats/export/csv'),
        COUPON_REVOKE: (couponId: string) => base(`/license/admin/coupons/${couponId}/revoke`),
        COUPON_REISSUE: (couponId: string) => base(`/license/admin/coupons/${couponId}/reissue`),
        COUPON_DELETE: (couponId: string) => base(`/license/admin/coupons/${couponId}`),
    },
};