import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { PointsDisplay } from "../../../components/PointsDisplay";
import { adminApi, type Package } from "../../../utils/api";

const fadeUp = {
    hidden: { opacity: 0, y: 24 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] as const } },
};

const container = {
    hidden: {},
    visible: { transition: { staggerChildren: 0.12 } },
};

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12" />
    </svg>
);

type LandingTier = {
    id: string;
    tag: string;
    name: string;
    price: number;
    description: string;
    durationMonths: number | null;
    features: { label: string; included: boolean }[];
    cta: string;
    featured: boolean;
};

const fallbackTiers: LandingTier[] = [
    {
        id: 'regular',
        tag: 'Regular',
        name: '500',
        price: 500,
        description: 'A simple way to unlock the essentials.',
        durationMonths: null,
        features: [
            { label: 'Partner Search', included: true },
            { label: 'Unlimited Profile Views', included: true },
            { label: 'Chat', included: true },
        ],
        cta: 'Buy Membership',
        featured: false,
    },
    {
        id: 'gold',
        tag: 'Gold',
        name: '1000',
        price: 1000,
        description: 'More access for deeper connections.',
        durationMonths: null,
        features: [
            { label: 'Partner Search', included: true },
            { label: 'Unlimited Profile Views', included: true },
            { label: 'Chat', included: true },
            { label: 'Audio Calls', included: true },
            { label: 'Advanced Search Filters', included: true },
        ],
        cta: 'Buy Membership',
        featured: false,
    },
    {
        id: 'premium',
        tag: 'Premium',
        name: '5000',
        price: 5000,
        description: 'The complete Travel Partner experience.',
        durationMonths: null,
        features: [
            { label: 'Partner Search', included: true },
            { label: 'Unlimited Profile Views', included: true },
            { label: 'Chat', included: true },
            { label: 'Audio Calls', included: true },
            { label: 'Advanced Search Filters', included: true },
            { label: 'Tour & Event Access', included: true },
            { label: 'Premium Experience', included: true },
        ],
        cta: 'Buy Membership',
        featured: true,
    },
];

function buildTiers(packages: Package[]) {
    if (!packages.length) return fallbackTiers;

    const highestLevel = Math.max(...packages.map(p => p.membership_level || 0));

    return packages.map(pkg => {
        const features: { label: string; included: boolean }[] = Array.isArray(pkg.features)
            ? pkg.features.map(f => ({ label: f.display_name || f.key, included: true }))
            : pkg.features
                ? String(pkg.features).split(',').map((f: string) => ({ label: f.trim(), included: true }))
                : [{ label: 'Full Access', included: true }];

        const isFeatured = (pkg.membership_level || 0) === highestLevel && packages.length > 1;

        const tagMap: Record<string, string> = {
            silver: 'Regular',
            starter: 'Starter',
            gold: 'Gold',
            premium: 'Premium',
            elite: 'Premium',
        };

        return {
            id: String(pkg.id),
            tag: tagMap[pkg.tier_type] || pkg.name,
            name: pkg.name,
            price: Number(pkg.price),
            description: pkg.description || 'Unlock more possibilities with Travel Partner.',
            durationMonths: Number(pkg.duration_months) > 0 ? Number(pkg.duration_months) : null,
            features,
            cta: 'Buy Membership',
            featured: isFeatured,
        };
    });
}

export function MembershipTiers() {
    const [tiers, setTiers] = useState(fallbackTiers);

    useEffect(() => {
        adminApi.getPublicPackages()
            .then(res => { if (res.data) setTiers(buildTiers(res.data)); })
            .catch(() => {});
    }, []);

    return (
        <section id="membership" style={{ padding: 'clamp(56px, 8vw, 96px) 24px', position: 'relative' }}>
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
                        Membership
                    </span>
                    <h2 style={{
                        fontFamily: "var(--font-serif)", fontWeight: 300,
                        fontSize: 'clamp(1.8rem, 4vw, 2.8rem)', color: 'var(--text-primary)', marginBottom: '14px',
                    }}>
                        Choose Your Experience
                    </h2>
                    <p style={{
                        color: 'var(--text-secondary)', fontSize: '0.9rem', fontFamily: "var(--font-sans)",
                        maxWidth: 480, margin: '0 auto',
                    }}>
                        Unlock more possibilities with membership options designed to give
                        you greater access to Travel Partner.
                    </p>
                    <div style={{
                        width: '48px', height: '1px', margin: '24px auto 0',
                        background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
                    }} />
                </motion.div>

                {/* Cards */}
                <motion.div
                    variants={container} initial="hidden" whileInView="visible"
                    viewport={{ once: true }}
                    style={{
                        display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '24px',
                        alignItems: 'stretch',
                    }}
                >
                    {tiers.map(tier => (
                        <motion.div
                            key={tier.id}
                            variants={fadeUp}
                            style={{
                                background: tier.featured ? 'var(--bg-card-hover)' : 'var(--bg-card)',
                                border: `1px solid ${tier.featured ? 'var(--gold-border)' : 'var(--border-subtle)'}`,
                                borderRadius: '16px', overflow: 'hidden',
                                display: 'flex', flexDirection: 'column', position: 'relative',
                                boxShadow: tier.featured ? 'var(--shadow-gold)' : 'none',
                                zIndex: tier.featured ? 10 : 1,
                            }}
                        >
                            {/* Featured top line */}
                            {tier.featured && (
                                <div style={{
                                    position: 'absolute', top: 0, left: 0, right: 0, height: '1px',
                                    background: 'linear-gradient(90deg, transparent, var(--gold-mid), transparent)',
                                }} />
                            )}

                            {/* Header */}
                            <div style={{
                                padding: '32px 28px 24px',
                                borderBottom: `1px solid ${tier.featured ? 'var(--gold-border)' : 'var(--border-subtle)'}`,
                                textAlign: 'center',
                            }}>
                                <span style={{
                                    display: 'block', fontSize: '0.55rem', letterSpacing: '0.25em', textTransform: 'uppercase',
                                    color: 'var(--text-muted)', fontFamily: "var(--font-sans)", fontWeight: 700, marginBottom: '14px',
                                }}>
                                    {tier.tag}
                                </span>
                                <div style={{
                                    fontFamily: "var(--font-serif)", fontSize: '2.6rem', fontWeight: 300, lineHeight: 1,
                                    color: tier.featured ? 'var(--gold-light)' : 'var(--text-primary)',
                                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                                }}>
                                    {tier.price === 0 ? 'Free' : <span style={{ display: 'inline-flex', alignItems: 'center', gap: 8 }}><PointsDisplay amount={tier.price} decimals={0} size={30} /></span>}
                                </div>
                                <p style={{
                                    color: 'var(--text-secondary)', fontSize: '0.78rem', lineHeight: 1.5,
                                    margin: '14px auto 0', maxWidth: 230, fontFamily: "var(--font-sans)",
                                }}>
                                    {tier.description}
                                </p>
                                {tier.durationMonths && (
                                    <span style={{
                                        display: 'inline-block', marginTop: '12px', fontSize: '0.65rem',
                                        color: 'var(--text-muted)', fontFamily: "var(--font-sans)",
                                    }}>
                                        Valid for {tier.durationMonths} month{tier.durationMonths === 1 ? '' : 's'}
                                    </span>
                                )}
                                {tier.featured && (
                                    <span style={{
                                        display: 'inline-block', marginTop: '12px',
                                        fontSize: '0.5rem', letterSpacing: '0.2em', textTransform: 'uppercase',
                                        color: 'var(--gold-mid)', border: '1px solid var(--gold-border)',
                                        padding: '3px 9px', borderRadius: '9999px', background: 'var(--gold-glow)',
                                        fontFamily: "var(--font-sans)", fontWeight: 700,
                                    }}>
                                        Most Popular
                                    </span>
                                )}
                            </div>

                            {/* Features */}
                            <ul style={{ padding: '24px 28px', flex: 1, listStyle: 'none', margin: 0 }}>
                                {tier.features.map(f => (
                                    <li key={f.label} style={{
                                        display: 'flex', alignItems: 'center', gap: '12px',
                                        marginBottom: '12px', fontSize: '0.82rem', fontFamily: "var(--font-sans)",
                                    }}>
                                        <span style={{
                                            flexShrink: 0,
                                            color: f.included ? (tier.featured ? 'var(--gold-mid)' : 'var(--green-status)') : 'var(--text-muted)',
                                        }}>
                                            <CheckIcon />
                                        </span>
                                        <span style={{
                                            color: f.included ? 'var(--text-secondary)' : 'var(--text-muted)',
                                            textDecoration: f.included ? 'none' : 'line-through',
                                        }}>
                                            {f.label}
                                        </span>
                                    </li>
                                ))}
                            </ul>

                            {/* CTA */}
                            <div style={{ padding: '0 28px 30px' }}>
                                <a href="/signup" style={{
                                    display: 'block', width: '100%', textAlign: 'center',
                                    padding: '14px', fontSize: '0.66rem', letterSpacing: '0.16em', textTransform: 'uppercase',
                                    fontWeight: 700, fontFamily: "var(--font-sans)", textDecoration: 'none',
                                    borderRadius: '9999px', transition: 'filter 0.2s',
                                    ...(tier.featured
                                        ? {
                                            background: 'linear-gradient(135deg, var(--gold-deep), var(--gold-mid))',
                                            color: '#000', boxShadow: 'var(--shadow-gold)',
                                        }
                                        : {
                                            background: 'transparent', color: 'var(--gold-mid)', border: '1px solid var(--gold-mid)',
                                        }),
                                }}
                                    onMouseEnter={e => (e.currentTarget.style.filter = 'brightness(1.08)')}
                                    onMouseLeave={e => (e.currentTarget.style.filter = 'brightness(1)')}
                                >
                                    {tier.cta}
                                </a>
                            </div>

                            {tier.featured && (
                                <div style={{
                                    position: 'absolute', bottom: 0, left: '25%', right: '25%', height: '1px',
                                    background: 'linear-gradient(90deg, transparent, var(--gold-border), transparent)',
                                    filter: 'blur(2px)',
                                }} />
                            )}
                        </motion.div>
                    ))}
                </motion.div>
            </div>
        </section>
    );
}
