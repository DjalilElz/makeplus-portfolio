# Video Optimization Guide for Makeplus Portfolio

## 🎥 Handling Large Videos (100MB+)

### Overview
This guide explains how to optimize large video files for fast, smooth playback on your website.

---

## 📋 Quick Start Checklist

1. **Compress videos** to reduce file size
2. **Generate poster images** (thumbnails)
3. **Place optimized videos** in `/public/assets/videos/`
4. **Update video list** in `main.js`
5. **Consider using a CDN** for large files

---

## 🛠️ Video Optimization Methods

### Method 1: FFmpeg Compression (Recommended)

FFmpeg is a free, powerful tool for video compression.

#### Installation:
- **Windows**: Download from [ffmpeg.org](https://ffmpeg.org/download.html)
- **Mac**: `brew install ffmpeg`
- **Linux**: `sudo apt-get install ffmpeg`

#### Compression Commands:

**High Quality (recommended for portfolio):**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -preset slow -c:a aac -b:a 128k output.mp4
```

**Balanced (good quality, smaller size):**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -preset medium -c:a aac -b:a 96k output.mp4
```

**Maximum Compression (smallest size):**
```bash
ffmpeg -i input.mp4 -c:v libx264 -crf 32 -preset fast -vf scale=1280:-2 -c:a aac -b:a 64k output.mp4
```

**Generate Poster Image:**
```bash
ffmpeg -i input.mp4 -ss 00:00:03 -vframes 1 poster.jpg
```

---

### Method 2: Online Tools (No Installation)

Use these free online tools:

1. **HandBrake** (Desktop app - easiest)
   - Download: [handbrake.fr](https://handbrake.fr/)
   - Use "Web" preset
   - Target file size: 20-50MB per video

2. **Cloudinary** (Online service)
   - Free tier: [cloudinary.com](https://cloudinary.com/)
   - Auto-optimizes videos
   - Provides CDN delivery

3. **Online Video Converter**
   - [freeconvert.com](https://www.freeconvert.com/video-compressor)
   - No installation needed
   - Adjust quality slider to reduce size

---

### Method 3: Use External Hosting

For very large files, host videos externally:

#### **YouTube/Vimeo** (Free)
```javascript
// Update video configuration in main.js:
const videos = [
    {
        title: 'Project 1',
        titleFr: 'Projet 1',
        type: 'youtube', // or 'vimeo'
        src: 'https://www.youtube.com/embed/VIDEO_ID',
        poster: '/assets/videos/poster1.jpg'
    }
];
```

#### **AWS S3 / CloudFront** (Paid but professional)
- Upload videos to S3
- Use CloudFront CDN for fast global delivery
- Configure CORS for video playback

---

## 📂 File Structure

Place your optimized videos here:

```
public/
  assets/
    videos/
      video1.mp4          # Optimized video 1 (20-50MB)
      poster1.jpg         # Thumbnail for video 1
      video2.mp4          # Optimized video 2
      poster2.jpg         # Thumbnail for video 2
      video3.mp4          # Optimized video 3
      poster3.jpg         # Thumbnail for video 3
```

---

## ⚙️ Configuration in main.js

Update the `videos` array in `/public/js/main.js`:

```javascript
const videos = [
    {
        title: 'Event Coverage 2024',
        titleFr: 'Couverture Événement 2024',
        src: '/assets/videos/video1.mp4',
        poster: '/assets/videos/poster1.jpg',
        quality: 'auto'
    },
    {
        title: 'Medical Conference',
        titleFr: 'Conférence Médicale',
        src: '/assets/videos/video2.mp4',
        poster: '/assets/videos/poster2.jpg',
        quality: 'auto'
    },
    // Add more videos...
];
```

---

## 🚀 Performance Optimizations

### Built-in Features:

1. **Lazy Loading**: Videos load only when needed
2. **Metadata Preloading**: Only metadata loads initially (not full video)
3. **Poster Images**: Show immediately for visual feedback
4. **Progressive Loading**: Videos stream as they play
5. **Loading Indicators**: Show spinner while buffering

### Additional Recommendations:

#### 1. **Create Multiple Quality Versions**
```bash
# 1080p (High)
ffmpeg -i input.mp4 -c:v libx264 -crf 23 -s 1920x1080 video_1080p.mp4

# 720p (Medium)
ffmpeg -i input.mp4 -c:v libx264 -crf 25 -s 1280x720 video_720p.mp4

# 480p (Low)
ffmpeg -i input.mp4 -c:v libx264 -crf 28 -s 854x480 video_480p.mp4
```

#### 2. **Optimize Poster Images**
```bash
# Create optimized posters
ffmpeg -i video.mp4 -ss 00:00:03 -vframes 1 -vf scale=400:-1 poster.jpg
```

#### 3. **Use Modern Video Codecs**
```bash
# H.265/HEVC (better compression, newer browsers)
ffmpeg -i input.mp4 -c:v libx265 -crf 28 -preset medium output.mp4
```

---

## 📊 Recommended Video Specs

| Aspect | Recommendation |
|--------|----------------|
| **Resolution** | 1920x1080 (1080p) max |
| **Bitrate** | 2-5 Mbps |
| **File Size** | 20-50 MB target |
| **Format** | MP4 (H.264) |
| **Audio** | AAC, 128kbps |
| **Frame Rate** | 30 fps |
| **Codec** | H.264 (libx264) |

---

## 🔧 Troubleshooting

### Videos Take Too Long to Load
- ✅ Reduce file size further (use CRF 28-32)
- ✅ Lower resolution (720p instead of 1080p)
- ✅ Use a CDN (Cloudflare, AWS CloudFront)

### Videos Don't Play on Mobile
- ✅ Ensure MP4/H.264 format
- ✅ Add `playsinline` attribute (already included)
- ✅ Test on actual mobile devices

### Poor Video Quality
- ✅ Lower CRF value (18-23 for higher quality)
- ✅ Use slower preset (`-preset slow`)
- ✅ Increase bitrate

---

## 📱 Mobile Optimization

The carousel automatically adapts:
- **Desktop**: Shows 5 thumbnails
- **Tablet**: Shows 3 thumbnails  
- **Mobile**: Shows 2 thumbnails
- Controls always visible on mobile for better UX

---

## 🌐 CDN Setup (Optional but Recommended)

### Using Cloudflare (Free):
1. Sign up at [cloudflare.com](https://cloudflare.com)
2. Add your domain
3. Upload videos to server
4. Cloudflare auto-caches and optimizes

### Using Bunny CDN (Affordable):
1. Sign up at [bunny.net](https://bunny.net)
2. Create storage zone
3. Upload videos
4. Update video URLs in `main.js`

---

## ✅ Final Checklist

Before going live:

- [ ] All videos compressed to under 50MB
- [ ] Poster images generated for all videos
- [ ] Videos placed in `/public/assets/videos/`
- [ ] Video list updated in `main.js`
- [ ] Tested on desktop browser
- [ ] Tested on mobile device
- [ ] Checked loading times on slow connection
- [ ] Verified all videos play correctly
- [ ] Thumbnails display properly

---

## 📧 Need Help?

If videos are still too large or slow:
1. Try more aggressive compression (CRF 30+)
2. Reduce resolution to 720p
3. Consider external hosting (YouTube, Vimeo)
4. Use a professional CDN service

---

**🎬 Your video carousel is now ready with modern animations and optimized performance!**
