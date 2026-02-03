import { useState, useEffect } from 'react';
import axios from '../utils/axios';
import { API_ENDPOINTS } from '../config/api';
import DashboardLayout from '../components/DashboardLayout';

export default function ContactsPage() {
  const [contacts, setContacts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // all, new, read, replied
  const [selectedContact, setSelectedContact] = useState(null);

  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      const response = await axios.get(API_ENDPOINTS.CONTACTS);
      setContacts(response.data.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await axios.patch(API_ENDPOINTS.CONTACT_STATUS(id), { status });
      fetchContacts();
    } catch (error) {
      alert('Error updating status: ' + error.message);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm('Are you sure you want to delete this contact submission?')) return;

    try {
      await axios.delete(API_ENDPOINTS.CONTACT_BY_ID(id));
      alert('Contact deleted successfully!');
      setSelectedContact(null);
      fetchContacts();
    } catch (error) {
      alert('Error deleting contact: ' + error.message);
    }
  };

  const filteredContacts = contacts.filter(contact => {
    if (filter === 'all') return true;
    return contact.status === filter;
  });

  if (loading) {
    return (
      <DashboardLayout>
        <div>Loading contacts...</div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div style={styles.container}>
        <h1 style={styles.title}>Contact Submissions</h1>

        <div style={styles.filters}>
          <button
            onClick={() => setFilter('all')}
            style={{...styles.filterButton, ...(filter === 'all' ? styles.filterActive : {})}}
          >
            All ({contacts.length})
          </button>
          <button
            onClick={() => setFilter('new')}
            style={{...styles.filterButton, ...(filter === 'new' ? styles.filterActive : {})}}
          >
            🔴 New ({contacts.filter(c => c.status === 'new').length})
          </button>
          <button
            onClick={() => setFilter('read')}
            style={{...styles.filterButton, ...(filter === 'read' ? styles.filterActive : {})}}
          >
            📖 Read ({contacts.filter(c => c.status === 'read').length})
          </button>
          <button
            onClick={() => setFilter('replied')}
            style={{...styles.filterButton, ...(filter === 'replied' ? styles.filterActive : {})}}
          >
            ✅ Replied ({contacts.filter(c => c.status === 'replied').length})
          </button>
        </div>

        <div style={styles.layout}>
          <div style={styles.listPanel}>
            {filteredContacts.length === 0 ? (
              <div style={styles.emptyState}>
                No contacts found.
              </div>
            ) : (
              filteredContacts.map((contact) => (
                <div
                  key={contact._id}
                  onClick={() => setSelectedContact(contact)}
                  style={{
                    ...styles.contactItem,
                    ...(selectedContact?._id === contact._id ? styles.contactItemActive : {}),
                  }}
                >
                  <div style={styles.contactHeader}>
                    <span style={styles.contactName}>
                      {contact.firstName} {contact.lastName}
                    </span>
                    <span style={styles.contactStatus}>
                      {contact.status === 'new' && '🔴'}
                      {contact.status === 'read' && '📖'}
                      {contact.status === 'replied' && '✅'}
                    </span>
                  </div>
                  <div style={styles.contactSubject}>{contact.subject}</div>
                  <div style={styles.contactEmail}>{contact.email}</div>
                  <div style={styles.contactDate}>
                    {new Date(contact.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))
            )}
          </div>

          <div style={styles.detailPanel}>
            {selectedContact ? (
              <>
                <div style={styles.detailHeader}>
                  <h2 style={styles.detailTitle}>{selectedContact.subject}</h2>
                  <button
                    onClick={() => handleDelete(selectedContact._id)}
                    style={styles.deleteBtn}
                  >
                    🗑️ Delete
                  </button>
                </div>

                <div style={styles.detailInfo}>
                  <div style={styles.infoRow}>
                    <strong>Name:</strong> {selectedContact.firstName} {selectedContact.lastName}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Email:</strong> <a href={`mailto:${selectedContact.email}`}>{selectedContact.email}</a>
                  </div>
                  {selectedContact.phone && (
                    <div style={styles.infoRow}>
                      <strong>Phone:</strong> <a href={`tel:${selectedContact.phone}`}>{selectedContact.phone}</a>
                    </div>
                  )}
                  {selectedContact.companyName && (
                    <div style={styles.infoRow}>
                      <strong>Company:</strong> {selectedContact.companyName}
                    </div>
                  )}
                  <div style={styles.infoRow}>
                    <strong>Date:</strong> {new Date(selectedContact.createdAt).toLocaleString()}
                  </div>
                  <div style={styles.infoRow}>
                    <strong>Language:</strong> {selectedContact.language === 'fr' ? '🇫🇷 French' : '🇬🇧 English'}
                  </div>
                </div>

                <div style={styles.message}>
                  <strong style={styles.messageLabel}>Message:</strong>
                  <div style={styles.messageContent}>
                    {selectedContact.message}
                  </div>
                </div>

                <div style={styles.statusActions}>
                  <strong>Update Status:</strong>
                  <div style={styles.statusButtons}>
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'read')}
                      style={styles.statusButton}
                      disabled={selectedContact.status === 'read'}
                    >
                      📖 Mark as Read
                    </button>
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'replied')}
                      style={styles.statusButton}
                      disabled={selectedContact.status === 'replied'}
                    >
                      ✅ Mark as Replied
                    </button>
                    <button
                      onClick={() => updateStatus(selectedContact._id, 'new')}
                      style={styles.statusButton}
                    >
                      🔄 Mark as New
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div style={styles.emptyDetail}>
                Select a contact to view details
              </div>
            )}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

const styles = {
  container: {
    maxWidth: '1600px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    marginBottom: '24px',
  },
  filters: {
    display: 'flex',
    gap: '12px',
    marginBottom: '24px',
  },
  filterButton: {
    padding: '10px 20px',
    background: 'white',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'all 0.2s',
  },
  filterActive: {
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    borderColor: 'transparent',
  },
  layout: {
    display: 'grid',
    gridTemplateColumns: '400px 1fr',
    gap: '24px',
    height: 'calc(100vh - 250px)',
  },
  listPanel: {
    background: 'white',
    borderRadius: '12px',
    padding: '16px',
    overflowY: 'auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  contactItem: {
    padding: '16px',
    borderBottom: '1px solid #eee',
    cursor: 'pointer',
    transition: 'background 0.2s',
  },
  contactItemActive: {
    background: '#f0f0f0',
  },
  contactHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '4px',
  },
  contactName: {
    fontSize: '16px',
    fontWeight: 'bold',
    color: '#333',
  },
  contactStatus: {
    fontSize: '18px',
  },
  contactSubject: {
    fontSize: '14px',
    color: '#666',
    marginBottom: '4px',
    fontWeight: '500',
  },
  contactEmail: {
    fontSize: '13px',
    color: '#999',
    marginBottom: '4px',
  },
  contactDate: {
    fontSize: '12px',
    color: '#bbb',
  },
  detailPanel: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    overflowY: 'auto',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  detailHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '2px solid #eee',
  },
  detailTitle: {
    fontSize: '24px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  deleteBtn: {
    padding: '10px 20px',
    background: '#f44336',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  detailInfo: {
    marginBottom: '24px',
  },
  infoRow: {
    fontSize: '15px',
    color: '#555',
    marginBottom: '12px',
    lineHeight: '1.6',
  },
  message: {
    marginBottom: '24px',
  },
  messageLabel: {
    display: 'block',
    fontSize: '16px',
    color: '#333',
    marginBottom: '12px',
  },
  messageContent: {
    padding: '16px',
    background: '#f9f9f9',
    borderRadius: '8px',
    fontSize: '15px',
    lineHeight: '1.8',
    color: '#555',
    whiteSpace: 'pre-wrap',
  },
  statusActions: {
    padding: '20px',
    background: '#f0f0f0',
    borderRadius: '8px',
  },
  statusButtons: {
    display: 'flex',
    gap: '12px',
    marginTop: '12px',
  },
  statusButton: {
    padding: '10px 20px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontSize: '14px',
    cursor: 'pointer',
  },
  emptyState: {
    padding: '40px 20px',
    textAlign: 'center',
    color: '#999',
  },
  emptyDetail: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100%',
    color: '#999',
    fontSize: '16px',
  },
};
