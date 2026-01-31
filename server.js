const express = require('express');
const path = require('path');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files from public directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve UI components (images, SVGs, fonts)
app.use('/assets/ui-components', express.static(path.join(__dirname, 'ui_components')));

// Main route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// API endpoint to list videos
app.get('/api/videos', (req, res) => {
  const videosPath = path.join(__dirname, 'public', 'assets', 'videos');
  
  // Create videos folder if it doesn't exist
  if (!fs.existsSync(videosPath)) {
    fs.mkdirSync(videosPath, { recursive: true });
  }
  
  try {
    const files = fs.readdirSync(videosPath);
    // Filter only video files
    const videoFiles = files.filter(file => 
      ['.mp4', '.webm', '.mov', '.avi'].includes(path.extname(file).toLowerCase())
    );
    res.json(videoFiles);
  } catch (error) {
    console.error('Error reading videos folder:', error);
    res.json([]);
  }
});

// API endpoints (for future use)
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Server is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).send('Page not found');
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Makeplus Portfolio Server running on http://localhost:${PORT}`);
  console.log(`📁 Serving static files from: ${path.join(__dirname, 'public')}`);
});
