import { useEffect, useState } from 'react';
import { TopNav } from './TopNav';
import { providerApi, userApi } from '../../../utils/api';
import { useAuth } from '../../../context/AuthContext';
import { MediaImage } from '../../../components/MediaImage';

interface DirectoryProfile {
    id: number;
    name: string;
    avatar_url: string | null;
    profession: string | null;
    location: string | null;
    interests: string | null;
    date_of_birth?: string | null;
}

export function ProviderDirectoryPage() {
    const { user } = useAuth();
    const isUser = user?.role === 'user';
    const [profiles, setProfiles] = useState<DirectoryProfile[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const title = isUser ? 'Provider Directory' : 'Members Directory';
    const subtitle = isUser
        ? 'Browse verified provider profiles'
        : 'Browse membership-holder user profiles';
    const emptyMessage = isUser
        ? 'No membership-holder providers available right now.'
        : 'No membership-holder users available right now.';

    useEffect(() => {
        const load = async () => {
            try {
                setLoading(true);
                const res = isUser ? await userApi.getProviders() : await providerApi.getMembers();
                if (res.error) setError(res.error);
                else setProfiles(res.data || []);
            } catch (e: any) {
                setError(e?.message || 'Failed to load directory');
            } finally {
                setLoading(false);
            }
        };
        load();
    }, [isUser]);

    return (
        <div style={{ background: 'var(--bg-root)', minHeight: '100svh', overflowX: 'hidden' }}>
            <TopNav />

            <div style={{
                padding: 'clamp(80px, 22vw, 100px) clamp(12px, 4vw, 16px) 16px',
                width: '100%',
                boxSizing: 'border-box',
            }}>
                <h2 style={{
                    fontSize: 'clamp(1.1rem, 5vw, 1.3rem)',
                    fontWeight: 700,
                    color: 'var(--text-primary)',
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: '4px',
                }}>
                    {title}
                </h2>
                <p style={{
                    color: 'var(--text-muted)',
                    fontSize: '0.75rem',
                    fontFamily: "'Inter', sans-serif",
                    marginBottom: '16px',
                }}>
                    {subtitle}
                </p>

                {loading && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                        Loading...
                    </p>
                )}

                {!loading && error && (
                    <p style={{ textAlign: 'center', color: 'var(--red-status)', padding: '40px 0' }}>
                        {error}
                    </p>
                )}

                {!loading && !error && profiles.length === 0 && (
                    <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '40px 0' }}>
                        {emptyMessage}
                    </p>
                )}

                {!loading && profiles.length > 0 && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '12px',
                    }}>
                        {profiles.map(p => (
                            <div
                                key={p.id}
                                style={{
                                    borderRadius: '12px',
                                    overflow: 'hidden',
                                    border: '1.5px solid var(--border-subtle)',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    background: 'var(--bg-card)',
                                }}
                            >
                                {p.avatar_url ? (
                                    <MediaImage src={p.avatar_url} alt={p.name} style={{
                                        width: '100%', height: '170px', objectFit: 'cover', display: 'block',
                                    }} fallbackContent={(
                                        <div style={{
                                            width: '100%', height: '170px',
                                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                                            background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                                            color: 'var(--text-secondary)', fontSize: '2rem', fontWeight: 700,
                                        }}>
                                            {p.name ? p.name.substring(0, 2).toUpperCase() : '?'}
                                        </div>
                                    )} />
                                ) : (
                                    <div style={{
                                        width: '100%', height: '170px',
                                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                                        background: 'linear-gradient(135deg, var(--bg-card-hover), var(--bg-card))',
                                        color: 'var(--text-secondary)', fontSize: '2rem', fontWeight: 700,
                                    }}>
                                        {p.name ? p.name.substring(0, 2).toUpperCase() : '?'}
                                    </div>
                                )}

                                <div style={{
                                    position: 'absolute', bottom: 0, left: 0, right: 0,
                                    background: 'linear-gradient(transparent, var(--bg-nav))',
                                    padding: '20px 10px 10px',
                                }}>
                                    <p style={{ color: 'var(--text-primary)', fontSize: '0.8rem', fontWeight: 600, fontFamily: "'Inter', sans-serif", marginBottom: '2px' }}>{p.name}</p>
                                    <div style={{ display: 'flex', gap: '8px', fontSize: '0.6rem', color: 'var(--text-muted)' }}>
                                        {p.profession && <span>{p.profession}</span>}
                                        {p.location && <span>• {p.location}</span>}
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default ProviderDirectoryPage;
