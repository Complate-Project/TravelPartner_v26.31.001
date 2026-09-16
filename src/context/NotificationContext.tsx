import { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { io, type Socket } from 'socket.io-client';
import { SOCKET_URL } from '../config/apiConfig';
import { useAuth } from './AuthContext';
import { providerApi } from '../utils/api';

interface NotificationState {
    /** Total unread incoming chat messages since last markChatSeen. */
    chatUnread: number;
    /** True when a pending partner request exists that the provider hasn't seen. */
    hasUnreadRequests: boolean;
    /** Number of pending partner requests currently on file. */
    pendingRequestCount: number;
    /** Call when the user opens the Chat page to clear the nav badge. */
    markChatSeen: () => void;
    /** Call when the user opens the Requests tab to clear the request dot. */
    markRequestsSeen: () => void;
    /** Tell the context which partner conversation is currently visible. */
    setActiveChatPartner: (partnerId: number | null) => void;
}

const NotificationContext = createContext<NotificationState | null>(null);

export function useNotifications() {
    const ctx = useContext(NotificationContext);
    if (!ctx) throw new Error('useNotifications must be used within a <NotificationProvider>');
    return ctx;
}

export function NotificationProvider({ children }: { children: React.ReactNode }) {
    const { user } = useAuth();

    const [chatUnread, setChatUnread] = useState(0);
    const [pendingIds, setPendingIds] = useState<number[]>([]);

    const activeChatPartnerRef = useRef<number | null>(null);
    const seenMessagesRef = useRef<Set<number>>(new Set());
    const pendingIdsRef = useRef<number[]>([]);
    const seenRequestIdsRef = useRef<Set<number>>(new Set());

    // ── Poll pending partner requests (providers only) ────────────────────────
    // The socket event triggers an immediate re-poll; the poll itself is the
    // source of truth so count and ids never drift from the server.
    const refreshPendingRef = useRef<() => void>(() => {});

    useEffect(() => {
        if (!user || user.role !== 'provider') return;

        let active = true;

        const fetchPending = async () => {
            try {
                const res = await providerApi.getPartnerRequests();
                if (!active) return;
                if (!res.error && res.data?.requests) {
                    const ids = (res.data.requests as Array<{ id: number; status: string }>)
                        .filter((r) => r.status === 'pending')
                        .map((r) => Number(r.id));
                    pendingIdsRef.current = ids;
                    setPendingIds(ids);
                }
            } catch {
                // membership-gated — silently ignore
            }
        };

        refreshPendingRef.current = fetchPending;
        fetchPending();
        const interval = setInterval(fetchPending, 30_000);
        return () => {
            active = false;
            clearInterval(interval);
        };
    }, [user]);

    // ── Persistent socket for real-time notifications ─────────────────────────
    useEffect(() => {
        if (!user || user.role === 'admin') return;
        const token = localStorage.getItem('bluedise_token');
        if (!token) return;

        const socket: Socket = io(SOCKET_URL, {
            auth: { token },
            transports: ['websocket'],
        });

        const handleNewMessage = (payload: any) => {
            if (!payload || typeof payload !== 'object') return;

            const msgId = Number(payload.id);
            if (!Number.isFinite(msgId)) return;

            // Dedupe guard
            if (seenMessagesRef.current.has(msgId)) return;
            seenMessagesRef.current.add(msgId);

            // Only count messages sent TO me (not my own sent messages)
            if (Number(payload.sender_id) === Number(user.id)) return;

            // Don't bump if I'm currently viewing this partner's conversation
            if (activeChatPartnerRef.current === Number(payload.sender_id)) return;

            setChatUnread((prev) => prev + 1);
        };

        const handlePartnerRequestNew = () => {
            if (user.role !== 'provider') return;
            // Re-poll immediately so the fresh request appears in pendingIds.
            refreshPendingRef.current();
        };

        socket.on('newMessage', handleNewMessage);
        socket.on('partnerRequest:new', handlePartnerRequestNew);

        return () => {
            socket.off('newMessage', handleNewMessage);
            socket.off('partnerRequest:new', handlePartnerRequestNew);
            socket.disconnect();
        };
    }, [user]);

    // ── Derived state ─────────────────────────────────────────────────────────
    const hasUnreadRequests = pendingIds.some((id) => !seenRequestIdsRef.current.has(id));

    // ── Mutators ──────────────────────────────────────────────────────────────
    const markChatSeen = useCallback(() => setChatUnread(0), []);

    const markRequestsSeen = useCallback(() => {
        for (const id of pendingIdsRef.current) seenRequestIdsRef.current.add(id);
        setPendingIds((prev) => [...prev]);
    }, []);

    const setActiveChatPartner = useCallback((id: number | null) => {
        activeChatPartnerRef.current = id;
    }, []);

    return (
        <NotificationContext.Provider
            value={{
                chatUnread,
                hasUnreadRequests,
                pendingRequestCount: pendingIds.length,
                markChatSeen,
                markRequestsSeen,
                setActiveChatPartner,
            }}
        >
            {children}
        </NotificationContext.Provider>
    );
}