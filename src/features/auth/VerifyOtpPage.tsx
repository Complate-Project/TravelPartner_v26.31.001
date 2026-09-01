import { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import logo from '../../assets/logo.png';

export function VerifyOtpPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const phone = (location.state as { phone?: string })?.phone || '';

    const [otp, setOtp] = useState(['', '', '', '']);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [resendCooldown, setResendCooldown] = useState(0);
    const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

    // Redirect if no phone in state
    useEffect(() => {
        if (!phone) navigate('/forgot-password');
    }, [phone, navigate]);

    // Resend cooldown timer
    useEffect(() => {
        if (resendCooldown <= 0) return;
        const timer = setTimeout(() => setResendCooldown(c => c - 1), 1000);
        return () => clearTimeout(timer);
    }, [resendCooldown]);

    const handleOtpChange = (index: number, value: string) => {
        if (!/^\d*$/.test(value)) return;
        const newOtp = [...otp];
        newOtp[index] = value.slice(-1);
        setOtp(newOtp);
        setError('');

        if (value && index < 3) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
        if (e.key === 'Backspace' && !otp[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        e.preventDefault();
        const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 4);
        if (!pasted) return;
        const newOtp = pasted.split('').concat(Array(4).fill('')).slice(0, 4);
        setOtp(newOtp);
        inputRefs.current[Math.min(pasted.length, 3)]?.focus();
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const otpString = otp.join('');
        if (otpString.length !== 4) {
            setError('Please enter the complete 4-digit code.');
            return;
        }

        setLoading(true);
        const res = await authApi.verifyOtp(phone, otpString);
        setLoading(false);

        if (res.error) {
            setError(res.error);
            return;
        }

        // Navigate to reset password with the resetToken
        navigate('/reset-password', { state: { resetToken: res.data?.resetToken } });
    };

    const handleResend = async () => {
        if (resendCooldown > 0) return;
        setError('');

        const res = await authApi.resendOtp(phone);
        if (res.error) {
            setError(res.error);
            return;
        }
        setResendCooldown(60);
        setOtp(['', '', '', '']);
        inputRefs.current[0]?.focus();
    };

    if (!phone) return null;

    // Mask phone for display: 88017123****45678
    const maskedPhone = phone.length > 6
        ? phone.slice(0, 6) + '****' + phone.slice(-2)
        : phone;

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--bg-main)', padding: '24px', position: 'relative', overflow: 'hidden',
        }}>
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: '50%', left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '800px', height: '500px', borderRadius: '50%',
                    background: 'radial-gradient(ellipse, var(--gold-glow) 0%, transparent 70%)',
                }} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.12,
                    backgroundImage: 'radial-gradient(circle, var(--gold-glow) 1px, transparent 1px)',
                    backgroundSize: '36px 36px',
                }} />
            </div>

            <div style={{
                position: 'relative', width: '100%', maxWidth: '440px',
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: '20px', padding: '40px 36px', boxShadow: 'var(--shadow-lg)',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
                }} />

                <div style={{
                    textAlign: 'center', marginBottom: '28px',
                    background: 'var(--bg-nav)', borderRadius: '14px',
                    padding: '14px 20px', border: '1px solid var(--border-subtle)',
                }}>
                    <img src={logo} alt="Travel Partner" style={{ height: 56, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                </div>

                <p style={{
                    color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif",
                    marginBottom: '24px', lineHeight: 1.5, textAlign: 'center',
                }}>
                    Enter the 4-digit code sent to<br />
                    <span style={{ color: 'var(--gold-mid)', fontWeight: 600 }}>{maskedPhone}</span>
                </p>

                <form onSubmit={handleSubmit}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'center', marginBottom: '24px' }}>
                        {otp.map((digit, i) => (
                            <input
                                key={i}
                                ref={el => { inputRefs.current[i] = el; }}
                                type="text"
                                inputMode="numeric"
                                maxLength={1}
                                value={digit}
                                onChange={e => handleOtpChange(i, e.target.value)}
                                onKeyDown={e => handleKeyDown(i, e)}
                                onPaste={i === 0 ? handlePaste : undefined}
                                autoFocus={i === 0}
                                style={{
                                    width: '48px', height: '56px', textAlign: 'center',
                                    background: 'var(--bg-nav)', border: '1px solid var(--border-default)',
                                    borderRadius: '10px', color: 'var(--text-primary)',
                                    fontSize: '1.4rem', fontFamily: "'Inter', sans-serif", fontWeight: 600,
                                    outline: 'none', caretColor: 'var(--gold-mid)',
                                    transition: 'border-color 0.2s',
                                }}
                                onFocus={e => { e.currentTarget.style.borderColor = 'var(--gold-mid)'; }}
                                onBlur={e => { e.currentTarget.style.borderColor = 'var(--border-default)'; }}
                            />
                        ))}
                    </div>

                    {error && <p style={errorStyle}>{error}</p>}

                    <button
                        type="submit"
                        disabled={loading}
                        style={{
                            ...buttonStyle,
                            opacity: loading ? 0.6 : 1,
                            cursor: loading ? 'not-allowed' : 'pointer',
                        }}
                    >
                        {loading ? 'Verifying...' : 'Verify Code'}
                    </button>

                    <div style={{ textAlign: 'center', marginTop: '20px' }}>
                        <button
                            type="button"
                            onClick={handleResend}
                            disabled={resendCooldown > 0}
                            style={{
                                background: 'none', border: 'none', cursor: resendCooldown > 0 ? 'not-allowed' : 'pointer',
                                color: resendCooldown > 0 ? 'var(--text-muted)' : 'var(--gold-mid)',
                                fontSize: '0.8rem', fontFamily: "'Inter', sans-serif",
                                textDecoration: 'underline',
                            }}
                        >
                            {resendCooldown > 0 ? `Resend in ${resendCooldown}s` : 'Resend Code'}
                        </button>
                    </div>

                    <p style={{
                        textAlign: 'center', marginTop: '24px',
                        fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)',
                    }}>
                        <Link to="/forgot-password" style={{ color: 'var(--gold-mid)', textDecoration: 'none', fontWeight: 500 }}>
                            Change Phone Number
                        </Link>
                    </p>
                </form>

                <p style={{
                    textAlign: 'center', marginTop: '20px',
                    fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                }}>© 2026 Travel Partner SECURED PORTAL</p>
            </div>
        </div>
    );
}

const buttonStyle: React.CSSProperties = {
    width: '100%', padding: '14px', marginTop: '8px',
    background: 'var(--gold-mid)', color: '#000',
    border: 'none', borderRadius: '8px', cursor: 'pointer',
    fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
    fontWeight: 700, fontFamily: "'Inter', sans-serif",
    transition: 'filter 0.2s',
};

const errorStyle: React.CSSProperties = {
    color: 'var(--red-status)', fontSize: '0.75rem', fontFamily: "'Inter', sans-serif",
    marginBottom: '12px', textAlign: 'center',
};
