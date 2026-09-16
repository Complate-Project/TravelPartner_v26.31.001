import { MediaImage } from '../../../../components/MediaImage';

function avatarColor(name: string) {
    const colors = [
        'linear-gradient(135deg,#6366f1,#818cf8)',
        'linear-gradient(135deg,#0ea5e9,#38bdf8)',
        'linear-gradient(135deg,#ec4899,#f472b6)',
        'linear-gradient(135deg,#10b981,#34d399)',
        'linear-gradient(135deg,#D4A72C,#fcd34d)',
        'linear-gradient(135deg,#8b5cf6,#a78bfa)',
    ];
    let h = 0;
    for (let i = 0; i < name.length; i++) h += name.charCodeAt(i);
    return colors[h % colors.length];
}

/* ─────────────────────────────────────────────────────────────── Avatar */
export function Avatar({
    name,
    avatar_url,
    size = 40,
}: {
    name: string;
    avatar_url?: string | null;
    size?: number;
}) {
    const initials = name ? name.substring(0, 2).toUpperCase() : '??';
    const initialsBadge = (
        <div style={{
            width: size, height: size, borderRadius: '50%',
            background: avatarColor(name),
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#fff', fontWeight: 700, fontSize: size * 0.36,
            fontFamily: "'Inter', sans-serif", flexShrink: 0,
        }}>
            {initials}
        </div>
    );

    if (!avatar_url) {
        return initialsBadge;
    }

    return (
        <div style={{
            width: size,
            height: size,
            borderRadius: '50%',
            overflow: 'hidden',
            flexShrink: 0,
            background: 'var(--bg-card)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
        }}>
            <MediaImage
                src={avatar_url}
                alt={name}
                style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                fallbackContent={initialsBadge}
            />
        </div>
    );
}

export default Avatar;
