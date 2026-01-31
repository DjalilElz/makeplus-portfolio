# 🎬 Quick Video Setup Guide

## ⚡ Fast Track (5 Minutes)

### Step 1: Compress Videos
Use **HandBrake** (easiest):
1. Download: https://handbrake.fr/
2. Open your video
3. Select "Web" preset
4. Click "Start"
5. Result: ~90% size reduction!

### Step 2: Generate Thumbnails
Use **FFmpeg** command:
```bash
ffmpeg -i your-video.mp4 -ss 00:00:03 -vframes 1 poster.jpg
```

Or use VLC Player:
1. Open video in VLC
2. Pause at desired frame
3. Video → Take Snapshot

### Step 3: Place Files
```
public/assets/videos/
  ├── video1.mp4       ← Your compressed video
  ├── poster1.jpg      ← Your thumbnail
  ├── video2.mp4
  ├── poster2.jpg
  └── ...
```

### Step 4: Update Code
Edit `public/js/main.js` - find this section:
```javascript
const videos = [
    {
        title: 'Your Video Title',
        titleFr: 'Votre Titre de Vidéo',
        src: '/assets/videos/video1.mp4',
        poster: '/assets/videos/poster1.jpg',
        quality: 'auto'
    }
    // Add more videos...
];
```

### Step 5: Test
1. Refresh your page
2. Videos should appear in carousel
3. Click thumbnail to switch videos
4. Use arrow buttons to navigate

---

## 🚀 Features Included

✅ **Modern Carousel** - Swipe through videos with smooth animations
✅ **Custom Player** - Play/pause, seek, fullscreen controls
✅ **Lazy Loading** - Videos load only when needed
✅ **Mobile Optimized** - Works perfectly on phones/tablets
✅ **Loading Indicators** - Shows spinner while buffering
✅ **Bilingual** - Supports French & English titles

---

## 💡 Pro Tips

### For Best Performance:
- Keep videos under **50MB** each
- Use **1920x1080** or **1280x720** resolution
- Format: **MP4 (H.264 codec)**
- Generate **small poster images** (400x225px)

### For Very Large Videos (100MB+):
Consider using:
- **YouTube** (embed videos) - Free
- **Vimeo** (private videos) - Free/Paid
- **Cloudinary** (auto-optimization) - Free tier available

### Quick FFmpeg Commands:

**Compress to 720p:**
```bash
ffmpeg -i input.mp4 -vf scale=1280:720 -c:v libx264 -crf 28 output.mp4
```

**Compress aggressively:**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 32 -preset fast output.mp4
```

**Create thumbnail:**
```bash
ffmpeg -i video.mp4 -ss 00:00:05 -vframes 1 poster.jpg
```

---

## 🎯 Target Specifications

| Setting | Value |
|---------|-------|
| Format | MP4 |
| Codec | H.264 |
| Resolution | 1920x1080 |
| File Size | 20-50 MB |
| Bitrate | 2-5 Mbps |
| Audio | AAC, 128kbps |

---

## 🆘 Common Issues

**Video won't play?**
- Ensure it's MP4 format with H.264 codec
- Check file path in main.js
- Clear browser cache

**Too slow to load?**
- Compress more (use CRF 30+)
- Reduce resolution to 720p
- Consider external hosting

**Thumbnail not showing?**
- Check poster path in main.js
- Ensure JPG format
- Verify file exists in videos folder

---

## 📖 Full Documentation

For complete instructions, see:
**VIDEO_OPTIMIZATION_GUIDE.md** in project root

---

**🎬 Ready to go! Add your videos and enjoy the modern carousel!**
