import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';
import DashboardLayout from '../components/DashboardLayout';

export default function PartnersPage() {
  const [partners, setPartners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    websiteUrl: '',
    logo: null,
  });

  useEffect(() => {
    fetchPartners();
  }, []);

  const fetchPartners = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.PARTNERS);
      setPartners(response.data.data);
    } catch (error) {
      console.error('Error fetching partners:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData(prev => ({ ...prev, logo: e.target.files[0] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);

    const submitData = new FormData();
    submitData.append('name', formData.name);
    submitData.append('websiteUrl', formData.websiteUrl);
    if (formData.logo) submitData.append('logo', formData.logo);

    try {
      await axios.post(API_ENDPOINTS.PARTNERS, submitData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      
      alert('Partner added successfully!');
      setShowForm(false);
      setFormData({ name: '', websiteUrl: '', logo: null });
      fetchPartners();
    } catch (error) {
      alert('Error adding partner: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this partner?')) return;

    try {
      await axios.delete(API_ENDPOINTS.PARTNER_BY_ID(id));
      alert('Partner deleted successfully!');
      fetchPartners();
    } catch (error) {
      alert('Error deleting partner: ' + error.message);
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(API_ENDPOINTS.PARTNER_BY_ID(id), {
        isActive: !currentStatus,
      });
      fetchPartners();
    } catch (error) {
      alert('Error updating partner: ' + error.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading partners...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Partner Management</h1>
          <button
            onClick={() => setShowForm(!showForm)}
            style={styles.addButton}
          >
            {showForm ? '✖ Cancel' : '➕ Add Partner'}
          </button>
        </div>

        {showForm && (
          <div style={styles.form}>
            <h2 style={styles.formTitle}>Add New Partner</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Partner Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="Company name"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Website URL (optional)</label>
                  <input
                    type="url"
                    name="websiteUrl"
                    value={formData.websiteUrl}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="https://example.com"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Logo * (Max 5MB)</label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    required
                    style={styles.fileInput}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={uploading}
                style={{...styles.submitButton, opacity: uploading ? 0.6 : 1}}
              >
                {uploading ? '⏳ Adding...' : '✅ Add Partner'}
              </button>
            </form>
          </div>
        )}

        <div style={styles.partnersGrid}>
          {partners.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No partners added yet.</p>
              <p>Click "Add Partner" to add your first partner.</p>
            </div>
          ) : (
            partners.map((partner) => (
              <div key={partner._id} style={styles.partnerCard}>
                <div style={styles.logoContainer}>
                  <img
                    src={partner.logo}
                    alt={partner.name}
                    style={styles.logo}
                  />
                </div>
                <h3 style={styles.partnerName}>{partner.name}</h3>
                {partner.websiteUrl && (
                  <a
                    href={partner.websiteUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={styles.website}
                  >
                    🌐 Visit Website
                  </a>
                )}
                <div style={styles.partnerMeta}>
                  <span style={styles.status}>
                    {partner.isActive ? '🟢 Active' : '🔴 Inactive'}
                  </span>
                </div>
                <div style={styles.actions}>
                  <button
                    onClick={() => toggleActive(partner._id, partner.isActive)}
                    style={styles.toggleButton}
                  >
                    {partner.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(partner._id)}
                    style={styles.deleteButton}
                  >
                    🗑️ Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  container: {
    maxWidth: '1400px',
  },
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '32px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  addButton: {
    padding: '12px 24px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  form: {
    background: 'white',
    padding: '32px',
    borderRadius: '12px',
    marginBottom: '32px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  formTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '24px',
    color: '#333',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#555',
  },
  input: {
    padding: '12px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    outline: 'none',
  },
  fileInput: {
    padding: '8px',
    fontSize: '14px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
  },
  submitButton: {
    padding: '14px 32px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
  },
  partnersGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '24px',
  },
  partnerCard: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
    textAlign: 'center',
  },
  logoContainer: {
    width: '100%',
    height: '120px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
  },
  logo: {
    maxWidth: '100%',
    maxHeight: '100%',
    objectFit: 'contain',
  },
  partnerName: {
    fontSize: '18px',
    fontWeight: 'bold',
    color: '#333',
    margin: '0 0 8px 0',
  },
  website: {
    fontSize: '13px',
    color: '#667eea',
    textDecoration: 'none',
    display: 'inline-block',
    marginBottom: '12px',
  },
  partnerMeta: {
    marginBottom: '16px',
  },
  status: {
    fontSize: '13px',
    color: '#666',
  },
  actions: {
    display: 'flex',
    gap: '12px',
  },
  toggleButton: {
    flex: 1,
    padding: '10px',
    background: '#4CAF50',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  deleteButton: {
    flex: 1,
    padding: '10px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  emptyState: {
    gridColumn: '1 / -1',
    textAlign: 'center',
    padding: '60px 20px',
    color: '#999',
  },
};
