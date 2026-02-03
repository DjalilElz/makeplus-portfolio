# Makeplus Portfolio

Official portfolio website for Makeplus - Professional event management and video production company.

## 📁 Project Structure

```
makeplus-portfolio/
├── public/                          → Main portfolio website (Frontend)
├── admin-dashboard/                 → Admin control panel (React)
└── [documentation files]
```

## 🌐 Live URLs

- **Website**: https://public-five-sepia-99.vercel.app
- **Admin Dashboard**: https://07d27a3f.makeplus-admin.pages.dev
- **Backend API**: https://makeplus-portfolio-backend.vercel.app

## 🚀 Tech Stack

**Frontend (public/):**
- HTML5, CSS3, JavaScript (Vanilla)
- Vercel (Hosting)
- YouTube embeds for videos

**Admin Dashboard (admin-dashboard/):**
- React 18 + Vite
- Cloudflare Pages (Hosting)
- JWT Authentication

**Backend (External):**
- Node.js + Express
- MongoDB Atlas
- Gmail SMTP
- YouTube API integration

## 📚 Documentation

- **BACKEND_IMPLEMENTATION_INSTRUCTIONS.md** - Complete backend migration guide (For backend developer)
- **YOUTUBE_SETUP_GUIDE.md** - How to add videos via YouTube (For you)
- **ADMIN_USER_GUIDE.md** - Admin dashboard usage guide (For you)

## 🔐 Admin Credentials

- Email: elaziziabdeldjalil@gmail.com
- Password: Admin123!Change
- Dashboard: https://07d27a3f.makeplus-admin.pages.dev

## 🛠️ Local Development

### Frontend
```bash
cd public
# Open index.html in browser or use live server
```

### Admin Dashboard
```bash
cd admin-dashboard
npm install
npm run dev
```

## 📦 Deployment

### Frontend
```bash
cd public
vercel --prod
```

### Admin Dashboard
```bash
cd admin-dashboard
npm run build
npx wrangler pages deploy dist --project-name=makeplus-admin
```

## ⚡ Features

- ✅ Bilingual (French/English)
- ✅ YouTube video integration (unlimited storage)
- ✅ Contact form with email notifications
- ✅ Dynamic statistics from MongoDB
- ✅ Partner logos management (base64)
- ✅ Admin authentication (JWT)
- ✅ Responsive design
- ✅ Upload progress tracking

## 📋 What's Next

### For Backend Developer:
1. Read **BACKEND_IMPLEMENTATION_INSTRUCTIONS.md**
2. Update Video model (YouTube URLs)
3. Update Partner model (base64 storage)
4. Add YouTube helpers utility
5. Update routes/controllers
6. Update CORS whitelist
7. Deploy to Vercel

### For You:
1. Read **YOUTUBE_SETUP_GUIDE.md**
2. Upload videos to YouTube (set to Unlisted)
3. Login to admin dashboard
4. Add videos using YouTube URLs
5. Add partner logos
6. Update statistics

## 🗂️ Files Cleaned Up

**Removed:**
- ❌ `backend/` folder (unused temporary backend)
- ❌ `temp_videos/` folder
- ❌ `ui_components/` folder (duplicate)
- ❌ `server.js` (unused)
- ❌ 15+ redundant documentation files

**Kept:**
- ✅ `public/` - Frontend website
- ✅ `admin-dashboard/` - Admin panel
- ✅ 3 essential documentation files
- ✅ Configuration files (.env, vercel.json, etc.)

## 💡 Key Changes

**Before:**
- File uploads (100MB limit)
- Ephemeral storage (/tmp deleted after 12-24h)
- Needed Vercel Blob ($$$)

**After:**
- YouTube URLs (unlimited storage)
- Base64 partner logos (in MongoDB)
- Free forever
- Global CDN (YouTube)

## 🆘 Support

**If something breaks:**
1. Check backend logs on Vercel
2. Test CORS configuration
3. Verify MongoDB connection
4. Check admin dashboard console

**Test URLs:**
- Health check: https://makeplus-portfolio-backend.vercel.app/api/health
- Stats: https://makeplus-portfolio-backend.vercel.app/api/content/stats
- Videos: https://makeplus-portfolio-backend.vercel.app/api/content/videos

---

**Built with ❤️ by Makeplus**
