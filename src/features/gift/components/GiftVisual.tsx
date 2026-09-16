import { MediaImage } from '../../../components/MediaImage';

export interface GiftVisualInput {
    name: string;
    icon?: string | null;
    image?: string | null;
    asset?: { url?: string } | null;
}

/**
 * Renders a gift's configured asset (persistent asset URL first, then legacy
 * image URL) and falls back to the emoji icon if no asset is set or the image
 * fails to load (e.g. the asset was removed). Never hardcodes gift media.
 */
export function GiftVisual({
    gift,
    size = 44,
    fontSize = '2rem',
}: {
    gift: GiftVisualInput;
    size?: number;
    fontSize?: string;
}) {
    const rawUrl = gift.asset?.url || gift.image;
    const fallback = <span style={{ fontSize, lineHeight: 1 }}>{gift.icon || '🎁'}</span>;

    if (!rawUrl) {
        return fallback;
    }

    return (
        <MediaImage
            src={rawUrl}
            alt={gift.name}
            style={{ width: size, height: size, objectFit: 'contain' }}
            fallbackContent={fallback}
        />
    );
}

export default GiftVisual;