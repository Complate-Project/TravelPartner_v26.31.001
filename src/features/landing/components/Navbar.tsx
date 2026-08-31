import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../../assets/logo.png";

const NAV_LINKS = [
    { label: "Experiences", href: "#experiences" },
    { label: "Membership", href: "#membership" },
];

export function Navbar() {
    const [menuOpen, setMenuOpen] = useState(false);

    const linkStyle = {
        color: "var(--text-secondary)",
        fontSize: "0.78rem",
        letterSpacing: "0.04em",
        fontWeight: 500,
        textDecoration: "none",
        transition: "color 0.2s",
        fontFamily: "var(--font-sans)",
    } as const;

    const handleAnchor = (href: string, e: React.MouseEvent) => {
        if (href.startsWith("#")) {
            e.preventDefault();
            setMenuOpen(false);
            document.getElementById(href.slice(1))?.scrollIntoView({ behavior: "smooth" });
        }
    };

    return (
        <nav style={{
            position: 'sticky', top: 0, zIndex: 200, width: '100%',
            backgroundColor: 'var(--bg-nav)',
            borderBottom: '1px solid var(--border-subtle)',
        }}>
            <div className="lp-navbar-inner" style={{
                maxWidth: 1200, margin: '0 auto', padding: '14px 24px',
                display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 24,
            }}>
                {/* Brand */}
                <Link to="/" style={{ display: 'flex', alignItems: 'center', textDecoration: 'none' }}>
                    <img src={logo} alt="Travel Partner" style={{ height: 60, objectFit: 'contain' }} />
                </Link>

                {/* Desktop links + actions */}
                <div className="lp-navbar-desktop" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
                    {NAV_LINKS.map(link => (
                        <a
                            key={link.href}
                            href={link.href}
                            style={linkStyle}
                            onClick={e => handleAnchor(link.href, e)}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--text-primary)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            {link.label}
                        </a>
                    ))}
                    <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 12 }}>
                        <Link to="/login" style={linkStyle}
                            onMouseEnter={e => (e.currentTarget.style.color = 'var(--gold-mid)')}
                            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
                        >
                            Sign In
                        </Link>
                        <Link to="/signup" style={{
                            backgroundColor: 'var(--gold-mid)', color: '#000',
                            padding: '10px 22px', fontSize: '0.72rem', letterSpacing: '0.08em', fontWeight: 700,
                            textDecoration: 'none', fontFamily: "var(--font-sans)", borderRadius: '9999px',
                            transition: 'filter 0.2s',
                        }}
                            onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.1)')}
                            onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                        >
                            Get Started
                        </Link>
                    </div>
                </div>

                {/* Hamburger */}
                <button
                    className="lp-navbar-hamburger"
                    aria-label="Toggle navigation"
                    aria-expanded={menuOpen}
                    onClick={() => setMenuOpen(prev => !prev)}
                    style={{ display: 'none', background: 'none', border: 'none', cursor: 'pointer', padding: '8px' }}
                >
                    <span style={{
                        display: 'block', width: 22, height: 1, background: 'var(--text-primary)',
                        margin: '5px 0', transition: 'all 0.3s ease',
                        transform: menuOpen ? 'translateY(6px) rotate(45deg)' : 'none',
                    }} />
                    <span style={{
                        display: 'block', width: 22, height: 1, background: 'var(--text-primary)',
                        margin: '5px 0', transition: 'all 0.3s ease', opacity: menuOpen ? 0 : 1,
                    }} />
                    <span style={{
                        display: 'block', width: 22, height: 1, background: 'var(--text-primary)',
                        margin: '5px 0', transition: 'all 0.3s ease',
                        transform: menuOpen ? 'translateY(-6px) rotate(-45deg)' : 'none',
                    }} />
                </button>
            </div>

            {/* Mobile menu */}
            {menuOpen && (
                <div className="lp-navbar-mobile" style={{
                    display: 'flex', flexDirection: 'column',
                    borderTop: '1px solid var(--border-subtle)', padding: '8px 0 16px',
                }}>
                    {NAV_LINKS.map(link => (
                        <a key={link.href} href={link.href} style={{ ...linkStyle, padding: '14px 24px', borderBottom: '1px solid var(--border-subtle)' }} onClick={e => handleAnchor(link.href, e)}>
                            {link.label}
                        </a>
                    ))}
                    <Link to="/login" style={{ ...linkStyle, padding: '14px 24px', borderBottom: '1px solid var(--border-subtle)' }} onClick={() => setMenuOpen(false)}>
                        Sign In
                    </Link>
                    <div style={{ padding: '16px 24px' }}>
                        <Link to="/signup" style={{
                            display: 'block', textAlign: 'center',
                            backgroundColor: 'var(--gold-mid)', color: '#000',
                            padding: '12px 22px', fontSize: '0.78rem', letterSpacing: '0.08em', fontWeight: 700,
                            textDecoration: 'none', fontFamily: "var(--font-sans)", borderRadius: '9999px',
                        }} onClick={() => setMenuOpen(false)}>
                            Get Started
                        </Link>
                    </div>
                </div>
            )}

            <style>{`
                @media (max-width: 768px) {
                    .lp-navbar-desktop { display: none !important; }
                    .lp-navbar-hamburger { display: block !important; }
                }
            `}</style>
        </nav>
    );
}
