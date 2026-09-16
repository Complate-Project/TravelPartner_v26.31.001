import React, { useState, useEffect } from 'react';
import { resolveMediaUrl, getMediaFallbackUrl } from '../config/apiConfig';

export interface MediaImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    src?: string | null;
    fallbackContent?: React.ReactNode;
}

/**
 * Image component that resolves backend media URLs to the full API origin
 * and automatically retries with the alternate upload route (/api/uploads/ vs /uploads/)
 * if the primary route returns an error (e.g. 404 or proxy configuration mismatch).
 * If loading fails completely, renders `fallbackContent`.
 */
export function MediaImage({
    src,
    fallbackContent = null,
    alt = '',
    style,
    onError,
    ...props
}: MediaImageProps) {
    const primaryUrl = resolveMediaUrl(src);
    const [currentSrc, setCurrentSrc] = useState<string>(primaryUrl);
    const [retried, setRetried] = useState(false);
    const [failed, setFailed] = useState(false);

    useEffect(() => {
        const resolved = resolveMediaUrl(src);
        setCurrentSrc(resolved);
        setRetried(false);
        setFailed(!resolved);
    }, [src]);

    if (!currentSrc || failed) {
        return <>{fallbackContent}</>;
    }

    return (
        <img
            {...props}
            src={currentSrc}
            alt={alt}
            style={style}
            onError={(e) => {
                if (!retried) {
                    const fallback = getMediaFallbackUrl(currentSrc);
                    if (fallback && fallback !== currentSrc) {
                        setRetried(true);
                        setCurrentSrc(fallback);
                        return;
                    }
                }
                setFailed(true);
                onError?.(e);
            }}
        />
    );
}

export default MediaImage;

