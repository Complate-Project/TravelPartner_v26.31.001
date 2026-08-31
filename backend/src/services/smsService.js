/**
 * SMS service — ISMS Plus (SSL Wireless) integration.
 *
 * Sends SMS via the ISMS Plus v3 API. All credentials are read from environment
 * variables and never exposed to the frontend. OTP values are never logged.
 */

const crypto = require('crypto');

const ISMS_API_DOMAIN = process.env.ISMS_API_DOMAIN || 'https://smsplus.sslwireless.com';
const ISMS_API_TOKEN = process.env.ISMS_API_TOKEN || '';
const ISMS_SID = process.env.ISMS_SID || '';

/**
 * Strip non-digit characters and ensure 13-digit BD format (8801XXXXXXXXX).
 * Accepts: "+8801712345678", "8801712345678", "01712345678"
 */
function normalizePhone(phone) {
    const digits = String(phone).replace(/\D/g, '');
    if (digits.startsWith('880') && digits.length === 13) return digits;
    if (digits.startsWith('0') && digits.length === 11) return '88' + digits;
    return digits;
}

/**
 * Send a single SMS via ISMS Plus.
 * @param {string} phone - Recipient phone (any common BD format)
 * @param {string} message - SMS body text
 * @param {string} csmsId - Unique reference ID for tracking
 * @returns {Promise<{ success: boolean, smsId?: string, error?: string }>}
 */
async function sendSMS(phone, message, csmsId) {
    if (!ISMS_API_TOKEN || !ISMS_SID) {
        console.error('[sms] ISMS_API_TOKEN or ISMS_SID not configured');
        return { success: false, error: 'SMS service not configured' };
    }

    const msisdn = normalizePhone(phone);

    const body = {
        api_token: ISMS_API_TOKEN,
        sid: ISMS_SID,
        msisdn,
        sms: message,
        csms_id: csmsId,
    };

    try {
        const url = `${ISMS_API_DOMAIN}/api/v3/send-sms`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
            body: JSON.stringify(body),
        });

        const json = await res.json();

        if (json.status === 'SUCCESS' && json.status_code === 200) {
            const smsId = json.smsinfo && json.smsinfo[0] ? json.smsinfo[0].sms_id : undefined;
            return { success: true, smsId };
        }

        console.error('[sms] ISMS Plus returned:', json.status, json.status_code, json.error_message);
        return { success: false, error: json.error_message || 'SMS delivery failed' };
    } catch (err) {
        console.error('[sms] Network error:', err.message);
        return { success: false, error: 'SMS service unavailable' };
    }
}

/**
 * Send a password-reset OTP SMS.
 * @param {string} phone
 * @param {string} otp - The 4-digit plaintext OTP (not logged)
 * @param {string} csmsId
 * @returns {Promise<{ success: boolean, smsId?: string, error?: string }>}
 */
async function sendOTP(phone, otp, csmsId) {
    const message = `Your Travel Partner verification code is: ${otp}\nValid for 10 minutes. Do not share this code.`;
    return sendSMS(phone, message, csmsId);
}

module.exports = { sendSMS, sendOTP, normalizePhone };
