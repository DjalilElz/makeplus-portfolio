# 📖 Admin User Guide - How to Upload Videos & Access Admin Panel

## 🔐 How to Access the Admin Page

### Step 1: Open the Admin Panel
**Admin Panel URL:**
```
https://98be4a70.makeplus-portfolio.pages.dev/admin
```
*(Note: Once you have a custom domain, this will be: `https://wemakeplus.com/admin`)*

### Step 2: Login Credentials
- **Email:** `elaziziabdeldjalil@gmail.com`
- **Password:** `Admin123!Change`

⚠️ **IMPORTANT:** Change this password immediately after first login!

---

## 🎥 How to Upload Videos

### Method 1: Using the Admin Dashboard (Recommended)

#### Step 1: Login to Admin Panel
1. Go to: `https://98be4a70.makeplus-portfolio.pages.dev/admin`
2. Enter your email and password
3. Click "Login"

#### Step 2: Navigate to Videos Section
1. Click on **"Videos"** in the sidebar
2. You'll see a list of all current videos

#### Step 3: Upload New Video
1. Click the **"Upload Video"** button
2. Fill in the form:
   - **Video File:** Click "Choose File" and select your MP4 video (max 100MB)
   - **Thumbnail Image:** Upload a preview image (optional, max 5MB)
   - **French Title:** Enter the video title in French
   - **English Title:** Enter the video title in English
   - **French Description:** Brief description in French
   - **English Description:** Brief description in English
3. Click **"Upload"** button
4. Wait for upload to complete (may take 1-2 minutes for large videos)
5. Video will appear in your video list

#### Step 4: Manage Videos
- **Reorder:** Drag and drop videos to change their order on the website
- **Edit:** Click the edit icon to update title/description
- **Delete:** Click the trash icon to remove a video permanently
- **Toggle Active:** Switch videos on/off without deleting them

---

### Method 2: Using API Directly (For Developers)

#### Step 1: Get Authentication Token
```bash
curl -X POST https://makeplusportfoliobackend-production.up.railway.app/api/admin/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "elaziziabdeldjalil@gmail.com",
    "password": "Admin123!Change"
  }'
```

**Response:**
```json
{
  "success": true,
  "data": {
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
  }
}
```

Copy the `token` value.

#### Step 2: Upload Video via API
```bash
curl -X POST https://makeplusportfoliobackend-production.up.railway.app/api/admin/videos \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "video=@/path/to/your/video.mp4" \
  -F "thumbnail=@/path/to/thumbnail.jpg" \
  -F "titleFr=Mon Projet Vidéo" \
  -F "titleEn=My Video Project" \
  -F "descriptionFr=Description en français" \
  -F "descriptionEn=English description"
```

#### Step 3: Verify Upload
```bash
curl https://makeplusportfoliobackend-production.up.railway.app/api/content/videos
```

---

## 📋 Current Videos to Upload

You have **7 videos** stored locally at:
```
E:\makeplus portfolio\public\assets\videos\
```

**Files to upload:**
1. `AAIC 2024.mp4` (104MB)
2. `ANOL 2022.mp4` (91MB)
3. `AOPA 2025.mp4` (86MB)
4. `MARATHON SALIMA.mp4` (89MB)
5. `ORL CNG.mp4` (93MB)
6. `SAR(1).mp4` (59MB)
7. `TIK TO'PH.mp4` (97MB)

### Upload Checklist:
- [ ] Login to admin panel
- [ ] Upload AAIC 2024.mp4 with French/English titles
- [ ] Upload ANOL 2022.mp4 with French/English titles
- [ ] Upload AOPA 2025.mp4 with French/English titles
- [ ] Upload MARATHON SALIMA.mp4 with French/English titles
- [ ] Upload ORL CNG.mp4 with French/English titles
- [ ] Upload SAR(1).mp4 with French/English titles
- [ ] Upload TIK TO'PH.mp4 with French/English titles
- [ ] Verify videos appear on homepage
- [ ] Test video playback
- [ ] Reorder videos as desired

---

## 🎛️ Admin Panel Features

### 1. Dashboard Overview
- **Total Videos:** Count of uploaded videos
- **Total Contacts:** Number of contact form submissions
- **Recent Activity:** Latest admin actions

### 2. Video Management
- **Upload:** Add new videos with bilingual titles/descriptions
- **Edit:** Update video metadata
- **Delete:** Remove videos permanently
- **Reorder:** Drag-and-drop to change display order
- **Toggle Active:** Show/hide videos without deleting

### 3. Statistics Editor
Update homepage numbers:
- **International Congress:** Number of events
- **Symposiums:** Number of symposiums organized
- **Satisfied Companies:** Number of happy clients

### 4. Partner Management
- **Upload Logos:** Add partner company logos
- **Reorder:** Change logo display order
- **Edit:** Update partner information
- **Delete:** Remove partners

### 5. Contact Submissions
- **View All:** See all contact form submissions
- **Filter:** By status (new, read, replied)
- **Mark as Read:** Track which submissions you've reviewed
- **Delete:** Remove old submissions

---

## 🔒 Security Best Practices

### Change Default Password
1. Login to admin panel
2. Go to **Settings** → **Change Password**
3. Enter current password: `Admin123!Change`
4. Enter new strong password (min 8 chars, uppercase, lowercase, number, special char)
5. Confirm new password
6. Click **Update Password**

### Secure Your Session
- **Always logout** when done
- **Don't share** your login credentials
- **Use strong password** (at least 12 characters)
- **Enable 2FA** if available in future updates

### Monitor Activity
- Check **Recent Activity** log regularly
- Review **Failed Login Attempts**
- Report suspicious activity immediately

---

## 🚨 Troubleshooting

### Problem: Can't Access Admin Panel
**Solution:**
- Clear browser cache and cookies
- Try incognito/private browsing mode
- Verify URL is correct: `/admin`
- Check if you're using the correct email/password

### Problem: Video Upload Fails
**Possible Causes:**
1. **File too large** → Max 100MB per video
   - Solution: Compress video using HandBrake or similar tool
2. **Wrong format** → Only MP4 supported
   - Solution: Convert video to MP4 format
3. **Slow internet** → Upload timing out
   - Solution: Try uploading during off-peak hours
4. **Storage limit reached** → R2 bucket full
   - Solution: Delete old unused videos first

### Problem: Token Expired
**Solution:**
- Login again to get fresh token
- Tokens expire after 30 days of inactivity

### Problem: Video Not Showing on Website
**Checklist:**
- [ ] Video marked as "Active" in admin panel
- [ ] Video upload completed successfully
- [ ] Clear browser cache (Ctrl + F5)
- [ ] Check if video is in correct order
- [ ] Verify video URL in database

---

## 📞 API Endpoints Summary

### Backend API URL:
```
https://makeplusportfoliobackend-production.up.railway.app
```

### Quick Reference:

**Login:**
```
POST /api/admin/login
Body: { email, password }
```

**Upload Video:**
```
POST /api/admin/videos
Headers: { Authorization: Bearer {token} }
Form Data: video, thumbnail, titleFr, titleEn, descriptionFr, descriptionEn
```

**List Videos:**
```
GET /api/admin/videos
Headers: { Authorization: Bearer {token} }
```

**Delete Video:**
```
DELETE /api/admin/videos/:id
Headers: { Authorization: Bearer {token} }
```

**Update Stats:**
```
PUT /api/admin/stats
Headers: { Authorization: Bearer {token} }
Body: { internationalCongress, symposium, satisfiedCompanies }
```

---

## 🎓 Step-by-Step: First Time Setup

### For Non-Technical Users:

#### Step 1: Access Admin Panel
1. Open your browser (Chrome, Firefox, Safari)
2. Type this URL: `https://98be4a70.makeplus-portfolio.pages.dev/admin`
3. Press Enter

#### Step 2: Login
1. You'll see a login page with Makeplus branding
2. Enter email: `elaziziabdeldjalil@gmail.com`
3. Enter password: `Admin123!Change`
4. Click the "Login" button

#### Step 3: Change Password (Important!)
1. Once logged in, click your profile icon (top right)
2. Select "Change Password"
3. Enter current password: `Admin123!Change`
4. Choose a new strong password
5. Click "Update Password"

#### Step 4: Upload Your First Video
1. Click "Videos" in the left sidebar
2. Click the big blue "+ Upload Video" button
3. Click "Choose File" next to "Video File"
4. Find your video on your computer (in `E:\makeplus portfolio\public\assets\videos\`)
5. Select one video (e.g., `AAIC 2024.mp4`)
6. Fill in the form:
   - **French Title:** Example: "Congrès AAIC 2024"
   - **English Title:** Example: "AAIC Congress 2024"
   - **French Description:** Example: "Événement médical international"
   - **English Description:** Example: "International medical event"
7. Click the "Upload" button at the bottom
8. Wait for the green success message (1-2 minutes)
9. Your video will appear in the list!

#### Step 5: View on Website
1. Open a new tab
2. Go to: `https://98be4a70.makeplus-portfolio.pages.dev`
3. Scroll down to the "Nos Réalisations" section
4. Your video should be there!

#### Step 6: Upload Remaining Videos
Repeat Step 4 for each of these videos:
- ANOL 2022.mp4
- AOPA 2025.mp4
- MARATHON SALIMA.mp4
- ORL CNG.mp4
- SAR(1).mp4
- TIK TO'PH.mp4

---

## 💡 Tips for Better Video Management

### Video Naming Convention
Use clear, descriptive titles:
- ❌ Bad: "Video 1", "New Project"
- ✅ Good: "AAIC Congress 2024", "Sanofi Symposium Paris"

### Optimal Video Settings
Before uploading, optimize your videos:
- **Format:** MP4 (H.264 codec)
- **Resolution:** 1920x1080 (Full HD) or 1280x720 (HD)
- **Bitrate:** 5-8 Mbps for good quality at reasonable file size
- **Duration:** Keep under 3 minutes for better engagement

### Creating Thumbnails
A good thumbnail helps users decide to watch:
- **Size:** 1280x720 pixels (16:9 ratio)
- **Format:** JPG or PNG
- **Content:** Show key moment from video
- **Text:** Optional overlay with event name

### Organizing Videos
Order videos by:
- **Most recent first** (recommended)
- **Most important/impressive first**
- **By client name** (alphabetical)
- **By event type** (congresses, symposiums, etc.)

---

## 📊 Understanding Your Dashboard

### Key Metrics Explained

**Total Videos:**
- Shows number of uploaded videos
- Includes both active and inactive videos
- Green = Active, Gray = Inactive

**Total Contacts:**
- Number of contact form submissions
- New = Unread, Blue = Read, Green = Replied

**Storage Used:**
- Shows how much of your 10GB R2 storage is used
- Videos are stored in Cloudflare R2
- Alert when reaching 80% capacity

**Monthly Views:**
- Number of times your videos were played
- Resets on the 1st of each month
- Helps track engagement

---

## ✅ Admin Panel Checklist

### Daily Tasks:
- [ ] Check new contact form submissions
- [ ] Reply to urgent inquiries
- [ ] Monitor video performance

### Weekly Tasks:
- [ ] Review video order/visibility
- [ ] Update statistics if needed
- [ ] Check for failed uploads

### Monthly Tasks:
- [ ] Upload new project videos
- [ ] Archive old videos if needed
- [ ] Update partner logos
- [ ] Review storage usage
- [ ] Check security logs

---

## 🆘 Need Help?

### Common Questions:

**Q: Can I upload videos larger than 100MB?**
A: Not directly. Compress the video first using free tools like HandBrake.

**Q: What video formats are supported?**
A: Only MP4 format. Convert other formats (AVI, MOV, WMV) to MP4 first.

**Q: How many videos can I upload?**
A: Up to 10GB total storage (approximately 100 videos at 100MB each).

**Q: Can I delete videos?**
A: Yes! Click the trash icon next to any video. This is permanent.

**Q: How do I reorder videos?**
A: Drag and drop videos in the admin panel to change their order.

**Q: Can I hide videos without deleting?**
A: Yes! Toggle the "Active" switch to hide/show videos.

**Q: Where are videos stored?**
A: In Cloudflare R2 (cloud storage), not on your computer.

**Q: Can I download videos from the admin panel?**
A: Yes, click the download icon next to each video.

---

## 🔗 Important Links

- **Live Website:** https://98be4a70.makeplus-portfolio.pages.dev
- **Admin Panel:** https://98be4a70.makeplus-portfolio.pages.dev/admin
- **Backend API:** https://makeplusportfoliobackend-production.up.railway.app
- **API Documentation:** See `FRONTEND_INTEGRATION.md`
- **Technical Docs:** See `BACKEND_SPECIFICATION.md`

---

## 📧 Contact Support

For technical issues with the admin panel:
- **Email:** contact@makeplus.com
- **Response Time:** Within 24-48 hours

For urgent issues:
- Check the troubleshooting section above
- Review API_QUICK_REFERENCE.md
- Contact your developer

---

**Last Updated:** February 2, 2026
**Version:** 1.0
