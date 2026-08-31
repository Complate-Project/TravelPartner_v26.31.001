import { motion } from "framer-motion";

const values = [
    {
        title: 'Real Connections',
        text: 'Meet people and discover connections that match your interests and preferences.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        ),
    },
    {
        title: 'Meaningful Conversations',
        text: 'Connect through real-time chat and audio conversations.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
            </svg>
        ),
    },
    {
        title: 'Unique Experiences',
        text: 'Explore gifts, events, tours, and opportunities to create memorable moments.',
        icon: (
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />
            </svg>
        ),
    },
];

export function TrustStrip() {
    return (
        <section style={{
            padding: '64px 24px',
            borderTop: '1px solid var(--border-subtle)',
            borderBottom: '1px solid var(--border-subtle)',
            background: 'rgba(13, 20, 32, 0.4)',
        }}>
            <div style={{ maxWidth: 1100, margin: '0 auto', textAlign: 'center' }}>
                <motion.h2
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{
                        fontFamily: "var(--font-serif)", fontWeight: 300,
                        fontSize: 'clamp(1.6rem, 4vw, 2.4rem)', color: 'var(--text-primary)',
                        margin: '0 0 44px',
                    }}
                >
                    Connect. Experience. Belong.
                </motion.h2>

                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7, delay: 0.1 }}
                    style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
                        gap: '28px',
                    }}
                >
                    {values.map(v => (
                        <div key={v.title} style={{ textAlign: 'center', padding: '8px 8px' }}>
                            <div style={{
                                width: '56px', height: '56px', borderRadius: '14px', margin: '0 auto 18px',
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: 'var(--gold-mid)', background: 'var(--gold-glow)', border: '1px solid var(--gold-border)',
                            }}>
                                {v.icon}
                            </div>
                            <h3 style={{
                                fontFamily: "var(--font-serif)", fontWeight: 400,
                                fontSize: '1.15rem', color: 'var(--text-primary)', margin: '0 0 10px',
                            }}>
                                {v.title}
                            </h3>
                            <p style={{
                                color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.6,
                                fontFamily: "var(--font-sans)", margin: '0', maxWidth: 260, marginLeft: 'auto', marginRight: 'auto',
                            }}>
                                {v.text}
                            </p>
                        </div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
