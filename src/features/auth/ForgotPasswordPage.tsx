import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import logo from '../../assets/logo.png';

export function ForgotPasswordPage() {
    const [phone, setPhone] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [sent, setSent] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const digits = phone.replace(/\D/g, '');
        if (!digits) {
            setError('Phone number is required.');
            return;
        }

        setLoading(true);
        const res = await authApi.forgotPassword(digits);
        setLoading(false);

        if (res.error) {
            setError(res.error);
            return;
        }

        setSent(true);
        // Navigate to OTP page with phone in state
        navigate('/verify-otp', { state: { phone: digits } });
    };

    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
            backgroundColor: 'var(--bg-main)', padding: '24px', position: 'relative', overflow: 'hidden',
        }}>
            {/* Background Glows */}
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

            {/* Card */}
            <div style={{
                position: 'relative', width: '100%', maxWidth: '440px',
                background: 'var(--bg-card)', border: '1px solid var(--border-default)',
                borderRadius: '20px', padding: '40px 36px', boxShadow: 'var(--shadow-lg)',
            }}>
                <div style={{
                    position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
                    background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
                }} />

                {/* Logo */}
                <div style={{
                    textAlign: 'center', marginBottom: '28px',
                    background: 'var(--bg-nav)', borderRadius: '14px',
                    padding: '14px 20px', border: '1px solid var(--border-subtle)',
                }}>
                    <img src={logo} alt="Travel Partner" style={{ height: 56, objectFit: 'contain', display: 'block', margin: '0 auto' }} />
                </div>

                {sent ? (
                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', fontFamily: "'Inter', sans-serif" }}>
                            Redirecting to OTP verification...
                        </p>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit}>
                        <p style={{
                            color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif",
                            marginBottom: '24px', lineHeight: 1.5,
                        }}>
                            Enter your registered phone number. We'll send you a one-time verification code.
                        </p>

                        <label style={labelStyle}>Phone Number</label>
                        <input
                            id="forgot-phone"
                            type="tel"
                            placeholder="01XXXXXXXXX"
                            value={phone}
                            onChange={e => setPhone(e.target.value.replace(/\D/g, '').slice(0, 11))}
                            maxLength={11}
                            style={inputStyle}
                            autoFocus
                        />

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
                            {loading ? 'Sending...' : 'Send Verification Code'}
                        </button>

                        <p style={{
                            textAlign: 'center', marginTop: '24px',
                            fontSize: '0.8rem', fontFamily: "'Inter', sans-serif", color: 'var(--text-primary)',
                        }}>
                            <Link to="/login" style={{ color: 'var(--gold-mid)', textDecoration: 'none', fontWeight: 500 }}>
                                Back to Sign In
                            </Link>
                        </p>
                    </form>
                )}

                <p style={{
                    textAlign: 'center', marginTop: '20px',
                    fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                }}>© 2026 Travel Partner SECURED PORTAL</p>
            </div>
        </div>
    );
}

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", fontWeight: 700,
    marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 16px', marginBottom: '16px',
    background: 'var(--bg-nav)', border: '1px solid var(--border-default)',
    borderRadius: '8px', color: 'var(--text-primary)',
    fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
    outline: 'none', boxSizing: 'border-box',
};

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
    marginBottom: '12px',
};
