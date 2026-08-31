import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

export function Hero() {
    return (
        <section className="hero-section" style={{
            position: 'relative', minHeight: 'calc(100vh - 90px)', display: 'flex', alignItems: 'center', justifyContent: 'center',
            overflow: 'hidden', textAlign: 'center', padding: '56px 24px 72px',
        }}>
            {/* Atmospheric glows */}
            <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none' }}>
                <div style={{
                    position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                    width: '900px', height: '500px',
                    borderRadius: '50%', background: 'rgba(212, 167, 44, 0.08)', filter: 'blur(120px)',
                }} />
                <div style={{
                    position: 'absolute', bottom: 0, right: 0,
                    width: '600px', height: '400px',
                    borderRadius: '50%', background: 'rgba(120, 80, 20, 0.05)', filter: 'blur(140px)',
                }} />
            </div>

            <motion.div
                className="hero-content"
                variants={container}
                initial="hidden"
                animate="visible"
                style={{ position: 'relative', zIndex: 2, maxWidth: 760 }}
            >
                {/* Eyebrow */}
                <motion.div variants={fadeUp} style={{ marginBottom: '28px' }}>
                    <span style={{
                        display: 'inline-block',
                        fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                        color: 'var(--gold-mid)', fontFamily: "var(--font-sans)", fontWeight: 600,
                    }}>
                        Travel Partner
                    </span>
                </motion.div>

                {/* Headline */}
                <motion.h1 variants={fadeUp} style={{
                    fontFamily: "var(--font-serif)", fontWeight: 300,
                    fontSize: 'clamp(2.4rem, 6.5vw, 4.4rem)',
                    lineHeight: 1.12, color: 'var(--text-primary)',
                    marginBottom: '24px', letterSpacing: '-0.02em',
                }}>
                    Discover Meaningful Connections
                </motion.h1>

                {/* Description */}
                <motion.p variants={fadeUp} style={{
                    color: 'var(--text-secondary)', fontSize: 'clamp(0.9rem, 1.8vw, 1.05rem)',
                    lineHeight: 1.75, maxWidth: 600, margin: '0 auto 40px',
                    fontFamily: "var(--font-sans)",
                }}>
                    Connect with people, discover new experiences, and build genuine connections
                    through a private and engaging platform designed around you.
                </motion.p>

                {/* CTAs */}
                <motion.div variants={fadeUp} style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
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
                        transition: 'background 0.2s, color 0.2s',
                    }}
                        onMouseEnter={e => { e.currentTarget.style.background = 'var(--gold-glow)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background = 'transparent'; }}
                    >
                        Sign In
                    </Link>
                </motion.div>
            </motion.div>
        </section>
    );
}
