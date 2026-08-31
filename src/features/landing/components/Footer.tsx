import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const columns = [
    {
        title: 'Explore',
        links: [
            { label: 'Experiences', to: '#experiences' },
            { label: 'Membership', to: '#membership' },
            { label: 'How It Works', to: '#how-it-works' },
        ],
    },
    {
        title: 'Account',
        links: [
            { label: 'Sign In', to: '/login' },
            { label: 'Get Started', to: '/signup' },
        ],
    },
    {
        title: 'Safety',
        links: [
            { label: 'Report & Safety', to: '#safety' },
        ],
    },
];

export function Footer() {
    const scrollTo = (to: string, e: React.MouseEvent) => {
        if (to.startsWith("#")) {
            e.preventDefault();
            document.getElementById(to.slice(1))?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <footer style={{
            position: 'relative', borderTop: '1px solid var(--border-default)',
            background: 'var(--bg-root)', overflow: 'hidden',
        }}>
            <div style={{
                position: 'absolute', top: 0, left: '33%', right: '33%', height: '1px',
                background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)',
            }} />

            <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 32px' }}>
                {/* Top: brand + columns */}
                <div style={{
                    display: 'grid', gridTemplateColumns: '1.6fr 1fr 1fr 1fr',
                    gap: '36px', paddingBottom: '40px',
                }}>
                    {/* Brand */}
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', marginBottom: '16px' }}>
                            <img src={logo} alt="Travel Partner" style={{ height: 60, objectFit: 'contain' }} />
                        </div>
                        <div style={{
                            fontSize: '0.6rem', letterSpacing: '0.22em', textTransform: 'uppercase',
                            color: 'var(--gold-mid)', fontFamily: "var(--font-sans)", fontWeight: 600, marginBottom: '12px',
                        }}>
                            Connect. Experience. Belong.
                        </div>
                        <p style={{
                            color: 'var(--text-muted)', fontSize: '0.85rem', lineHeight: 1.7,
                            fontFamily: "var(--font-sans)", maxWidth: 300, margin: 0,
                        }}>
                            Explore meaningful connections, engaging conversations, and
                            experiences through Travel Partner.
                        </p>
                    </div>

                    {/* Link columns */}
                    {columns.map(col => (
                        <div key={col.title}>
                            <h4 style={{
                                fontFamily: "var(--font-sans)", fontSize: '0.62rem', letterSpacing: '0.2em',
                                textTransform: 'uppercase', color: 'var(--gold-mid)', fontWeight: 700, margin: '0 0 18px',
                            }}>
                                {col.title}
                            </h4>
                            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
                                {col.links.map(l => (
                                    <li key={l.label} style={{ marginBottom: '12px' }}>
                                        <Link to={l.to} onClick={e => scrollTo(l.to, e)} style={{
                                            fontFamily: "var(--font-sans)", fontSize: '0.85rem',
                                            color: 'var(--text-secondary)', textDecoration: 'none', transition: 'color 0.2s',
                                        }}
                                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-mid)')}
                                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                                        >
                                            {l.label}
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>

                {/* Bottom */}
                <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
                    paddingTop: '24px', borderTop: '1px solid var(--border-subtle)',
                    fontFamily: "var(--font-sans)", fontSize: '0.72rem', color: 'var(--text-muted)',
                }}>
                    <span>© 2026 Travel Partner. All Rights Reserved.</span>
                </div>
            </div>
        </footer>
    );
}
