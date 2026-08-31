/**
 * Password reset routes — public (no auth required).
 *
 * Rate-limited at the route level. All responses are generic to prevent
 * account enumeration.
 */

const router = require('express').Router();
const controller = require('../controllers/passwordResetController');
const {
    forgotPasswordLimiter,
    verifyOtpLimiter,
    resendOtpLimiter,
    resetPasswordLimiter,
} = require('../config/rateLimits');

router.post('/forgot-password', forgotPasswordLimiter, controller.forgotPassword);
router.post('/verify-otp', verifyOtpLimiter, controller.verifyOtp);
router.post('/resend-otp', resendOtpLimiter, controller.resendOtp);
router.post('/reset-password', resetPasswordLimiter, controller.resetPassword);

module.exports = router;
