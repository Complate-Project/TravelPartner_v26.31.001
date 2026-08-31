import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export function FinalCta() {
    return (
        <section style={{ padding: 'clamp(56px, 8vw, 96px) 24px', position: 'relative' }}>
            <motion.div
                initial={{ opacity: 0, y: 28 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.7 }}
                style={{
                    maxWidth: 720, margin: '0 auto', textAlign: 'center',
                    background: 'var(--bg-card)',
                    border: '1px solid var(--gold-border)',
                    borderRadius: '18px', padding: 'clamp(40px, 6vw, 64px) 32px',
                    boxShadow: 'var(--shadow-gold)',
                }}
            >
                <span style={{
                    display: 'block', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                    color: 'var(--gold-mid)', fontFamily: "var(--font-sans)", fontWeight: 600, marginBottom: '18px',
                }}>
                    Get Started
                </span>
                <h2 style={{
                    fontFamily: "var(--font-serif)", fontWeight: 300,
                    fontSize: 'clamp(1.8rem, 4.5vw, 2.8rem)', color: 'var(--text-primary)', margin: '0 0 16px',
                }}>
                    Your Next Connection Starts Here
                </h2>
                <p style={{
                    color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.7,
                    fontFamily: "var(--font-sans)", maxWidth: 460, margin: '0 auto 36px',
                }}>
                    Discover people, conversations, and experiences waiting for you.
                </p>

                <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
                    <Link to="/signup" style={{
                        display: 'inline-flex', alignItems: 'center', gap: 8,
                        backgroundColor: 'var(--gold-mid)', color: '#000',
                        padding: '14px 32px', fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 700,
                        textDecoration: 'none', fontFamily: "var(--font-sans)", borderRadius: '9999px',
                        boxShadow: 'var(--shadow-gold)', transition: 'filter 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                        onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                    >
                        Get Started
                        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                    </Link>
                    <Link to="/login" style={{
                        display: 'inline-flex', alignItems: 'center',
                        border: '1px solid var(--gold-mid)', color: 'var(--gold-mid)',
                        padding: '14px 32px', fontSize: '0.72rem', letterSpacing: '0.14em', fontWeight: 700,
                        textDecoration: 'none', fontFamily: "var(--font-sans)", borderRadius: '9999px',
                        transition: 'background 0.2s',
                    }}
                        onMouseEnter={e => (e.currentTarget.style.background = 'var(--gold-glow)')}
                        onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                    >
                        Sign In
                    </Link>
                </div>
            </motion.div>
        </section>
    );
}
