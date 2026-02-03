import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';
import DashboardLayout from '../components/DashboardLayout';

export default function StatsPage() {
  const [stats, setStats] = useState({
    internationalCongress: 0,
    symposium: 0,
    satisfiedCompanies: 0,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.STATS);
      if (response.data.data) {
        setStats(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setStats(prev => ({ ...prev, [name]: parseInt(value) || 0 }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    try {
      await axios.put(API_ENDPOINTS.STATS, stats);
      alert('Statistics updated successfully!');
    } catch (error) {
      alert('Error updating statistics: ' + error.message);
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading statistics...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Website Statistics</h1>
        <p style={styles.subtitle}>Update the numbers displayed on your homepage</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <div style={styles.statsGrid}>
            <div style={styles.statCard}>
              <label style={styles.label}>🌍 International Congress</label>
              <input
                type="number"
                name="internationalCongress"
                value={stats.internationalCongress}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
              <p style={styles.helper}>Number of international congress events organized</p>
            </div>

            <div style={styles.statCard}>
              <label style={styles.label}>🎓 Symposiums</label>
              <input
                type="number"
                name="symposium"
                value={stats.symposium}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
              <p style={styles.helper}>Number of symposiums conducted</p>
            </div>

            <div style={styles.statCard}>
              <label style={styles.label}>🤝 Satisfied Companies</label>
              <input
                type="number"
                name="satisfiedCompanies"
                value={stats.satisfiedCompanies}
                onChange={handleChange}
                style={styles.input}
                min="0"
              />
              <p style={styles.helper}>Number of satisfied client companies</p>
            </div>
          </div>

          <div style={styles.preview}>
            <h3 style={styles.previewTitle}>Preview</h3>
            <div style={styles.previewGrid}>
              <div style={styles.previewCard}>
                <div style={styles.previewNumber}>{stats.internationalCongress}+</div>
                <div style={styles.previewLabel}>International Congress</div>
              </div>
              <div style={styles.previewCard}>
                <div style={styles.previewNumber}>{stats.symposium}+</div>
                <div style={styles.previewLabel}>Symposiums</div>
              </div>
              <div style={styles.previewCard}>
                <div style={styles.previewNumber}>{stats.satisfiedCompanies}+</div>
                <div style={styles.previewLabel}>Satisfied Companies</div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            style={{...styles.submitButton, opacity: saving ? 0.6 : 1}}
          >
            {saving ? '💾 Saving...' : '✅ Save Statistics'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  container: {
    maxWidth: '1000px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: 'white',
    margin: '0 0 8px 0',
  },
  subtitle: {
    fontSize: '16px',
    color: 'rgba(255,255,255,0.7)',
    marginBottom: '32px',
  },
  form: {
    background: 'rgba(255, 255, 255, 0.05)',
    backdropFilter: 'blur(20px)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    padding: '32px',
    borderRadius: '12px',
    boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
  },
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '24px',
    marginBottom: '32px',
  },
  statCard: {
    padding: '24px',
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
  },
  label: {
    display: 'block',
    fontSize: '16px',
    fontWeight: '600',
    color: 'white',
    marginBottom: '12px',
  },
  input: {
    width: '100%',
    padding: '14px',
    fontSize: '20px',
    fontWeight: 'bold',
    background: 'rgba(255, 255, 255, 0.05)',
    border: '1px solid rgba(255, 255, 255, 0.2)',
    borderRadius: '8px',
    outline: 'none',
    textAlign: 'center',
    color: 'white',
  },
  helper: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.5)',
    marginTop: '8px',
  },
  preview: {
    padding: '24px',
    background: 'linear-gradient(135deg, #872c7a 0%, #b83db8 100%)',
    borderRadius: '12px',
    marginBottom: '24px',
  },
  previewTitle: {
    color: 'white',
    fontSize: '18px',
    fontWeight: 'bold',
    marginBottom: '16px',
    textAlign: 'center',
  },
  previewGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(3, 1fr)',
    gap: '16px',
  },
  previewCard: {
    textAlign: 'center',
    padding: '20px',
    background: 'rgba(255,255,255,0.15)',
    borderRadius: '8px',
    backdropFilter: 'blur(10px)',
  },
  previewNumber: {
    fontSize: '36px',
    fontWeight: 'bold',
    color: 'white',
    marginBottom: '8px',
  },
  previewLabel: {
    fontSize: '14px',
    color: 'rgba(255,255,255,0.9)',
  },
  submitButton: {
    width: '100%',
    padding: '16px',
    background: 'linear-gradient(135deg, #872c7a 0%, #b83db8 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    transition: 'all 0.3s ease',
  },
};
