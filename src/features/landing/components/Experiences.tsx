import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const experiences = [
    {
        id: 'chat',
        title: 'Chat',
        text: 'Start conversations and connect in real time with people you discover on the platform.',
        cta: 'Explore Chat',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        id: 'calls',
        title: 'Audio Calls',
        text: 'Take your conversations further with real-time audio calls.',
        cta: 'Explore Calls',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
            </svg>
        ),
    },
    {
        id: 'gifts',
        title: 'Gifts',
        text: 'Send thoughtful gifts and make your conversations more memorable.',
        cta: 'Explore Gifts',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 12v10H4V12" />
                <path d="M2 7h20v5H2z" />
                <path d="M12 22V7" />
                <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z" />
                <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z" />
            </svg>
        ),
    },
    {
        id: 'events',
        title: 'Events & Tours',
        text: 'Discover events and tours and connect through shared experiences.',
        cta: 'Explore Events',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
        ),
    },
    {
        id: 'connections',
        title: 'Partner Connections',
        text: 'Find and connect with partners based on your interests and preferences.',
        cta: 'Find Connections',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="11" cy="11" r="8" />
                <path d="m21 21-4.35-4.35" />
            </svg>
        ),
    },
];

export function Experiences() {
    return (
        <section id="experiences" style={{
            padding: 'clamp(56px, 8vw, 96px) 24px', position: 'relative',
            background: 'rgba(13, 20, 32, 0.3)',
        }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center', marginBottom: '56px' }}
                >
                    <span style={{
                        display: 'block', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                        color: 'var(--gold-mid)', fontFamily: "var(--font-sans)", fontWeight: 600, marginBottom: '16px',
                    }}>
                        Experiences
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-serif)", fontWeight: 300,
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: '16px',
                    }}>
                        More Than Just a Connection
                    </h2>
                    <div style={{
                        width: '48px', height: '1px', margin: '0 auto',
                        background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
                    }} />
                </motion.div>

                {/* Cards */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '24px',
                }}>
                    {experiences.map((exp, i) => (
                        <motion.div
                            key={exp.id}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.06 }}
                            style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '14px', padding: '34px 28px',
                                display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center',
                                transition: 'border-color 0.3s',
                            }}
                        >
                            <div style={{
                                width: '58px', height: '58px', borderRadius: '14px', marginBottom: '20px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--gold-mid)', background: 'var(--gold-glow)',
                            }}>
                                {exp.icon}
                            </div>
                            <h3 style={{
                                fontFamily: "var(--font-serif)", fontWeight: 400,
                                fontSize: '1.3rem', color: 'var(--text-primary)', margin: '0 0 10px',
                            }}>
                                {exp.title}
                            </h3>
                            <p style={{
                                color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.65,
                                fontFamily: "var(--font-sans)", margin: '0 0 22px', flex: 1,
                            }}>
                                {exp.text}
                            </p>
                            <Link to="/signup" style={{
                                display: 'inline-flex', alignItems: 'center', gap: 6,
                                fontSize: '0.62rem', letterSpacing: '0.18em', textTransform: 'uppercase',
                                fontWeight: 700, fontFamily: "var(--font-sans)",
                                color: 'var(--gold-mid)', textDecoration: 'none',
                            }}>
                                {exp.cta}
                                <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14" /><path d="m12 5 7 7-7 7" /></svg>
                            </Link>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
