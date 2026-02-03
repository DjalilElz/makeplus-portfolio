import { useEffect, useState } from 'react';
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';
import DashboardLayout from '../components/DashboardLayout';

export default function DashboardPage() {
  const [stats, setStats] = useState({
    totalVideos: 0,
    totalContacts: 0,
    totalPartners: 0,
    newContacts: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardStats();
  }, []);

  const fetchDashboardStats = async () => {
    try {
      const [videosRes, contactsRes, partnersRes] = await Promise.all([
        axios.get(API_ENDPOINTS.VIDEOS),
        axios.get(API_ENDPOINTS.CONTACTS),
        axios.get(API_ENDPOINTS.PARTNERS),
      ]);

      const newContacts = contactsRes.data.data.filter(c => c.status === 'new').length;

      setStats({
        totalVideos: videosRes.data.data.length,
        totalContacts: contactsRes.data.data.length,
        totalPartners: partnersRes.data.data.length,
        newContacts,
      });
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading dashboard...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Dashboard Overview</h1>
        <p style={styles.subtitle}>Welcome to Makeplus Admin Panel</p>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statIcon}>🎥</div>
            <div style={styles.statNumber}>{stats.totalVideos}</div>
            <div style={styles.statLabel}>Total Videos</div>
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>📧</div>
            <div style={styles.statNumber}>{stats.totalContacts}</div>
            <div style={styles.statLabel}>Contact Submissions</div>
            {stats.newContacts > 0 && (
              <div style={styles.badge}>{stats.newContacts} new</div>
            )}
          </div>

          <div style={styles.statCard}>
            <div style={styles.statIcon}>🤝</div>
            <div style={styles.statNumber}>{stats.totalPartners}</div>
            <div style={styles.statLabel}>Partners</div>
          </div>
        </div>

        <div style={styles.infoGrid}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>🚀 Quick Actions</h3>
            <ul style={styles.actionList}>
              <li><a href="/videos" style={styles.link}>Upload a new video</a></li>
              <li><a href="/partners" style={styles.link}>Add a partner</a></li>
              <li><a href="/stats" style={styles.link}>Update website statistics</a></li>
              <li><a href="/contacts" style={styles.link}>View contact submissions</a></li>
            </ul>
          </div>

          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>📊 System Info</h3>
            <div style={styles.infoContent}>
              <div style={styles.infoRow}>
                <span>Backend API:</span>
                <span style={styles.infoValue}>✅ Connected</span>
              </div>
              <div style={styles.infoRow}>
                <span>Database:</span>
                <span style={styles.infoValue}>✅ MongoDB Atlas</span>
              </div>
              <div style={styles.infoRow}>
                <span>Storage:</span>
                <span style={styles.infoValue}>⏳ Local (R2 pending)</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
  },
  title: {
    fontSize: '32px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '32px',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
    textAlign: 'center',
    position: 'relative',
    transition: 'all 0.3s ease',
  },
  statIcon: {
    fontSize: '48px',
    marginBottom: '16px',
  },
  statNumber: {
    fontSize: '42px',
    fontWeight: 'bold',
    background: 'linear-gradient(135deg, #872c7a, #b83db8)',
    WebkitBackgroundClip: 'text',
    WebkitTextFillColor: 'transparent',
    marginBottom: '8px',
  },
  statLabel: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.7)',
    fontWeight: '500',
  },
  badge: {
    position: 'absolute',
    top: '16px',
    right: '16px',
    background: 'linear-gradient(135deg, #872c7a, #b83db8)',
    color: 'white',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 'bold',
  },
  infoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))',
    gap: '24px',
  },
  infoCard: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '32px',
    borderRadius: '16px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '20px',
  },
  actionList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  link: {
    color: '#b83db8',
    textDecoration: 'none',
    fontWeight: '500',
    transition: 'color 0.2s',
  },
  infoContent: {
    display: 'flex',
    flexDirection: 'column',
    gap: '12px',
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: '12px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '8px',
    color: 'rgba(255,255,255,0.7)',
  },
  infoValue: {
    fontWeight: '600',
    color: 'white',
  },
};

