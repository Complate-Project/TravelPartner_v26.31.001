/**
 * Password reset service — OTP generation, verification, and token management.
 *
 * Security properties:
 * - OTP is SHA-256 hashed before storage (never stored in plaintext)
 * - OTP expires after 10 minutes
 * - Max 5 verification attempts per OTP
 * - Single-use: consumed on successful verification
 * - Reset token is a stateless JWT with 15-minute expiry
 * - No account enumeration: callers get generic responses
 */

const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const db = require('../config/db');
const { sendOTP } = require('./smsService');

const OTP_LENGTH = 4;
const OTP_EXPIRY_MINUTES = 10;
const OTP_MAX_ATTEMPTS = 5;
const RESET_TOKEN_EXPIRY = '15m';
const BCRYPT_ROUNDS = 10;

function generateOTP() {
    return String(crypto.randomInt(1000, 10000));
}

function hashOTP(otp) {
    return crypto.createHash('sha256').update(otp).digest('hex');
}

/**
 * Request a password-reset OTP for the given phone number.
 * Always returns the same generic response regardless of whether the account exists.
 *
 * @param {string} phone - 13-digit BD phone number
 * @returns {Promise<{ sent: boolean }>}
 */
async function requestOTP(phone) {
    const [rows] = await db.query(
        `SELECT id, phone FROM users WHERE phone = ? AND role IN ('user', 'provider') AND is_active = 1 LIMIT 1`,
        [phone]
    );

    if (!rows.length) {
        // Always return success to prevent enumeration
        return { sent: true };
    }

    const user = rows[0];
    const otp = generateOTP();
    const otpHash = hashOTP(otp);
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);
    const csmsId = `rp-${user.id}-${Date.now()}`;

    // Invalidate any previous unconsumed OTPs for this phone
    await db.query(
        `UPDATE password_reset_otps SET consumed = 1 WHERE phone = ? AND consumed = 0`,
        [phone]
    );

    // Store hashed OTP
    await db.query(
        `INSERT INTO password_reset_otps (user_id, phone, otp_hash, max_attempts, expires_at)
         VALUES (?, ?, ?, ?, ?)`,
        [user.id, phone, otpHash, OTP_MAX_ATTEMPTS, expiresAt]
    );

    // Send SMS (best-effort — don't fail the request if SMS is down)
    await sendOTP(phone, otp, csmsId);

    return { sent: true };
}

/**
 * Verify an OTP and return a reset token on success.
 *
 * @param {string} phone
 * @param {string} otp - 4-digit plaintext OTP
 * @returns {Promise<{ valid: boolean, resetToken?: string, error?: string }>}
 */
async function verifyOTP(phone, otp) {
    const [rows] = await db.query(
        `SELECT id, otp_hash, attempts, max_attempts
         FROM password_reset_otps
         WHERE phone = ? AND consumed = 0 AND expires_at > NOW()
         ORDER BY id DESC LIMIT 1`,
        [phone]
    );

    if (!rows.length) {
        return { valid: false, error: 'Invalid or expired OTP. Please request a new code.' };
    }

    const record = rows[0];

    // Increment attempts
    await db.query(
        `UPDATE password_reset_otps SET attempts = attempts + 1 WHERE id = ?`,
        [record.id]
    );

    if (record.attempts + 1 > record.max_attempts) {
        await db.query(`UPDATE password_reset_otps SET consumed = 1 WHERE id = ?`, [record.id]);
        return { valid: false, error: 'Invalid or expired OTP. Please request a new code.' };
    }

    // Compare hash
    const inputHash = hashOTP(otp);
    if (inputHash !== record.otp_hash) {
        return { valid: false, error: 'Invalid or expired OTP. Please request a new code.' };
    }

    // Mark consumed
    await db.query(`UPDATE password_reset_otps SET consumed = 1 WHERE id = ?`, [record.id]);

    // Find the user_id from this OTP record
    const [otpRows] = await db.query(
        `SELECT user_id FROM password_reset_otps WHERE id = ? LIMIT 1`,
        [record.id]
    );
    const userId = otpRows[0].user_id;

    // Generate stateless reset token
    const resetToken = jwt.sign(
        { id: userId, purpose: 'password_reset' },
        process.env.JWT_SECRET,
        { expiresIn: RESET_TOKEN_EXPIRY }
    );

    return { valid: true, resetToken };
}

/**
 * Reset a user's password using a valid reset token.
 *
 * @param {string} resetToken - JWT from verifyOTP
 * @param {string} newPassword
 * @param {string} confirmPassword
 * @returns {Promise<{ success: boolean, error?: string }>}
 */
async function resetPassword(resetToken, newPassword, confirmPassword) {
    // Validate passwords
    if (!newPassword || !confirmPassword) {
        return { success: false, error: 'Both password fields are required.' };
    }
    if (newPassword !== confirmPassword) {
        return { success: false, error: 'Passwords do not match.' };
    }
    if (newPassword.length < 6) {
        return { success: false, error: 'Password must be at least 6 characters.' };
    }

    // Verify JWT
    let decoded;
    try {
        decoded = jwt.verify(resetToken, process.env.JWT_SECRET);
    } catch {
        return { success: false, error: 'Reset session expired. Please start over.' };
    }

    if (decoded.purpose !== 'password_reset') {
        return { success: false, error: 'Invalid reset session.' };
    }

    const userId = decoded.id;

    // Fetch user
    const [rows] = await db.query(
        `SELECT id, role, password FROM users WHERE id = ? AND is_active = 1 LIMIT 1`,
        [userId]
    );

    if (!rows.length) {
        return { success: false, error: 'Account not found.' };
    }

    const user = rows[0];

    // Belt-and-suspenders: reject admins
    if (user.role === 'admin') {
        return { success: false, error: 'Reset not available for this account.' };
    }

    // Check new !== current
    const sameAsCurrent = await bcrypt.compare(newPassword, user.password);
    if (sameAsCurrent) {
        return { success: false, error: 'New password must be different from your current password.' };
    }

    // Hash and update
    const newHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);
    await db.query(`UPDATE users SET password = ? WHERE id = ?`, [newHash, userId]);

    // Cleanup: consume all OTPs for this user
    await db.query(
        `UPDATE password_reset_otps SET consumed = 1 WHERE user_id = ? AND consumed = 0`,
        [userId]
    );

    return { success: true };
}

module.exports = { requestOTP, verifyOTP, resetPassword, normalizePhone: require('./smsService').normalizePhone };
