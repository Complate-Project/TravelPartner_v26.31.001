/**
 * Password reset controller — handles forgot-password, verify-otp, resend-otp,
 * and reset-password requests.
 *
 * All responses are generic to prevent account enumeration.
 * OTP values are never logged or returned to the frontend.
 */

const { normalizePhone } = require('../services/smsService');
const passwordResetService = require('../services/passwordResetService');

const GENERIC_SUCCESS = 'If an account with that phone number exists, an OTP has been sent.';

exports.forgotPassword = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required.' });
        }

        const normalized = normalizePhone(phone);
        await passwordResetService.requestOTP(normalized);

        // Always return the same response
        res.json({ success: true, message: GENERIC_SUCCESS });
    } catch (err) {
        console.error('[password-reset] forgotPassword error:', err.message);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
};

exports.verifyOtp = async (req, res) => {
    try {
        const { phone, otp } = req.body;
        if (!phone || !otp) {
            return res.status(400).json({ error: 'Phone number and OTP are required.' });
        }

        const normalized = normalizePhone(phone);
        const result = await passwordResetService.verifyOTP(normalized, String(otp).trim());

        if (!result.valid) {
            return res.status(400).json({ error: result.error });
        }

        res.json({
            success: true,
            resetToken: result.resetToken,
            message: 'OTP verified. You can now set a new password.',
        });
    } catch (err) {
        console.error('[password-reset] verifyOtp error:', err.message);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
};

exports.resendOtp = async (req, res) => {
    try {
        const { phone } = req.body;
        if (!phone) {
            return res.status(400).json({ error: 'Phone number is required.' });
        }

        const normalized = normalizePhone(phone);

        // Check cooldown: if the latest OTP for this phone was created less than 60s ago
        const db = require('../config/db');
        const [recent] = await db.query(
            `SELECT created_at FROM password_reset_otps
             WHERE phone = ? ORDER BY id DESC LIMIT 1`,
            [normalized]
        );

        if (recent.length) {
            const ageMs = Date.now() - new Date(recent[0].created_at).getTime();
            if (ageMs < 60000) {
                return res.status(429).json({ error: 'Please wait before requesting a new code.' });
            }
        }

        await passwordResetService.requestOTP(normalized);

        res.json({ success: true, message: GENERIC_SUCCESS });
    } catch (err) {
        console.error('[password-reset] resendOtp error:', err.message);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const { resetToken, newPassword, confirmPassword } = req.body;
        if (!resetToken || !newPassword || !confirmPassword) {
            return res.status(400).json({ error: 'All fields are required.' });
        }

        const result = await passwordResetService.resetPassword(resetToken, newPassword, confirmPassword);

        if (!result.success) {
            return res.status(400).json({ error: result.error });
        }

        res.json({ success: true, message: 'Password reset successful. Please log in with your new password.' });
    } catch (err) {
        console.error('[password-reset] resetPassword error:', err.message);
        res.status(500).json({ error: 'An error occurred. Please try again.' });
    }
};
