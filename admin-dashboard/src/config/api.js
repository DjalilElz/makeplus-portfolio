// API Configuration
export const API_BASE_URL = 'https://makeplus-portfolio-backend.vercel.app';

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/api/admin/login',
  LOGOUT: '/api/admin/logout',
  ME: '/api/admin/me',
  
  // Videos
  VIDEOS: '/api/admin/videos',
  VIDEO_BY_ID: (id) => `/api/admin/videos/${id}`,
  VIDEO_REORDER: '/api/admin/videos/reorder',
  
  // Partners
  PARTNERS: '/api/admin/partners',
  PARTNER_BY_ID: (id) => `/api/admin/partners/${id}`,
  PARTNER_REORDER: '/api/admin/partners/reorder',
  
  // Stats
  STATS: '/api/admin/stats',
  
  // Contacts
  CONTACTS: '/api/admin/contacts',
  CONTACT_BY_ID: (id) => `/api/admin/contacts/${id}`,
  CONTACT_STATUS: (id) => `/api/admin/contacts/${id}/status`,
  CONTACT_STATS: '/api/admin/contacts/stats',
};
