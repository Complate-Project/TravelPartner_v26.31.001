import React from 'react';
import type { ReactNode } from 'react';
import { useMembership } from '../context/MembershipContext';
import { MembershipUpgradeButton } from './MembershipUpgradeButton';


interface ComingSoonGateProps {
    /** The feature key (e.g. "AUDIO_CALL"). Used to check if the user's tier includes it. */
    feature: string;
    /** Human-readable label shown in the UI */
    label?: string;
    /** Which tier grants this feature (for users who do NOT have it) */
    requiredTier?: string;
    children?: ReactNode;
}

/**
 * ComingSoonGate - for features that are mapped in the DB but not yet built in the app.
 *
 * - User does NOT have the feature → "locked" state (upgrade to unlock, also coming soon)
 * - User HAS the feature via their tier  → "coming soon" state (included in plan, just not ready)
 */
export const ComingSoonGate: React.FC<ComingSoonGateProps> = ({
    feature,
    label,
    requiredTier = 'Gold',
}) => {
    const { hasFeature, loading } = useMembership();


    const displayLabel = label || feature.replace(/_/g, ' ');

    if (loading) {
        return (
            <div style={{
                padding: '20px', textAlign: 'center',
                color: 'var(--text-muted)', fontSize: '0.8rem',
            }}>
                Loading…
            </div>
        );
    }

    if (!hasFeature(feature)) {
        // User's tier doesn't include this feature at all
        return (
            <div style={{
                padding: '20px 16px', borderRadius: 12,
                border: '1px dashed var(--border-default)',
                background: 'var(--bg-card)',
                display: 'flex', flexDirection: 'column',
                alignItems: 'center', textAlign: 'center', gap: 8,
            }}>
                <span style={{ fontSize: 22, opacity: 0.6 }}>🔒</span>
                <p style={{ margin: 0, fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                    {displayLabel}
                </p>
                <span style={{
                    display: 'inline-block',
                    padding: '3px 10px', borderRadius: 999,
                    background: 'var(--gold-glow)',
                    border: '1px solid rgba(37,99,235,0.35)',
                    fontSize: '0.65rem', fontWeight: 800,
                    letterSpacing: '0.12em', textTransform: 'uppercase',
                    color: 'var(--gold-mid)',
                }}>
                    Coming Soon
                </span>
                <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    Available with {requiredTier} membership
                </p>
                <MembershipUpgradeButton variant="secondary">View Plans</MembershipUpgradeButton>
            </div>
        );
    }

    // User's tier INCLUDES the feature — just not implemented in the app yet
    return (
        <div style={{
            padding: '20px 16px', borderRadius: 12,
            border: '1px solid var(--border-default)',
            background: 'var(--bg-card)',
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', textAlign: 'center', gap: 8,
        }}>
            <span style={{ fontSize: 22 }}>⏳</span>
            <p style={{ margin: 0, fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                {displayLabel}
            </p>
            <span style={{
                display: 'inline-block',
                padding: '3px 12px', borderRadius: 999,
                background: 'var(--gold-glow)',
                border: '1px solid rgba(37,99,235,0.35)',
                fontSize: '0.65rem', fontWeight: 800,
                letterSpacing: '0.12em', textTransform: 'uppercase',
                color: 'var(--gold-mid)',
            }}>
                Coming Soon
            </span>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                Included with your current membership ✓
            </p>
        </div>
    );
};
