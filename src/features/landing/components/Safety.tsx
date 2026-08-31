import { motion } from "framer-motion";

export function Safety() {
    return (
        <section id="safety" style={{
            padding: 'clamp(56px, 8vw, 96px) 24px', position: 'relative',
            background: 'rgba(13, 20, 32, 0.3)',
        }}>
            <div style={{ maxWidth: 760, margin: '0 auto', textAlign: 'center' }}>
                <motion.div
                    initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }} transition={{ duration: 0.7 }}
                >
                    <span style={{
                        display: 'block', fontSize: '0.6rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                        color: 'var(--gold-mid)', fontFamily: "var(--font-sans)", fontWeight: 600, marginBottom: '16px',
                    }}>
                        Safety &amp; Trust
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-serif)", fontWeight: 300,
                        fontSize: 'clamp(1.8rem, 4vw, 2.6rem)', color: 'var(--text-primary)', marginBottom: '22px',
                    }}>
                        Built for Better Connections
                    </h2>

                    <p style={{
                        color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.7,
                        fontFamily: "var(--font-sans)", margin: '0 auto 16px', maxWidth: 620,
                    }}>
                        Travel Partner provides tools that help users manage their interactions
                        and report inappropriate behavior.
                    </p>
                    <p style={{
                        color: 'var(--text-secondary)', fontSize: '0.96rem', lineHeight: 1.7,
                        fontFamily: "var(--font-sans)", margin: '0 auto 40px', maxWidth: 620,
                    }}>
                        Users can report accounts when something doesn&apos;t feel right, while
                        platform moderation tools help review reports and manage problematic accounts.
                    </p>

                    <div style={{
                        fontFamily: "var(--font-serif)", fontWeight: 400,
                        fontSize: '1.3rem', color: 'var(--gold-light)',
                    }}>
                        Connect confidently. Communicate respectfully.
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
