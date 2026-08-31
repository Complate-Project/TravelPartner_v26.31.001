import { Link } from "react-router-dom";
import logo from '../../../assets/logo.png';

export function TopNav() {
    return (
        <>
            <div style={{ height: '64px', width: '100%', flexShrink: 0 }} />
            <nav style={{
                position: 'fixed',
                top: 0,
                left: '50%',
                transform: 'translateX(-50%)',
                zIndex: 200,
                width: '100%',
                maxWidth: '480px',
                backgroundColor: 'var(--bg-nav)',
                borderBottom: '1px solid var(--border-subtle)',
                display: 'flex',
                alignItems: 'center',
            }}>
                <div className="navbar-inner" style={{ justifyContent: 'center', width: '100%' }}>
                    <Link to="/" className="navbar-brand" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center' }}>
                        <img src={logo} alt="Travel Partner" style={{ height: 40, objectFit: 'contain', display: 'block' }} />
                    </Link>
                </div>
            </nav>
        </>
    );
}