import rateLimit from 'express-rate-limit';

// Global Rate Limiter: Applies to all endpoints to prevent general abuse
export const globalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 100, // Limit each IP to 100 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7', // draft-6: `RateLimit-*` headers; draft-7: combined `RateLimit` header
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
    message: {
        success: false,
        error: 'Too many requests from this IP, please try again after 15 minutes'
    }
});

// Auth Rate Limiter: Stricter limit for authentication routes to prevent brute-force
export const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 10, // Limit each IP to 10 requests per `window` (here, per 15 minutes)
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many authentication attempts from this IP, please try again after 15 minutes'
    }
});

// Resend OTP Rate Limiter: Specific limit for OTP requests
export const otpLimiter = rateLimit({
    windowMs: 5 * 60 * 1000, // 5 minutes
    limit: 3, // Limit each IP to 3 OTP requests per 5 minutes
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: {
        success: false,
        error: 'Too many OTP requests from this IP, please try again after 5 minutes'
    }
});
