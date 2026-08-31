import { useRouteError, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function ErrorPage() {
    const error: any = useRouteError();
    const navigate = useNavigate();

    return (
        <div style={{
            minHeight: '100svh',
            backgroundColor: 'var(--bg-main)',
            color: 'var(--text-secondary)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: "'Inter', system-ui, sans-serif",
            padding: 20,
            textAlign: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            {/* Global atmospheric background */}
            <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 0,
                background: 'radial-gradient(ellipse 80% 40% at 50% 0%, rgba(37,99,235,0.06) 0%, transparent 60%)',
            }} />
            <div style={{
                position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)',
                width: '1000px', height: '400px', borderRadius: '50%',
                background: 'rgba(37,99,235,0.04)', filter: 'blur(140px)',
                pointerEvents: 'none', zIndex: 0,
            }} />

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ position: 'relative', zIndex: 1, maxWidth: 500 }}
            >
                <h1 style={{
                    fontSize: '4rem',
                    fontWeight: 900,
                    margin: 0,
                    background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--text-muted) 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    lineHeight: 1.2
                }}>
                    {error?.status === 404 ? '404' : 'Oops!'}
                </h1>
                
                <h2 style={{
                    fontSize: '1.5rem',
                    color: 'var(--text-primary)',
                    marginTop: 10,
                    marginBottom: 20,
                    fontWeight: 600
                }}>
                    {error?.status === 404 ? 'Page Not Found' : 'Something went wrong.'}
                </h2>
                
                <p style={{
                    fontSize: '1rem',
                    lineHeight: 1.6,
                    color: 'var(--text-secondary)',
                    marginBottom: 30
                }}>
                    {error?.status === 404 
                        ? "The page you're looking for doesn't exist or has been moved."
                        : error?.statusText || error?.message || "An unexpected error has occurred."}
                </p>

                <button
                    onClick={() => navigate(-1)}
                    style={{
                        padding: '12px 28px',
                        background: 'linear-gradient(135deg, var(--gold-rich), var(--gold-mid))',
                        border: 'none',
                        borderRadius: 12,
                        color: '#fff',
                        fontWeight: 700,
                        fontSize: '1rem',
                        cursor: 'pointer',
                        boxShadow: '0 0 20px rgba(37,99,235,0.25)',
                        transition: 'transform 0.2s',
                    }}
                    onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
                    onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
                >
                    Go Back
                </button>
            </motion.div>
        </div>
    );
}
