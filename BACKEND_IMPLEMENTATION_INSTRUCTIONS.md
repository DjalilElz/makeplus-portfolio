# Backend Implementation Instructions - Storage Migration

## 🎯 OBJECTIVE
Migrate backend from **file storage** to **YouTube URLs + Base64 images**

**Your Backend**: https://makeplus-portfolio-backend.vercel.app

---

## ⚡ QUICK SUMMARY

### What Changes:
1. **Videos**: Store YouTube embed URLs (no file uploads)
2. **Partners**: Store logos as base64 strings in MongoDB (no file URLs)
3. **File uploads**: Remove multer disk storage, use memory storage for logos only

### Benefits:
- ✅ Unlimited video storage (YouTube)
- ✅ No file size limits
- ✅ No ephemeral storage issues
- ✅ Free forever
- ✅ Global CDN (YouTube)

---

## 📝 STEP 1: UPDATE MODELS

### Video Model - `models/Video.js`

**REMOVE these fields:**
```javascript
filename: String
videoUrl: String
thumbnailUrl: String
duration: Number
fileSize: Number
```

**ADD these fields:**
```javascript
youtubeUrl: { type: String, required: true }    // e.g., "https://www.youtube.com/embed/dQw4w9WgXcQ"
youtubeVideoId: String                           // e.g., "dQw4w9WgXcQ"
category: String                                 // e.g., "Event", "Corporate"
tags: [String]                                   // e.g., ["medical", "2024"]
```

**FINAL SCHEMA:**
```javascript
const videoSchema = new mongoose.Schema({
  titleFr: { type: String, required: true },
  titleEn: { type: String, required: true },
  descriptionFr: String,
  descriptionEn: String,
  youtubeUrl: { type: String, required: true },
  youtubeVideoId: String,
  category: String,
  tags: [String],
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

---

### Partner Model - `models/Partner.js`

**REMOVE this field:**
```javascript
logoUrl: String
```

**ADD these fields:**
```javascript
logo: { type: String, required: true }          // Base64: "data:image/png;base64,iVBORw0..."
logoMimeType: { type: String, default: 'image/png' }  // "image/png", "image/jpeg", etc.
```

**FINAL SCHEMA:**
```javascript
const partnerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  logo: { type: String, required: true },
  logoMimeType: { type: String, default: 'image/png' },
  websiteUrl: String,
  order: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, { timestamps: true });
```

---

## 🛠️ STEP 2: CREATE YOUTUBE HELPERS

Create new file: `utils/youtubeHelpers.js`

```javascript
/**
 * Check if URL is valid YouTube URL
 */
exports.isValidYouTubeUrl = (url) => {
  if (!url || typeof url !== 'string') return false;
  
  const patterns = [
    /^https?:\/\/(www\.)?youtube\.com\/watch\?v=[\w-]+/,
    /^https?:\/\/youtu\.be\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/embed\/[\w-]+/,
    /^https?:\/\/(www\.)?youtube\.com\/shorts\/[\w-]+/
  ];
  
  return patterns.some(pattern => pattern.test(url));
};

/**
 * Extract video ID from YouTube URL
 */
exports.extractVideoId = (url) => {
  if (!url) return null;
  
  try {
    if (url.includes('youtube.com/watch')) {
      const urlObj = new URL(url);
      return urlObj.searchParams.get('v');
    }
    if (url.includes('youtu.be/')) {
      return url.split('youtu.be/')[1].split('?')[0].split('/')[0];
    }
    if (url.includes('youtube.com/embed/')) {
      return url.split('/embed/')[1].split('?')[0].split('/')[0];
    }
    if (url.includes('youtube.com/shorts/')) {
      return url.split('/shorts/')[1].split('?')[0].split('/')[0];
    }
    return null;
  } catch (error) {
    return null;
  }
};

/**
 * Convert any YouTube URL to embed format
 */
exports.convertToEmbedUrl = (url) => {
  const videoId = exports.extractVideoId(url);
  if (!videoId) return null;
  return `https://www.youtube.com/embed/${videoId}`;
};
```

---

## 🔧 STEP 3: UPDATE VIDEO ROUTES

In your admin routes file (e.g., `routes/admin.js` or video controller):

### GET /api/admin/videos
**No changes needed** - Just returns videos from database

---

### POST /api/admin/videos
**BEFORE (File upload):**
```javascript
router.post('/videos', authMiddleware, upload.single('video'), async (req, res) => {
  const { titleFr, titleEn, descriptionFr, descriptionEn } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Video file required' });
  }
  
  const video = await Video.create({
    titleFr, titleEn, descriptionFr, descriptionEn,
    filename: req.file.filename,
    videoUrl: `/uploads/videos/${req.file.filename}`,
    fileSize: req.file.size
  });
  
  res.status(201).json({ success: true, data: video });
});
```

**AFTER (YouTube URL):**
```javascript
const { isValidYouTubeUrl, convertToEmbedUrl, extractVideoId } = require('../utils/youtubeHelpers');

router.post('/videos', authMiddleware, async (req, res) => {
  const { titleFr, titleEn, descriptionFr, descriptionEn, youtubeUrl, category, tags } = req.body;
  
  if (!youtubeUrl) {
    return res.status(400).json({ success: false, message: 'YouTube URL required' });
  }
  
  if (!isValidYouTubeUrl(youtubeUrl)) {
    return res.status(400).json({ success: false, message: 'Invalid YouTube URL format' });
  }
  
  const embedUrl = convertToEmbedUrl(youtubeUrl);
  const videoId = extractVideoId(youtubeUrl);
  
  const video = await Video.create({
    titleFr, titleEn, descriptionFr, descriptionEn,
    youtubeUrl: embedUrl,
    youtubeVideoId: videoId,
    category,
    tags: tags ? (Array.isArray(tags) ? tags : tags.split(',').map(t => t.trim())) : []
  });
  
  res.status(201).json({ success: true, data: video });
});
```

---

### PUT /api/admin/videos/:id
**Add YouTube URL validation:**
```javascript
router.put('/videos/:id', authMiddleware, async (req, res) => {
  const updateData = { ...req.body };
  
  // If youtubeUrl is being updated, validate and convert
  if (updateData.youtubeUrl) {
    if (!isValidYouTubeUrl(updateData.youtubeUrl)) {
      return res.status(400).json({ success: false, message: 'Invalid YouTube URL' });
    }
    updateData.youtubeUrl = convertToEmbedUrl(updateData.youtubeUrl);
    updateData.youtubeVideoId = extractVideoId(updateData.youtubeUrl);
  }
  
  const video = await Video.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
  
  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found' });
  }
  
  res.json({ success: true, data: video });
});
```

---

### DELETE /api/admin/videos/:id
**Remove file cleanup:**
```javascript
router.delete('/videos/:id', authMiddleware, async (req, res) => {
  const video = await Video.findByIdAndDelete(req.params.id);
  
  if (!video) {
    return res.status(404).json({ success: false, message: 'Video not found' });
  }
  
  // No file cleanup needed - just delete from DB
  res.json({ success: true, message: 'Video deleted' });
});
```

---

## 🖼️ STEP 4: UPDATE PARTNER ROUTES

### Update Multer Configuration
**BEFORE (Disk storage):**
```javascript
const storage = multer.diskStorage({
  destination: './uploads/partners',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, 'logo-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage, limits: { fileSize: 100 * 1024 * 1024 } });
```

**AFTER (Memory storage for base64):**
```javascript
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB for logos
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files allowed'));
    }
  }
});
```

---

### POST /api/admin/partners
**BEFORE (File storage):**
```javascript
router.post('/partners', authMiddleware, upload.single('logo'), async (req, res) => {
  const { name, websiteUrl } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Logo required' });
  }
  
  const partner = await Partner.create({
    name,
    logoUrl: `/uploads/partners/${req.file.filename}`,
    websiteUrl
  });
  
  res.status(201).json({ success: true, data: partner });
});
```

**AFTER (Base64 storage):**
```javascript
router.post('/partners', authMiddleware, upload.single('logo'), async (req, res) => {
  const { name, websiteUrl } = req.body;
  
  if (!req.file) {
    return res.status(400).json({ success: false, message: 'Logo required' });
  }
  
  // Convert image buffer to base64
  const base64Image = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  
  const partner = await Partner.create({
    name,
    logo: base64Image,
    logoMimeType: req.file.mimetype,
    websiteUrl
  });
  
  res.status(201).json({ success: true, data: partner });
});
```

---

### PUT /api/admin/partners/:id
**Add base64 conversion for new logos:**
```javascript
router.put('/partners/:id', authMiddleware, upload.single('logo'), async (req, res) => {
  const updateData = { ...req.body };
  
  // If new logo uploaded, convert to base64
  if (req.file) {
    updateData.logo = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
    updateData.logoMimeType = req.file.mimetype;
  }
  
  const partner = await Partner.findByIdAndUpdate(req.params.id, { $set: updateData }, { new: true });
  
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }
  
  res.json({ success: true, data: partner });
});
```

---

### DELETE /api/admin/partners/:id
**Remove file cleanup:**
```javascript
router.delete('/partners/:id', authMiddleware, async (req, res) => {
  const partner = await Partner.findByIdAndDelete(req.params.id);
  
  if (!partner) {
    return res.status(404).json({ success: false, message: 'Partner not found' });
  }
  
  // No file cleanup needed
  res.json({ success: true, message: 'Partner deleted' });
});
```

---

## 🌐 STEP 5: UPDATE CORS

Add new admin dashboard URL to CORS whitelist:

```javascript
const allowedOrigins = [
  'https://public-five-sepia-99.vercel.app',           // Frontend
  'https://07d27a3f.makeplus-admin.pages.dev',        // Admin (NEW) ⭐
  'https://512a93b6.makeplus-admin.pages.dev',        // Admin (OLD)
  'http://localhost:3000',
  'http://localhost:5173'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
```

---

## 🗑️ STEP 6: CLEANUP (Optional)

### Remove Old File Storage
If you have file storage directories:
```bash
rm -rf uploads/
rm -rf public/uploads/
```

### Remove File Serving Routes
If you have routes serving uploaded files:
```javascript
// REMOVE these:
app.use('/uploads', express.static('uploads'));
```

### Update package.json
If you have blob storage:
```bash
npm uninstall @vercel/blob
```

---

## 🚀 STEP 7: DEPLOY

### Test Locally First
```bash
# Set environment variables
MONGODB_URI=mongodb+srv://...
JWT_SECRET=your-secret
EMAIL_USER=your-email
EMAIL_PASS=your-password

# Start server
npm run dev

# Test video creation
curl -X POST http://localhost:3000/api/admin/videos \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "titleFr": "Test Video",
    "titleEn": "Test Video",
    "descriptionFr": "Description",
    "descriptionEn": "Description",
    "youtubeUrl": "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
  }'

# Should return: { success: true, data: { ... youtubeUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ", ... } }
```

---

### Deploy to Vercel
```bash
vercel --prod
```

**Or via Vercel Dashboard:**
1. Push changes to Git
2. Vercel auto-deploys
3. Check deployment logs

---

## ✅ STEP 8: VERIFY

### Test Video Endpoints
```bash
# Get videos (public)
curl https://makeplus-portfolio-backend.vercel.app/api/content/videos

# Should return videos with youtubeUrl field
```

### Test Partner Endpoints
```bash
# Get partners (public)
curl https://makeplus-portfolio-backend.vercel.app/api/content/partners

# Should return partners with logo field (base64)
```

### Test Admin Dashboard
1. Login: https://07d27a3f.makeplus-admin.pages.dev
2. Go to Videos → Add Video
3. Paste YouTube URL: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`
4. Fill in titles/descriptions
5. Click "Add Video"
6. Should appear in list with YouTube iframe

### Test Frontend
1. Visit: https://public-five-sepia-99.vercel.app
2. Videos should display as YouTube embeds
3. Partners should show logos (base64 images)

---

## 📊 DATABASE MIGRATION (Optional)

### If You Have Existing Videos

**Option 1: Fresh Start** ✅ Recommended
```javascript
// MongoDB Shell or Compass
db.videos.deleteMany({});
db.partners.deleteMany({});
```
Then re-add via admin dashboard with YouTube URLs.

**Option 2: Migrate Existing Data**
For each video:
1. Upload video to YouTube (unlisted)
2. Update MongoDB document:
```javascript
db.videos.updateOne(
  { _id: ObjectId("...") },
  { 
    $set: { 
      youtubeUrl: "https://www.youtube.com/embed/VIDEO_ID",
      youtubeVideoId: "VIDEO_ID"
    },
    $unset: { 
      filename: "", 
      videoUrl: "", 
      thumbnailUrl: "", 
      fileSize: "", 
      duration: "" 
    }
  }
);
```

---

## 🐛 TROUBLESHOOTING

### "Invalid YouTube URL" Error
- Make sure URL includes `youtube.com` or `youtu.be`
- Test with: `https://www.youtube.com/watch?v=dQw4w9WgXcQ`

### Videos Not Showing on Frontend
- Check video `isActive: true`
- Check YouTube video is "Unlisted" or "Public" (not Private)
- Check "Allow embedding" enabled on YouTube

### CORS Errors
- Add admin URL to CORS whitelist: `https://07d27a3f.makeplus-admin.pages.dev`
- Restart backend after CORS changes

### Base64 Images Too Large
- Logos should be < 5MB
- Compress images before upload
- Use PNG/JPEG (not SVG with base64)

---

## 📋 CHECKLIST

**Before Deployment:**
- [ ] Updated Video model
- [ ] Updated Partner model
- [ ] Created youtubeHelpers.js
- [ ] Updated video routes (POST, PUT, DELETE)
- [ ] Updated partner routes (POST, PUT, DELETE)
- [ ] Updated multer configuration
- [ ] Updated CORS whitelist
- [ ] Tested locally

**After Deployment:**
- [ ] Verified video creation works
- [ ] Verified partner creation works
- [ ] Tested admin dashboard
- [ ] Tested frontend website
- [ ] Cleared old database records (if needed)

---

## 💡 SUMMARY

**What Changed:**
- Videos: File uploads → YouTube URLs
- Partners: File storage → Base64 in MongoDB
- Multer: Disk storage → Memory storage (logos only)
- Routes: Multipart form data → JSON (videos only)

**What Stays Same:**
- Authentication (JWT)
- Stats management
- Contact form
- MongoDB connection
- All other endpoints

**Time Needed:** 30-45 minutes

**Testing Time:** 10-15 minutes

**Total:** ~1 hour

---

## 🆘 NEED HELP?

**Frontend URLs:**
- Website: https://public-five-sepia-99.vercel.app
- Admin: https://07d27a3f.makeplus-admin.pages.dev

**Backend URL:**
- API: https://makeplus-portfolio-backend.vercel.app

**Credentials:**
- Email: elaziziabdeldjalil@gmail.com
- Password: Admin123!Change

**Test YouTube URL:**
```
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```

---

**🎉 Good luck! This migration eliminates all file storage issues and provides unlimited, free video hosting via YouTube!**
