import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function DashboardLayout({ children }) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  const menuItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/videos', label: 'Videos', icon: '🎥' },
    { path: '/partners', label: 'Partners', icon: '🤝' },
    { path: '/stats', label: 'Statistics', icon: '📈' },
    { path: '/contacts', label: 'Contacts', icon: '📧' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      {/* Sidebar */}
      <aside style={styles.sidebar}>
        <div style={styles.sidebarHeader}>
          <h2 style={styles.logo}>Makeplus</h2>
          <p style={styles.logoSubtitle}>Admin Panel</p>
        </div>

        <nav style={styles.nav}>
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.navItem,
                ...(location.pathname === item.path ? styles.navItemActive : {}),
              }}
            >
              <span style={styles.navIcon}>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          ))}
        </nav>

        <div style={styles.sidebarFooter}>
          <div style={styles.userInfo}>
            <div style={styles.userAvatar}>
              {user?.email?.[0]?.toUpperCase() || 'A'}
            </div>
            <div>
              <div style={styles.userName}>{user?.name || 'Admin'}</div>
              <div style={styles.userEmail}>{user?.email || ''}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={styles.logoutButton}>
            Logout 🚪
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={styles.main}>
        <div style={styles.content}>
          {children}
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    minHeight: '100vh',
    background: 'transparent',
  },
  sidebar: {
    width: '280px',
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    color: 'white',
    display: 'flex',
    flexDirection: 'column',
    position: 'fixed',
    height: '100vh',
    left: 0,
    top: 0,
  },
  sidebarHeader: {
    padding: '32px 24px',
    borderBottom: '1px solid rgba(255,255,255,0.1)',
  },
  logo: {
    fontSize: '24px',
    fontWeight: 'bold',
    margin: '0 0 4px 0',
    background: 'linear-gradient(135deg, #872c7a, #b83db8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
  },
  logoSubtitle: {
    fontSize: '14px',
    opacity: 0.7,
    margin: 0,
    color: 'rgba(255,255,255,0.7)',
  },
  nav: {
    flex: 1,
    padding: '24px 0',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  navItem: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '14px 24px',
    color: 'rgba(255,255,255,0.7)',
    textDecoration: 'none',
    transition: 'all 0.2s',
    fontSize: '15px',
    borderLeft: '4px solid transparent',
  },
  navItemActive: {
    background: 'rgba(135, 44, 122, 0.3)',
    borderLeft: '4px solid #b83db8',
    paddingLeft: '20px',
    fontWeight: '600',
    color: 'white',
  },
  navIcon: {
    fontSize: '20px',
  },
  sidebarFooter: {
    padding: '24px',
    borderTop: '1px solid rgba(255,255,255,0.1)',
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    marginBottom: '16px',
  },
  userAvatar: {
    width: '40px',
    height: '40px',
    borderRadius: '50%',
    background: 'linear-gradient(135deg, #872c7a, #b83db8)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '18px',
    fontWeight: 'bold',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '600',
    color: 'white',
  },
  userEmail: {
    fontSize: '12px',
    opacity: 0.7,
    color: 'rgba(255,255,255,0.7)',
  },
  logoutButton: {
    width: '100%',
    padding: '10px',
    background: 'rgba(135, 44, 122, 0.3)',
    border: '1px solid rgba(255,255,255,0.2)',
    borderRadius: '8px',
    color: 'white',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  main: {
    flex: 1,
    marginLeft: '280px',
  },
  content: {
    padding: '32px',
  },
};
