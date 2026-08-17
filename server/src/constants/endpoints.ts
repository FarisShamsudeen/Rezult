export const ENDPOINTS = {
    API_BASE: '/api',
    HEALTH: '/health',
    AUTH: {
        BASE: '/auth',
        SIGNUP: '/signup',
        VERIFY_OTP: '/verify-otp',
        RESEND_OTP: '/resend-otp',
        LOGIN: '/login',
        GOOGLE: '/google',
        FORGOT_PASSWORD: '/forgot-password',
        RESET_PASSWORD: '/reset-password',
        REFRESH_TOKEN: '/refresh-token',
        LOGOUT: '/logout',
        ME: '/me',
    },
    CANDIDATES: {
        BASE: '/candidates',
        ROOT: '/',
        STATS: '/stats',
        TOGGLE_STATUS: '/:id/toggle-status',
    },
    REZULTERS: {
        BASE: '/rezulters',
        ROOT: '/',
        REGISTER: '/register',
        STATS: '/stats',
        TOGGLE_STATUS: '/:id/toggle-status',
    },
    TEST: {
        BASE: '/test',
        PROTECTED: '/protected',
        REZULTER_ONLY: '/rezulter-only',
    }
} as const;
