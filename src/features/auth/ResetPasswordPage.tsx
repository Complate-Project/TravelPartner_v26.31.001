import { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { authApi } from '../../utils/api';
import logo from '../../assets/logo.png';

export function ResetPasswordPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const resetToken = (location.state as { resetToken?: string })?.resetToken || '';

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showNew, setShowNew] = useState(false);
    const [showConfirm, setShowConfirm] = useState(false);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    // Redirect if no resetToken in state
    useEffect(() => {
        if (!resetToken) navigate('/forgot-password');
    }, [resetToken, navigate]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!newPassword || !confirmPassword) {
            setError('Both password fields are required.');
            return;
        }
        if (newPassword.length < 6) {
            setError('Password must be at least 6 characters.');
            return;
        }
        if (newPassword !== confirmPassword) {
            setError('Passwords do not match.');
            return;
        }

        setLoading(true);
        const res = await authApi.resetPassword(resetToken, newPassword, confirmPassword);
        setLoading(false);

        if (res.error) {
            setError(res.error);
            return;
        }

        setSuccess(true);
    };

    if (!resetToken) return null;

    if (success) {
        return (
            <div style={pageStyle}>
                <div style={glowBg} />
                <div style={{
                    position: 'absolute', inset: 0, opacity: 0.12,
                    backgroundImage: 'radial-gradient(circle, var(--gold-glow) 1px, transparent 1px)',
                    backgroundSize: '36px 36px', pointerEvents: 'none',
                }} />

                <div style={cardStyle}>
                    <div style={topLine} />
                    <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                        <img src={logo} alt="Travel Partner" style={{ height: 48, objectFit: 'contain', marginBottom: 8 }} />
                        <h1 style={{
                            fontFamily: "'Cormorant Garamond', Georgia, serif",
                            fontSize: '2rem', letterSpacing: '0.15em',
                            color: 'var(--gold-mid)', fontWeight: 400, marginBottom: '6px',
                        }}>Travel Partner</h1>
                    </div>

                    <div style={{ textAlign: 'center', padding: '20px 0' }}>
                        <div style={{
                            width: '64px', height: '64px', borderRadius: '50%', margin: '0 auto 20px',
                            background: 'var(--green-status)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#000" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </div>
                        <h2 style={{
                            fontFamily: "'Cormorant Garamond', serif", fontWeight: 300,
                            fontSize: '1.5rem', color: 'var(--text-primary)', marginBottom: '12px',
                        }}>
                            Password Reset Successful
                        </h2>
                        <p style={{
                            color: 'var(--text-secondary)', fontSize: '0.8rem', fontFamily: "'Inter', sans-serif",
                            lineHeight: 1.5, marginBottom: '24px',
                        }}>
                            Your password has been updated. Please sign in with your new password.
                        </p>
                        <Link to="/login" style={{
                            display: 'inline-block', padding: '12px 32px',
                            background: 'var(--gold-mid)', color: '#000', borderRadius: '8px',
                            fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                            fontWeight: 700, fontFamily: "'Inter', sans-serif",
                            textDecoration: 'none', transition: 'filter 0.2s',
                        }}>
                            Sign In
                        </Link>
                    </div>

                    <p style={{
                        textAlign: 'center', marginTop: '20px',
                        fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                        color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                    }}>© 2026 Travel Partner SECURED PORTAL</p>
                </div>
            </div>
        );
    }

    return (
        <div style={pageStyle}>
            <div style={glowBg} />
            <div style={{
                position: 'absolute', inset: 0, opacity: 0.12,
                backgroundImage: 'radial-gradient(circle, var(--gold-glow) 1px, transparent 1px)',
                backgroundSize: '36px 36px', pointerEvents: 'none',
            }} />

            <div style={cardStyle}>
                <div style={topLine} />

                <div style={{ textAlign: 'center', marginBottom: '28px' }}>
                    <img src={logo} alt="Travel Partner" style={{ height: 48, objectFit: 'contain', marginBottom: 8 }} />
                    <h1 style={{
                        fontFamily: "'Cormorant Garamond', Georgia, serif",
                        fontSize: '2rem', letterSpacing: '0.15em',
                        color: 'var(--gold-mid)', fontWeight: 400, marginBottom: '6px',
                    }}>Travel Partner</h1>
                    <span style={{
                        display: 'block', fontSize: '0.6rem', letterSpacing: '0.3em',
                        textTransform: 'uppercase', color: 'var(--text-muted)',
                        fontFamily: "'Inter', sans-serif", fontWeight: 600,
                    }}>Set New Password</span>
                </div>

                <form onSubmit={handleSubmit}>
                    <label style={labelStyle}>New Password</label>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <input
                            id="reset-new-password"
                            type={showNew ? 'text' : 'password'}
                            placeholder="Min. 6 characters"
                            value={newPassword}
                            onChange={e => setNewPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="button" onClick={() => setShowNew(!showNew)} style={eyeBtn}>
                            {showNew ? eyeOpen : eyeClosed}
                        </button>
                    </div>

                    <label style={labelStyle}>Confirm Password</label>
                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                        <input
                            id="reset-confirm-password"
                            type={showConfirm ? 'text' : 'password'}
                            placeholder="Re-enter password"
                            value={confirmPassword}
                            onChange={e => setConfirmPassword(e.target.value)}
                            style={inputStyle}
                        />
                        <button type="button" onClick={() => setShowConfirm(!showConfirm)} style={eyeBtn}>
                            {showConfirm ? eyeOpen : eyeClosed}
                        </button>
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
                        {loading ? 'Resetting...' : 'Reset Password'}
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

                <p style={{
                    textAlign: 'center', marginTop: '20px',
                    fontSize: '0.55rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                    color: 'var(--text-primary)', fontFamily: "'Inter', sans-serif",
                }}>© 2026 Travel Partner SECURED PORTAL</p>
            </div>
        </div>
    );
}

const eyeOpen = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" /><circle cx="12" cy="12" r="3" />
    </svg>
);

const eyeClosed = (
    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24" />
        <line x1="1" y1="1" x2="23" y2="23" />
    </svg>
);

const pageStyle: React.CSSProperties = {
    minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
    backgroundColor: 'var(--bg-main)', padding: '24px', position: 'relative', overflow: 'hidden',
};

const glowBg: React.CSSProperties = {
    position: 'absolute', top: '50%', left: '50%',
    transform: 'translate(-50%, -50%)',
    width: '800px', height: '500px', borderRadius: '50%',
    background: 'radial-gradient(ellipse, var(--gold-glow) 0%, transparent 70%)',
    pointerEvents: 'none',
};

const cardStyle: React.CSSProperties = {
    position: 'relative', width: '100%', maxWidth: '440px',
    background: 'var(--bg-card)', border: '1px solid var(--border-default)',
    borderRadius: '20px', padding: '40px 36px', boxShadow: 'var(--shadow-lg)',
};

const topLine: React.CSSProperties = {
    position: 'absolute', top: 0, left: '20%', right: '20%', height: '1px',
    background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
};

const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: '0.6rem', letterSpacing: '0.2em', textTransform: 'uppercase',
    color: 'var(--text-muted)', fontFamily: "'Inter', sans-serif", fontWeight: 700,
    marginBottom: '8px',
};

const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 40px 12px 16px',
    background: 'var(--bg-nav)', border: '1px solid var(--border-default)',
    borderRadius: '8px', color: 'var(--text-primary)',
    fontSize: '0.85rem', fontFamily: "'Inter', sans-serif",
    outline: 'none', boxSizing: 'border-box',
};

const eyeBtn: React.CSSProperties = {
    position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)',
    background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)',
    padding: 0, display: 'flex',
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
