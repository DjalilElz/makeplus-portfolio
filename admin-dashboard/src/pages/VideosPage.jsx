import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';
import DashboardLayout from '../components/DashboardLayout';

export default function VideosPage() {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [showUploadForm, setShowUploadForm] = useState(false);
  const [formData, setFormData] = useState({
    titleFr: '',
    titleEn: '',
    descriptionFr: '',
    descriptionEn: '',
    youtubeUrl: '',
    category: '',
    tags: '',
  });

  useEffect(() => {
    fetchVideos();
  }, []);

  const fetchVideos = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.VIDEOS);
      setVideos(response.data.data);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setUploading(true);
    setUploadProgress(0);

    try {
      // Simulate progress for UI feedback (YouTube URLs are instant)
      setUploadProgress(30);
      
      // Calculate next order number automatically
      const nextOrder = videos.length > 0 
        ? Math.max(...videos.map(v => v.order || 0)) + 1 
        : 1;
      
      await axios.post(API_ENDPOINTS.VIDEOS, {
        titleFr: formData.titleFr,
        titleEn: formData.titleEn,
        descriptionFr: formData.descriptionFr,
        descriptionEn: formData.descriptionEn,
        youtubeUrl: formData.youtubeUrl,
        category: formData.category,
        tags: formData.tags,
        order: nextOrder,
      });
      
      setUploadProgress(100);
      alert('Video added successfully!');
      setShowUploadForm(false);
      setFormData({
        titleFr: '',
        titleEn: '',
        descriptionFr: '',
        descriptionEn: '',
        youtubeUrl: '',
        category: '',
        tags: '',
      });
      setUploadProgress(0);
      fetchVideos();
    } catch (error) {
      alert('Error adding video: ' + (error.response?.data?.message || error.message));
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this video?')) return;

    try {
      await axios.delete(API_ENDPOINTS.VIDEO_BY_ID(id));
      alert('Video deleted successfully!');
      fetchVideos();
    } catch (error) {
      alert('Error deleting video: ' + (error.response?.data?.message || error.message));
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      await axios.put(API_ENDPOINTS.VIDEO_BY_ID(id), {
        isActive: !currentStatus,
      });
      fetchVideos();
    } catch (error) {
      alert('Error updating video: ' + error.message);
    }
  };

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading videos...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <div style={styles.header}>
          <h1 style={styles.title}>Video Management</h1>
          <button
            onClick={() => setShowUploadForm(!showUploadForm)}
            style={styles.addButton}
          >
            {showUploadForm ? '✖ Cancel' : '➕ Upload Video'}
          </button>
        </div>

        {showUploadForm && (
          <div style={styles.uploadForm}>
            <h2 style={styles.formTitle}>Add New Video</h2>
            <form onSubmit={handleSubmit}>
              <div style={styles.formGrid}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>YouTube URL *</label>
                  <input
                    type="url"
                    name="youtubeUrl"
                    value={formData.youtubeUrl}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="https://www.youtube.com/watch?v=... or https://youtu.be/..."
                  />
                  <span style={styles.helperText}>
                    📺 Paste any YouTube video URL (watch, share, or embed format)
                  </span>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Category (Optional)</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="e.g., Corporate, Event, Product"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>French Title *</label>
                  <input
                    type="text"
                    name="titleFr"
                    value={formData.titleFr}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="Titre en français"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>English Title *</label>
                  <input
                    type="text"
                    name="titleEn"
                    value={formData.titleEn}
                    onChange={handleInputChange}
                    required
                    style={styles.input}
                    placeholder="English title"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>French Description *</label>
                  <textarea
                    name="descriptionFr"
                    value={formData.descriptionFr}
                    onChange={handleInputChange}
                    required
                    style={{...styles.input, minHeight: '80px'}}
                    placeholder="Description en français"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>English Description *</label>
                  <textarea
                    name="descriptionEn"
                    value={formData.descriptionEn}
                    onChange={handleInputChange}
                    required
                    style={{...styles.input, minHeight: '80px'}}
                    placeholder="English description"
                  />
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Tags (Optional)</label>
                  <input
                    type="text"
                    name="tags"
                    value={formData.tags}
                    onChange={handleInputChange}
                    style={styles.input}
                    placeholder="event, corporate, 2024 (comma-separated)"
                  />
                </div>
              </div>

              {uploading && (
                <div style={styles.progressContainer}>
                  <div style={styles.progressBar}>
                    <div 
                      style={{
                        ...styles.progressFill,
                        width: `${uploadProgress}%`
                      }}
                    />
                  </div>
                  <span style={styles.progressText}>
                    Processing: {uploadProgress}%
                  </span>
                </div>
              )}

              <button
                type="submit"
                disabled={uploading}
                style={{...styles.submitButton, opacity: uploading ? 0.6 : 1}}
              >
                {uploading ? `⏳ Adding... ${uploadProgress}%` : '✅ Add Video'}
              </button>
            </form>
          </div>
        )}

        <div style={styles.videoGrid}>
          {videos.length === 0 ? (
            <div style={styles.emptyState}>
              <p>No videos uploaded yet.</p>
              <p>Click "Upload Video" to add your first video.</p>
            </div>
          ) : (
            videos.map((video) => (
              <div key={video._id} style={styles.videoCard}>
                {video.youtubeUrl && (
                  <iframe
                    src={video.youtubeUrl}
                    style={styles.videoThumbnail}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                )}
                <div style={styles.videoInfo}>
                  <h3 style={styles.videoTitle}>{video.titleEn}</h3>
                  <p style={styles.videoDesc}>{video.descriptionEn}</p>
                  {video.category && (
                    <span style={styles.categoryBadge}>{video.category}</span>
                  )}
                  <div style={styles.videoMeta}>
                    <span style={styles.metaItem}>
                      {video.isActive ? '🟢 Active' : '🔴 Inactive'}
                    </span>
                    <span style={styles.metaItem}>
                      Order: {video.order}
                    </span>
                  </div>
                </div>
                <div style={styles.videoActions}>
                  <button
                    onClick={() => toggleActive(video._id, video.isActive)}
                    style={styles.toggleButton}
                  >
                    {video.isActive ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    onClick={() => handleDelete(video._id)}
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
  helperText: {
    fontSize: '12px',
    color: '#666',
    marginTop: '4px',
  },
  categoryBadge: {
    display: 'inline-block',
    padding: '4px 12px',
    background: '#e3f2fd',
    color: '#1976d2',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: '500',
    marginBottom: '8px',
  },
  uploadForm: {
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
  fileInfo: {
    fontSize: '12px',
    color: '#667eea',
    fontWeight: '500',
    marginTop: '4px',
  },
  progressContainer: {
    marginBottom: '20px',
  },
  progressBar: {
    width: '100%',
    height: '24px',
    backgroundColor: '#e0e0e0',
    borderRadius: '12px',
    overflow: 'hidden',
    marginBottom: '8px',
  },
  progressFill: {
    height: '100%',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    transition: 'width 0.3s ease',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressText: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#667eea',
    textAlign: 'center',
    display: 'block',
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
  videoGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))',
    gap: '24px',
  },
  videoCard: {
    background: 'white',
    borderRadius: '12px',
    overflow: 'hidden',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  videoThumbnail: {
    width: '100%',
    height: '200px',
    border: 'none',
  },
  videoInfo: {
    padding: '16px',
  },
  videoTitle: {
    fontSize: '18px',
    fontWeight: 'bold',
    margin: '0 0 8px 0',
    color: '#333',
  },
  videoDesc: {
    fontSize: '14px',
    color: '#666',
    margin: '0 0 12px 0',
  },
  videoMeta: {
    display: 'flex',
    gap: '16px',
    fontSize: '13px',
  },
  metaItem: {
    color: '#999',
  },
  videoActions: {
    padding: '16px',
    borderTop: '1px solid #eee',
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
