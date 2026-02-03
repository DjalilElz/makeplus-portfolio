# Makeplus Admin Dashboard

Modern admin dashboard for managing the Makeplus portfolio website.

## 🚀 Features

- **Authentication**: Secure login with JWT tokens
- **Video Management**: Upload, edit, delete, and reorder portfolio videos
- **Partner Management**: Manage partner logos and information
- **Statistics Editor**: Update homepage statistics
- **Contact Submissions**: View and manage contact form submissions
- **Responsive Design**: Works on desktop and tablet devices

## 📦 Tech Stack

- **React 18** - UI framework
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Axios** - HTTP client

## 🛠️ Installation

```bash
cd admin-dashboard
npm install
```

## 🏃‍♂️ Development

```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## 🔐 Login Credentials

- **Email**: elaziziabdeldjalil@gmail.com
- **Password**: Admin123!Change

⚠️ **Change the password immediately after first login!**

## 📁 Project Structure

```
admin-dashboard/
├── src/
│   ├── components/
│   │   ├── DashboardLayout.jsx    # Main layout with sidebar
│   │   └── ProtectedRoute.jsx     # Route protection
│   ├── context/
│   │   └── AuthContext.jsx        # Authentication state
│   ├── pages/
│   │   ├── LoginPage.jsx          # Login page
│   │   ├── DashboardPage.jsx      # Dashboard overview
│   │   ├── VideosPage.jsx         # Video management
│   │   ├── PartnersPage.jsx       # Partner management
│   │   ├── StatsPage.jsx          # Statistics editor
│   │   └── ContactsPage.jsx       # Contact submissions
│   ├── config/
│   │   └── api.js                 # API endpoints config
│   ├── utils/
│   │   └── axios.js               # Axios instance with interceptors
│   ├── App.jsx                    # Main app with routes
│   └── main.jsx                   # Entry point
└── package.json
```

## 🌐 API Configuration

The dashboard connects to:
```
https://makeplusportfoliobackend-production.up.railway.app
```

To change the API URL, edit `src/config/api.js`

## 📝 Available Pages

### Dashboard (`/dashboard`)
- Overview of total videos, contacts, and partners
- Quick action links
- System status

### Videos (`/videos`)
- Upload new videos (max 100MB MP4)
- Add thumbnails
- Bilingual titles and descriptions (French/English)
- Toggle active/inactive status
- Delete videos

### Partners (`/partners`)
- Upload partner logos
- Add partner information
- Toggle active/inactive status
- Delete partners

### Statistics (`/stats`)
- Update International Congress count
- Update Symposiums count
- Update Satisfied Companies count
- Live preview

### Contacts (`/contacts`)
- View all contact form submissions
- Filter by status (new, read, replied)
- Mark as read/replied
- Delete submissions
- View full message details

## 🚀 Deployment

### Build for Production

```bash
npm run build
```

### Deploy to Cloudflare Pages

```bash
npx wrangler pages deploy dist --project-name=makeplus-admin
```

## 🐛 Troubleshooting

### "401 Unauthorized"
- Token expired - login again
- Check if backend API is running

### Upload Failed
- Check file size (max 100MB for videos, 5MB for images)
- Verify file format (MP4 for videos)

## 📚 Documentation

- [API Reference](../API_QUICK_REFERENCE.md)
- [Admin User Guide](../ADMIN_USER_GUIDE.md)

---

**Built with ❤️ for Makeplus**
