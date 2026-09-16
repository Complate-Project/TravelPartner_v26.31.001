/**
 * Single source of truth for backend API / Socket.IO URLs.
 *
 * All values derive from VITE_API_URL (the backend origin), e.g.
 *   http://localhost:5000  (development)
 *   https://backend-host-url (production)
 *
 * There is deliberately NO localhost fallback: the production build validates
 * that VITE_API_URL is set, so a missing value surfaces as an error instead of
 * silently pointing the app at localhost.
 */

const raw: string | undefined = import.meta.env.VITE_API_URL;

// Normalize to the origin: strip trailing "/api" (legacy) and trailing slashes.
export const API_ORIGIN: string = (raw || '')
    .replace(/\/api\/?$/, '')
    .replace(/\/+$/, '');

export const API_URL: string = `${API_ORIGIN}/api`;
export const SOCKET_URL: string = API_ORIGIN;

/**
 * Resolve a backend media path (e.g. `/uploads/...`) against the configured
 * origin so it works in both development and production.
 */
export function resolveMediaUrl(url?: string | null): string {
    if (!url) return '';
    const value = url.trim().replace(/\\/g, '/');
    if (value.startsWith('data:')) return value;

    // Rewrite absolute legacy upload URLs as well as relative database values.
    // Older rows may contain https://backend/uploads/... while cPanel proxies
    // the working route through /api/uploads/....
    if (/^(https?:)?\/\//.test(value)) {
        try {
            const parsed = new URL(value);
            if (parsed.pathname.startsWith('/uploads/')) {
                parsed.pathname = `/api${parsed.pathname}`;
                return parsed.toString();
            }
        } catch {
            return value;
        }
        return value;
    }

    const clean = value.startsWith('/') ? value : `/${value}`;
    const path = clean.startsWith('/uploads/')
        ? `/api${clean}`
        : clean.startsWith('/api/uploads/')
            ? clean
            : clean.startsWith('/avatars/') || clean.startsWith('/posts/') || clean.startsWith('/deposits/') || clean.startsWith('/gifts/')
                ? `/api/uploads${clean}`
                : clean;
    return API_ORIGIN ? `${API_ORIGIN}${path}` : path;
}

/**
 * Returns an alternate URL (swapping /api/uploads/ and /uploads/) to retry
 * when an image fails to load due to reverse-proxy route differences.
 */
export function getMediaFallbackUrl(url?: string | null): string {
    if (!url) return '';
    const clean = url.trim().replace(/\\/g, '/');
    if (clean.includes('/api/uploads/')) {
        return clean.replace('/api/uploads/', '/uploads/');
    }
    if (clean.includes('/uploads/')) {
        return clean.replace('/uploads/', '/api/uploads/');
    }
    return '';
}

if (!API_ORIGIN) {
    console.error('[config] VITE_API_URL is not set. Backend API and Socket.IO URLs are empty.');
}