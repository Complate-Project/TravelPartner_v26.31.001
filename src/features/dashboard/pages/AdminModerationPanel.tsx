import { useEffect, useState, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { adminApi, type AdminUserReport } from '../../../utils/api';
import { useToast } from '../../../components/Toast';
import { useConfirmDialog } from '../../../components/ConfirmDialog';

const btn = (color: string): React.CSSProperties => ({
    border: `1px solid ${color}66`, background: `${color}18`, color, borderRadius: 8,
    padding: '8px 11px', fontSize: '0.72rem', fontWeight: 800, cursor: 'pointer',
    whiteSpace: 'nowrap',
});

const inputStyle: React.CSSProperties = {
    width: '100%',
    background: 'var(--bg-input)',
    border: '1px solid var(--border-default)',
    borderRadius: 8,
    padding: '9px 12px',
    color: 'var(--text-primary)',
    fontSize: '0.82rem',
    boxSizing: 'border-box',
};

interface AccountGroup {
    userId: number;
    name: string;
    email: string;
    role: 'user' | 'provider';
    isActive: number;
    reports: AdminUserReport[];
    totalCount: number;
    pendingCount: number;
}

type ModalAction =
    | { type: 'review'; report: AdminUserReport; nextStatus: AdminUserReport['status'] }
    | { type: 'ban'; userId: number; name: string }
    | { type: 'unban'; userId: number; name: string };

export default function AdminModerationPanel() {
    const toast = useToast();
    const confirmDialog = useConfirmDialog();
    const navigate = useNavigate();
    const [reports, setReports] = useState<AdminUserReport[]>([]);
    const [status, setStatus] = useState('');
    const [loading, setLoading] = useState(true);
    const [expanded, setExpanded] = useState<Record<number, boolean>>({});

    const [modal, setModal] = useState<ModalAction | null>(null);
    const [modalNote, setModalNote] = useState('');
    const [modalBusy, setModalBusy] = useState(false);

    const load = async () => {
        setLoading(true);
        const res = await adminApi.getUserReports(status || undefined);
        if (res.error) toast.error(res.error);
        else setReports(res.data?.reports ?? []);
        setLoading(false);
    };

    useEffect(() => { load(); }, [status]);

    const groups = useMemo(() => {
        const map = new Map<number, AccountGroup>();
        for (const r of reports) {
            const existing = map.get(r.reported_user_id);
            if (existing) {
                existing.reports.push(r);
                existing.totalCount++;
                if (r.status === 'Pending') existing.pendingCount++;
            } else {
                map.set(r.reported_user_id, {
                    userId: r.reported_user_id,
                    name: r.reported_name,
                    email: r.reported_email,
                    role: r.reported_role,
                    isActive: r.reported_is_active,
                    reports: [r],
                    totalCount: 1,
                    pendingCount: r.status === 'Pending' ? 1 : 0,
                });
            }
        }
        return Array.from(map.values());
    }, [reports]);

    const toggleExpand = (userId: number) => setExpanded((prev) => ({ ...prev, [userId]: !prev[userId] }));

    const openReview = (report: AdminUserReport, nextStatus: AdminUserReport['status']) => {
        setModal({ type: 'review', report, nextStatus });
        setModalNote(report.admin_note ?? '');
    };

    const openBan = async (userId: number, name: string) => {
        const ok = await confirmDialog({
            title: 'Ban Account?',
            message: `Are you sure you want to ban ${name}? This will restrict their account access.`,
            confirmLabel: 'Continue',
            cancelLabel: 'Cancel',
            variant: 'danger',
        });
        if (!ok) return;
        setModal({ type: 'ban', userId, name });
        setModalNote('');
    };

    const openUnban = async (userId: number, name: string) => {
        const ok = await confirmDialog({
            title: 'Unban Account?',
            message: `Are you sure you want to unban ${name}? This will restore their account access.`,
            confirmLabel: 'Continue',
            cancelLabel: 'Cancel',
            variant: 'primary',
        });
        if (!ok) return;
        setModal({ type: 'unban', userId, name });
        setModalNote('');
    };

    const submitModal = useCallback(async () => {
        if (!modal) return;
        setModalBusy(true);
        if (modal.type === 'review') {
            const res = await adminApi.reviewUserReport(modal.report.id, modal.nextStatus, modalNote.trim() || undefined);
            if (res.error) toast.error(res.error);
            else { toast.success(`Report marked ${modal.nextStatus.toLowerCase()}.`); await load(); }
        } else if (modal.type === 'ban') {
            const res = await adminApi.banUser(modal.userId, modalNote.trim() || undefined);
            if (res.error) toast.error(res.error);
            else toast.success(`${modal.name} has been banned.`);
        } else {
            const res = await adminApi.unbanUser(modal.userId, modalNote.trim() || undefined);
            if (res.error) toast.error(res.error);
            else toast.success(`${modal.name} has been unbanned.`);
        }
        setModalBusy(false);
        setModal(null);
        setModalNote('');
    }, [modal, modalNote, toast]);

    const modalTitle = modal?.type === 'review'
        ? `${modal.nextStatus === 'Reviewed' ? 'Mark Reviewed' : 'Dismiss Report'}`
        : modal?.type === 'ban' ? 'Ban Account' : 'Unban Account';

    const modalColor = modal?.type === 'review'
        ? (modal.nextStatus === 'Reviewed' ? 'var(--green-status)' : 'var(--text-muted)')
        : modal?.type === 'ban' ? 'var(--red-status)' : 'var(--gold-mid)';

    const modalBtnBg = modal?.type === 'review'
        ? (modal.nextStatus === 'Reviewed' ? 'linear-gradient(135deg,#22c55e,#16a34a)' : 'linear-gradient(135deg,#64748b,#475569)')
        : modal?.type === 'ban' ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#A9852A,#D4A72C)';

    return (
        <>
            <section className="card" style={{ padding: 'var(--space-6)', marginBottom: 'var(--space-8)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 12, flexWrap: 'wrap', marginBottom: 16 }}>
                    <div>
                        <h2 style={{ margin: 0, color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '1.15rem' }}>User moderation</h2>
                        <p style={{ margin: '4px 0 0', color: 'var(--text-muted)', fontSize: '0.76rem' }}>Accounts with reports, grouped by reported user.</p>
                    </div>
                    <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{ background: 'var(--bg-input)', color: 'var(--text-primary)', border: '1px solid var(--border-subtle)', borderRadius: 8, padding: '9px 11px', fontSize: '0.78rem' }}
                        >
                            <option value="">All statuses</option>
                            <option value="Pending">Pending</option>
                            <option value="Reviewed">Reviewed</option>
                            <option value="Dismissed">Dismissed</option>
                        </select>
                        <button
                            type="button"
                            onClick={() => navigate(`/${window.location.pathname.split('/')[1]}/dashboard/report-reasons`)}
                            style={btn('var(--gold-mid)')}
                        >
                            Report Reasons
                        </button>
                    </div>
                </div>

                {loading ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Loading moderation data...</p>
                ) : groups.length === 0 ? (
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>No reports match this filter.</p>
                ) : (
                    <div style={{ display: 'grid', gap: 10 }}>
                        {groups.map((g) => (
                            <article
                                key={g.userId}
                                style={{ border: '1px solid var(--border-subtle)', borderRadius: 10, padding: 13, background: 'var(--bg-input)' }}
                            >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10, flexWrap: 'wrap' }}>
                                    <div>
                                        <strong style={{ color: 'var(--text-primary)', fontSize: '0.85rem' }}>{g.name}</strong>
                                        <div style={{ color: 'var(--text-muted)', fontSize: '0.72rem', marginTop: 2 }}>
                                            {g.email && <span>{g.email}</span>}
                                            {g.email && <span> &middot; </span>}
                                            <span style={{ textTransform: 'capitalize' }}>{g.role}</span>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
                                        <span style={{
                                            fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                            background: 'rgba(212,167,44,0.12)', color: 'var(--gold-mid)',
                                            border: '1px solid rgba(212,167,44,0.3)',
                                        }}>
                                            {g.totalCount} report{g.totalCount !== 1 ? 's' : ''}
                                        </span>
                                        {g.pendingCount > 0 && (
                                            <span style={{
                                                fontSize: '0.68rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                                background: 'rgba(212,167,44,0.12)', color: 'var(--gold-mid)',
                                                border: '1px solid rgba(212,167,44,0.3)',
                                            }}>
                                                {g.pendingCount} pending
                                            </span>
                                        )}
                                        <span style={{
                                            fontSize: '0.65rem', fontWeight: 700, padding: '2px 8px', borderRadius: 999,
                                            background: g.isActive === 1 ? 'rgba(16,185,129,0.12)' : 'rgba(239,68,68,0.12)',
                                            color: g.isActive === 1 ? 'var(--green-status)' : 'var(--red-status)',
                                            border: `1px solid ${g.isActive === 1 ? 'rgba(16,185,129,0.3)' : 'rgba(239,68,68,0.3)'}`,
                                        }}>
                                            {g.isActive === 1 ? 'Active' : 'Banned'}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', gap: 7, flexWrap: 'wrap', marginTop: 10 }}>
                                    <button type="button" onClick={() => toggleExpand(g.userId)} style={btn('var(--gold-mid)')}>
                                        {expanded[g.userId] ? 'Hide Reports' : 'View Reports'}
                                    </button>
                                    {g.isActive === 1 ? (
                                        <button type="button" onClick={() => openBan(g.userId, g.name)} style={btn('var(--red-status)')}>Ban Account</button>
                                    ) : (
                                        <button type="button" onClick={() => openUnban(g.userId, g.name)} style={btn('var(--green-status)')}>Unban Account</button>
                                    )}
                                </div>

                                {expanded[g.userId] && (
                                    <div style={{ marginTop: 14, borderTop: '1px solid var(--border-subtle)', paddingTop: 14, display: 'grid', gap: 10 }}>
                                        {g.reports.map((r) => (
                                            <div
                                                key={r.id}
                                                style={{ border: '1px solid var(--border-subtle)', borderRadius: 8, padding: 11, background: 'var(--bg-card)' }}
                                            >
                                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: 8, flexWrap: 'wrap' }}>
                                                    <strong style={{ fontSize: '0.78rem', color: 'var(--text-primary)' }}>{r.reason_name}</strong>
                                                    <span style={{
                                                        fontSize: '0.65rem', fontWeight: 700,
                                                        color: r.status === 'Pending' ? 'var(--gold-mid)' : r.status === 'Reviewed' ? 'var(--green-status)' : 'var(--text-muted)',
                                                    }}>
                                                        {r.status}
                                                    </span>
                                                </div>
                                                <div style={{ color: 'var(--text-secondary)', fontSize: '0.72rem', marginTop: 4 }}>
                                                    Reported by {r.reporter_name} ({r.reporter_role})
                                                </div>
                                                <div style={{ color: 'var(--text-muted)', fontSize: '0.68rem', marginTop: 2 }}>
                                                    {new Date(r.created_at).toLocaleString()}
                                                </div>
                                                {r.description && (
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.76rem', lineHeight: 1.45, margin: '7px 0 0' }}>{r.description}</p>
                                                )}
                                                {r.admin_note && (
                                                    <p style={{ color: 'var(--text-muted)', fontSize: '0.72rem', fontStyle: 'italic', margin: '5px 0 0' }}>
                                                        Admin note: {r.admin_note}
                                                    </p>
                                                )}
                                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
                                                    {r.status === 'Pending' && (
                                                        <>
                                                            <button type="button" onClick={() => openReview(r, 'Reviewed')} style={btn('var(--green-status)')}>Mark reviewed</button>
                                                            <button type="button" onClick={() => openReview(r, 'Dismissed')} style={btn('var(--text-muted)')}>Dismiss</button>
                                                        </>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </article>
                        ))}
                    </div>
                )}
            </section>

            {modal && (
                <div
                    role="dialog"
                    aria-modal="true"
                    aria-label={modalTitle}
                    onClick={() => { if (!modalBusy) { setModal(null); setModalNote(''); } }}
                    style={{
                        position: 'fixed', inset: 0, zIndex: 800,
                        background: 'var(--bg-overlay)', backdropFilter: 'blur(6px)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20,
                    }}
                >
                    <div
                        onClick={(e) => e.stopPropagation()}
                        style={{
                            width: '100%', maxWidth: 400,
                            background: 'var(--bg-card)', border: '1px solid var(--border-subtle)',
                            borderRadius: 16, boxShadow: 'var(--shadow-lg)',
                            boxSizing: 'border-box', padding: '22px 20px',
                            animation: 'vserv-toast-in 0.18s ease',
                        }}
                    >
                        <p style={{ margin: '0 0 4px', fontSize: '1rem', fontWeight: 800, color: modalColor }}>
                            {modalTitle}
                        </p>
                        {modal.type === 'review' && (
                            <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                {modal.nextStatus === 'Reviewed'
                                    ? `Mark this report as reviewed${modal.report.admin_note ? ' (existing note will be replaced)' : ''}.`
                                    : `Dismiss this report${modal.report.admin_note ? ' (existing note will be replaced)' : ''}.`}
                            </p>
                        )}
                        {modal.type === 'ban' && (
                            <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                This will ban <strong>{modal.name}</strong> and restrict their account access.
                            </p>
                        )}
                        {modal.type === 'unban' && (
                            <p style={{ margin: '0 0 14px', fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                                This will unban <strong>{modal.name}</strong> and restore their account access.
                            </p>
                        )}

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.6rem', letterSpacing: '0.18em', textTransform: 'uppercase', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 6 }}>
                                Note (optional)
                            </label>
                            <textarea
                                value={modalNote}
                                onChange={(e) => setModalNote(e.target.value.slice(0, 2000))}
                                placeholder="Add a moderation note..."
                                rows={3}
                                style={{ ...inputStyle, minHeight: 70, resize: 'vertical' }}
                            />
                        </div>

                        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
                            <button
                                type="button"
                                onClick={() => { setModal(null); setModalNote(''); }}
                                disabled={modalBusy}
                                style={{
                                    padding: '9px 16px', borderRadius: 8,
                                    border: '1px solid var(--border-subtle)', background: 'transparent',
                                    color: 'var(--text-secondary)', fontSize: '0.72rem', fontWeight: 700,
                                    cursor: modalBusy ? 'not-allowed' : 'pointer', opacity: modalBusy ? 0.6 : 1,
                                }}
                            >
                                Cancel
                            </button>
                            <button
                                type="button"
                                onClick={submitModal}
                                disabled={modalBusy}
                                style={{
                                    padding: '9px 18px', borderRadius: 8, border: 'none',
                                    background: modalBtnBg, color: '#fff',
                                    fontSize: '0.72rem', fontWeight: 800,
                                    cursor: modalBusy ? 'not-allowed' : 'pointer', opacity: modalBusy ? 0.6 : 1,
                                }}
                            >
                                {modalBusy ? 'Saving…' : modal.type === 'review'
                                    ? (modal.nextStatus === 'Reviewed' ? 'Mark Reviewed' : 'Dismiss')
                                    : modal.type === 'ban' ? 'Ban Account' : 'Unban Account'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
