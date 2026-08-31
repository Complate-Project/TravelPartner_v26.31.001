import { motion } from "framer-motion";

const steps = [
    {
        num: '01',
        title: 'Discover',
        text: 'Explore profiles, connections, and experiences available on Travel Partner.',
    },
    {
        num: '02',
        title: 'Connect',
        text: "Find someone you're interested in and start a conversation.",
    },
    {
        num: '03',
        title: 'Engage',
        text: 'Chat, connect through audio calls, exchange gifts, and take part in available experiences.',
    },
    {
        num: '04',
        title: 'Enjoy',
        text: 'Build meaningful connections and continue discovering new experiences.',
    },
];

export function HowItWorks() {
    return (
        <section id="how-it-works" style={{ padding: 'clamp(56px, 8vw, 96px) 24px', position: 'relative' }}>
            <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                    style={{ textAlign: 'center', marginBottom: '56px' }}
                >
                    <h2 style={{
                        fontFamily: "var(--font-serif)", fontWeight: 300,
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: '16px',
                    }}>
                        How It Works
                    </h2>
                    <div style={{
                        width: '48px', height: '1px', margin: '0 auto',
                        background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
                    }} />
                </motion.div>

                {/* Steps */}
                <div style={{
                    display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '24px',
                }}>
                    {steps.map((step, i) => (
                        <motion.div
                            key={step.num}
                            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }} transition={{ duration: 0.6, delay: i * 0.08 }}
                            style={{
                                background: 'var(--bg-card)',
                                border: '1px solid var(--border-subtle)',
                                borderRadius: '14px', padding: '32px 26px',
                            }}
                        >
                            <span style={{
                                fontFamily: "var(--font-serif)", fontSize: '1.4rem',
                                color: 'var(--gold-mid)', display: 'block', marginBottom: '18px',
                            }}>
                                {step.num}
                            </span>
                            <h3 style={{
                                fontFamily: "var(--font-serif)", fontWeight: 400,
                                fontSize: '1.25rem', color: 'var(--text-primary)', margin: '0 0 10px',
                            }}>
                                {step.title}
                            </h3>
                            <p style={{
                                color: 'var(--text-muted)', fontSize: '0.84rem', lineHeight: 1.65,
                                fontFamily: "var(--font-sans)", margin: 0,
                            }}>
                                {step.text}
                            </p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    );
}
