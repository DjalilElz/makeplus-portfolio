# Makeplus Portfolio - Backend Specification Document

## Project Overview
Backend API for the Makeplus portfolio website with:
1. **Contact form handling** - Email notifications sent to contact@makeplus.com
2. **Admin Dashboard** - Secure panel to manage portfolio content (videos, stats, partners)
3. **Content Management** - Dynamic updates without code changes

---

## Technology Stack

### Core Framework
- **Node.js** (v18+ recommended)
- **Express.js** (v4.x) - Web framework
- **TypeScript** (optional but recommended)

### Essential Packages
```json
{
  "dependencies": {
    "express": "^4.18.2",
    "cors": "^2.8.5",
    "helmet": "^7.1.0",
    "dotenv": "^16.3.1",
    "express-rate-limit": "^7.1.5",
    "express-validator": "^7.0.1",
    "nodemailer": "^6.9.7",
    "mongoose": "^8.0.3",
    "bcryptjs": "^2.4.3",
    "jsonwebtoken": "^9.0.2",
    "multer": "^1.4.5-lts.1",
    "sharp": "^0.33.1",
    "cookie-parser": "^1.4.6"
  },
  "devDependencies": {
    "nodemon": "^3.0.2"
  }
}
```

---

## API Endpoints

### Public Endpoints

#### 1. POST /api/contact
**Purpose**: Handle contact form submissions - sends email to contact@makeplus.com

**Request Body**:
```json
{
  "name": "string (required, 2-100 chars)",
  "email": "string (required, valid email format)",
  "phone": "string (optional, 10-20 chars)",
  "company": "string (optional, max 100 chars)",
  "subject": "string (required, 3-200 chars)",
  "message": "string (required, 10-2000 chars)",
  "language": "string (fr or en, default: fr)"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Message envoyé avec succès",
  "data": {
    "id": "unique_submission_id",
    "timestamp": "2026-01-31T10:30:00.000Z"
  }
}
```

**Response Error (400)**:
```json
{
  "success": false,
  "message": "Validation error",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

**Response Error (429 - Rate Limit)**:
```json
{
  "success": false,
  "message": "Too many requests. Please try again later."
}
```

**Response Error (500)**:
```json
{
  "success": false,
  "message": "Server error. Please try again later."
}
```

#### 2. GET /api/health
**Purpose**: Health check endpoint

**Response (200)**:
```json
{
  "status": "healthy",
  "timestamp": "2026-01-31T10:30:00.000Z",
  "uptime": 3600
}
```

#### 3. GET /api/content/stats
**Purpose**: Get current statistics for the website

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "internationalCongress": 11,
    "symposium": 24,
    "satisfiedCompanies": 28
  }
}
```

#### 4. GET /api/content/videos
**Purpose**: Get list of portfolio videos

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "video_id",
      "title": "Event Video 2025",
      "titleFr": "Vidéo Événement 2025",
      "titleEn": "Event Video 2025",
      "filename": "event-2025.mp4",
      "thumbnail": "event-2025-thumb.jpg",
      "order": 1,
      "isActive": true,
      "createdAt": "2026-01-15T10:00:00.000Z"
    }
  ]
}
```

#### 5. GET /api/content/partners
**Purpose**: Get list of partner logos

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "partner_id",
      "name": "Sanofi",
      "logo": "/assets/partners/sanofi.svg",
      "order": 1,
      "isActive": true
    }
  ]
}
```

---

### Admin Endpoints (Protected - Require Authentication)

#### Authentication Endpoints

##### POST /api/admin/login
**Purpose**: Admin authentication

**Request Body**:
```json
{
  "email": "admin@makeplus.com",
  "password": "secure_password"
}
```

**Response Success (200)**:
```json
{
  "success": true,
  "message": "Login successful",
  "data": {
    "token": "jwt_token_here",
    "admin": {
      "id": "admin_id",
      "email": "admin@makeplus.com",
      "name": "Admin Name"
    }
  }
}
```

**Response Error (401)**:
```json
{
  "success": false,
  "message": "Invalid credentials"
}
```

##### POST /api/admin/logout
**Purpose**: Admin logout (invalidate token)

**Response (200)**:
```json
{
  "success": true,
  "message": "Logged out successfully"
}
```

##### GET /api/admin/me
**Purpose**: Get current admin info (verify token)

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "id": "admin_id",
    "email": "admin@makeplus.com",
    "name": "Admin Name"
  }
}
```

---

#### Statistics Management

##### GET /api/admin/stats
**Purpose**: Get all statistics

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "_id": "stats_id",
    "internationalCongress": { "value": 11, "labelFr": "Congrés Internationale", "labelEn": "International Congress" },
    "symposium": { "value": 24, "labelFr": "Symposium", "labelEn": "Symposium" },
    "satisfiedCompanies": { "value": 28, "labelFr": "Societé satisfait", "labelEn": "Satisfied Companies" },
    "updatedAt": "2026-01-31T10:00:00.000Z",
    "updatedBy": "admin_id"
  }
}
```

##### PUT /api/admin/stats
**Purpose**: Update statistics

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "internationalCongress": { "value": 15, "labelFr": "Congrés Internationale", "labelEn": "International Congress" },
  "symposium": { "value": 30, "labelFr": "Symposium", "labelEn": "Symposium" },
  "satisfiedCompanies": { "value": 35, "labelFr": "Societé satisfait", "labelEn": "Satisfied Companies" }
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Statistics updated successfully",
  "data": { /* updated stats object */ }
}
```

---

#### Video Management

##### GET /api/admin/videos
**Purpose**: Get all videos (including inactive)

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "video_id",
      "title": "Event Video",
      "titleFr": "Vidéo Événement",
      "titleEn": "Event Video",
      "description": "Description here",
      "descriptionFr": "Description ici",
      "descriptionEn": "Description here",
      "filename": "video.mp4",
      "originalFilename": "original-name.mp4",
      "thumbnail": "video-thumb.jpg",
      "duration": 120,
      "fileSize": 15000000,
      "order": 1,
      "isActive": true,
      "createdAt": "2026-01-15T10:00:00.000Z",
      "updatedAt": "2026-01-20T10:00:00.000Z"
    }
  ]
}
```

##### POST /api/admin/videos
**Purpose**: Upload a new video

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (FormData)**:
```
video: [video file]
thumbnail: [image file] (optional - auto-generated if not provided)
titleFr: "Titre en français"
titleEn: "Title in English"
descriptionFr: "Description en français"
descriptionEn: "Description in English"
order: 1
isActive: true
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Video uploaded successfully",
  "data": { /* video object */ }
}
```

##### PUT /api/admin/videos/:id
**Purpose**: Update video details

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "titleFr": "Nouveau titre",
  "titleEn": "New title",
  "descriptionFr": "Nouvelle description",
  "descriptionEn": "New description",
  "order": 2,
  "isActive": true
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Video updated successfully",
  "data": { /* updated video object */ }
}
```

##### DELETE /api/admin/videos/:id
**Purpose**: Delete a video

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Video deleted successfully"
}
```

##### PUT /api/admin/videos/reorder
**Purpose**: Reorder videos

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "videos": [
    { "id": "video_id_1", "order": 1 },
    { "id": "video_id_2", "order": 2 },
    { "id": "video_id_3", "order": 3 }
  ]
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Videos reordered successfully"
}
```

---

#### Partner Management

##### GET /api/admin/partners
**Purpose**: Get all partners

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "data": [
    {
      "_id": "partner_id",
      "name": "Sanofi",
      "logo": "/assets/partners/sanofi.svg",
      "website": "https://sanofi.com",
      "order": 1,
      "isActive": true,
      "createdAt": "2026-01-10T10:00:00.000Z"
    }
  ]
}
```

##### POST /api/admin/partners
**Purpose**: Add a new partner

**Headers**: 
- `Authorization: Bearer <token>`
- `Content-Type: multipart/form-data`

**Request Body (FormData)**:
```
logo: [image/svg file]
name: "Partner Name"
website: "https://partner.com" (optional)
order: 1
isActive: true
```

**Response (201)**:
```json
{
  "success": true,
  "message": "Partner added successfully",
  "data": { /* partner object */ }
}
```

##### PUT /api/admin/partners/:id
**Purpose**: Update partner

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "name": "Updated Name",
  "website": "https://updated-site.com",
  "order": 2,
  "isActive": true
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Partner updated successfully",
  "data": { /* updated partner object */ }
}
```

##### DELETE /api/admin/partners/:id
**Purpose**: Delete a partner

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Partner deleted successfully"
}
```

---

#### Contact Submissions Management

##### GET /api/admin/contacts
**Purpose**: Get all contact submissions

**Headers**: `Authorization: Bearer <token>`

**Query Parameters**:
- `page`: Page number (default: 1)
- `limit`: Items per page (default: 20)
- `status`: Filter by status (new, read, replied, archived)
- `search`: Search in name, email, subject

**Response (200)**:
```json
{
  "success": true,
  "data": {
    "contacts": [
      {
        "_id": "contact_id",
        "name": "John Doe",
        "email": "john@example.com",
        "phone": "+213 XXX XXX",
        "company": "Company Name",
        "subject": "Event Request",
        "message": "Message content...",
        "status": "new",
        "createdAt": "2026-01-31T10:00:00.000Z"
      }
    ],
    "pagination": {
      "currentPage": 1,
      "totalPages": 5,
      "totalItems": 100,
      "itemsPerPage": 20
    }
  }
}
```

##### GET /api/admin/contacts/:id
**Purpose**: Get single contact submission detail

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "data": { /* full contact object */ }
}
```

##### PUT /api/admin/contacts/:id/status
**Purpose**: Update contact status

**Headers**: `Authorization: Bearer <token>`

**Request Body**:
```json
{
  "status": "read" // or "replied", "archived"
}
```

**Response (200)**:
```json
{
  "success": true,
  "message": "Status updated successfully"
}
```

##### DELETE /api/admin/contacts/:id
**Purpose**: Delete a contact submission

**Headers**: `Authorization: Bearer <token>`

**Response (200)**:
```json
{
  "success": true,
  "message": "Contact deleted successfully"
}
```

---

## Database Schemas (MongoDB)

### 1. Admin Schema
```javascript
const AdminSchema = new mongoose.Schema({
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 8
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  role: {
    type: String,
    enum: ['superadmin', 'admin'],
    default: 'admin'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastLogin: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Password hashing before save
AdminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Password comparison method
AdminSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### 2. Contact Submissions Schema
```javascript
const ContactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  company: {
    type: String,
    trim: true,
    maxlength: 100
  },
  subject: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  message: {
    type: String,
    required: true,
    maxlength: 2000
  },
  language: {
    type: String,
    enum: ['fr', 'en'],
    default: 'fr'
  },
  status: {
    type: String,
    enum: ['new', 'read', 'replied', 'archived'],
    default: 'new'
  },
  ipAddress: String,
  userAgent: String,
  emailSent: {
    type: Boolean,
    default: false
  },
  emailSentAt: Date,
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Indexes
ContactSchema.index({ email: 1 });
ContactSchema.index({ status: 1 });
ContactSchema.index({ createdAt: -1 });
```

### 3. Statistics Schema
```javascript
const StatsSchema = new mongoose.Schema({
  internationalCongress: {
    value: { type: Number, default: 0 },
    labelFr: { type: String, default: 'Congrés Internationale' },
    labelEn: { type: String, default: 'International Congress' }
  },
  symposium: {
    value: { type: Number, default: 0 },
    labelFr: { type: String, default: 'Symposium' },
    labelEn: { type: String, default: 'Symposium' }
  },
  satisfiedCompanies: {
    value: { type: Number, default: 0 },
    labelFr: { type: String, default: 'Societé satisfait' },
    labelEn: { type: String, default: 'Satisfied Companies' }
  },
  // Add more stats as needed
  customStats: [{
    key: String,
    value: Number,
    labelFr: String,
    labelEn: String,
    order: Number,
    isActive: { type: Boolean, default: true }
  }],
  updatedAt: {
    type: Date,
    default: Date.now
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});
```

### 4. Video Schema
```javascript
const VideoSchema = new mongoose.Schema({
  titleFr: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  titleEn: {
    type: String,
    required: true,
    trim: true,
    maxlength: 200
  },
  descriptionFr: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  descriptionEn: {
    type: String,
    trim: true,
    maxlength: 1000
  },
  filename: {
    type: String,
    required: true
  },
  originalFilename: String,
  thumbnail: String,
  duration: Number, // in seconds
  fileSize: Number, // in bytes
  mimeType: String,
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin'
  }
});

// Index for ordering
VideoSchema.index({ order: 1, createdAt: -1 });
```

### 5. Partner Schema
```javascript
const PartnerSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100
  },
  logo: {
    type: String,
    required: true
  },
  originalFilename: String,
  website: {
    type: String,
    trim: true
  },
  order: {
    type: Number,
    default: 0
  },
  isActive: {
    type: Boolean,
    default: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Index for ordering
PartnerSchema.index({ order: 1 });
```

---

## Email Configuration

### Admin Email for Contact Submissions
**All contact form submissions must be sent to: contact@makeplus.com**

### Email Service
Use **Nodemailer** with SMTP or email service provider:
- Gmail SMTP
- SendGrid
- Mailgun
- Amazon SES
- **Recommended for production**: Use a professional email service with the makeplus.com domain

### Email Templates

#### 1. Notification Email (to contact@makeplus.com)
**To**: contact@makeplus.com
**Subject**: `[Makeplus Contact] ${subject}`

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #872c7a, #9333ea); color: white; padding: 20px; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 20px; border-radius: 0 0 8px 8px; }
    .field { margin-bottom: 15px; }
    .label { font-weight: bold; color: #872c7a; }
    .value { margin-top: 5px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>New Contact Form Submission</h2>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Name:</div>
        <div class="value">${name}</div>
      </div>
      <div class="field">
        <div class="label">Email:</div>
        <div class="value">${email}</div>
      </div>
      <div class="field">
        <div class="label">Phone:</div>
        <div class="value">${phone || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Company:</div>
        <div class="value">${company || 'Not provided'}</div>
      </div>
      <div class="field">
        <div class="label">Subject:</div>
        <div class="value">${subject}</div>
      </div>
      <div class="field">
        <div class="label">Message:</div>
        <div class="value">${message}</div>
      </div>
      <hr>
      <p style="color: #666; font-size: 12px;">
        Submitted on: ${new Date().toLocaleString()}<br>
        IP Address: ${ipAddress}
      </p>
    </div>
  </div>
</body>
</html>
```

#### 2. Auto-Reply Email (to user)
**Subject**: 
- FR: `Merci pour votre message - Makeplus`
- EN: `Thank you for your message - Makeplus`

**Template**:
```html
<!DOCTYPE html>
<html>
<head>
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .header { background: linear-gradient(135deg, #872c7a, #9333ea); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
    .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 8px 8px; }
    .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h2>Makeplus</h2>
      <p>Plus qu'un partenaire</p>
    </div>
    <div class="content">
      <h3>${language === 'fr' ? 'Bonjour' : 'Hello'} ${name},</h3>
      <p>
        ${language === 'fr' 
          ? 'Merci de nous avoir contactés. Nous avons bien reçu votre message et notre équipe vous répondra dans les plus brefs délais.'
          : 'Thank you for contacting us. We have received your message and our team will respond to you as soon as possible.'}
      </p>
      <p>
        ${language === 'fr'
          ? 'Voici un récapitulatif de votre demande :'
          : 'Here is a summary of your request:'}
      </p>
      <div style="background: white; padding: 15px; border-left: 4px solid #872c7a; margin: 20px 0;">
        <strong>${language === 'fr' ? 'Sujet' : 'Subject'}:</strong> ${subject}
      </div>
      <p>
        ${language === 'fr'
          ? 'À très bientôt,'
          : 'See you soon,'}
      </p>
      <p><strong>L'équipe Makeplus</strong></p>
      <div class="footer">
        <p>
          📧 contact@wemakeplus.com<br>
          📞 +213 XXX XXX XXX<br>
          🌐 www.wemakeplus.com
        </p>
      </div>
    </div>
  </div>
</body>
</html>
```

---

## Validation Rules

### Field Validations
```javascript
{
  name: {
    required: true,
    minLength: 2,
    maxLength: 100,
    pattern: /^[a-zA-ZÀ-ÿ\s'-]+$/, // Letters, spaces, hyphens, apostrophes
    sanitize: true // Trim and escape HTML
  },
  email: {
    required: true,
    format: 'email',
    maxLength: 254,
    normalize: true // Convert to lowercase
  },
  phone: {
    required: false,
    minLength: 10,
    maxLength: 20,
    pattern: /^[\d\s+()-]+$/, // Numbers, spaces, +, (), -
    sanitize: true
  },
  company: {
    required: false,
    maxLength: 100,
    sanitize: true
  },
  subject: {
    required: true,
    minLength: 3,
    maxLength: 200,
    sanitize: true
  },
  message: {
    required: true,
    minLength: 10,
    maxLength: 2000,
    sanitize: true
  },
  language: {
    required: false,
    enum: ['fr', 'en'],
    default: 'fr'
  }
}
```

---

## Security Implementation

### 1. Rate Limiting
```javascript
// Limit: 5 requests per 15 minutes per IP
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests per window
  message: {
    success: false,
    message: 'Too many contact form submissions. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});
```

### 2. CORS Configuration
```javascript
const corsOptions = {
  origin: ['https://wemakeplus.com', 'http://localhost:3000'], // Update with actual domains
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
  credentials: true,
  maxAge: 86400 // 24 hours
};
```

### 3. Input Sanitization
- Use `express-validator` for validation
- Sanitize all inputs to prevent XSS attacks
- Escape HTML entities
- Remove potentially dangerous characters

### 4. Headers Security (Helmet)
```javascript
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      scriptSrc: ["'self'"],
      imgSrc: ["'self'", "data:", "https:"],
    },
  },
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  }
}));
```

### 5. Environment Variables Protection
Never commit `.env` file. Required variables:
```env
# Server Configuration
NODE_ENV=production
PORT=5000
FRONTEND_URL=https://wemakeplus.com
ADMIN_URL=https://admin.wemakeplus.com

# Database (Required)
MONGODB_URI=mongodb://localhost:27017/makeplus

# JWT Configuration (for Admin Auth)
JWT_SECRET=your-super-secret-jwt-key-min-32-chars
JWT_EXPIRES_IN=7d
JWT_COOKIE_EXPIRES_IN=7

# Email Configuration - SEND TO contact@makeplus.com
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER=your-smtp-user@gmail.com
SMTP_PASSWORD=your-app-password
EMAIL_FROM="Makeplus Website" <noreply@wemakeplus.com>
EMAIL_TO=contact@makeplus.com

# File Upload Configuration
MAX_VIDEO_SIZE=100000000
MAX_IMAGE_SIZE=5000000
UPLOAD_PATH=./uploads

# Security
RATE_LIMIT_WINDOW=15
RATE_LIMIT_MAX_REQUESTS=5
ADMIN_RATE_LIMIT_MAX=100

# Default Admin (create on first run)
DEFAULT_ADMIN_EMAIL=admin@makeplus.com
DEFAULT_ADMIN_PASSWORD=ChangeThisPassword123!
DEFAULT_ADMIN_NAME=Makeplus Admin
```

---

## Error Handling

### Error Response Format
All errors should follow this structure:
```javascript
{
  success: false,
  message: "Human-readable error message",
  errors: [ // Optional: for validation errors
    {
      field: "email",
      message: "Invalid email format",
      code: "INVALID_EMAIL"
    }
  ],
  statusCode: 400,
  timestamp: "2026-01-31T10:30:00.000Z"
}
```

### Error Types
- **400 Bad Request**: Validation errors
- **429 Too Many Requests**: Rate limit exceeded
- **500 Internal Server Error**: Server/database errors
- **503 Service Unavailable**: Email service down

### Logging
Log all errors with:
- Timestamp
- Error type
- Stack trace (in development only)
- Request details (IP, user agent)
- User input (sanitized)

---

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   ├── database.js         # Database connection
│   │   ├── email.js            # Email configuration
│   │   ├── multer.js           # File upload configuration
│   │   └── constants.js        # App constants
│   ├── controllers/
│   │   ├── authController.js   # Admin authentication
│   │   ├── contactController.js # Contact form logic
│   │   ├── statsController.js   # Statistics CRUD
│   │   ├── videoController.js   # Video management
│   │   ├── partnerController.js # Partner management
│   │   └── healthController.js  # Health check logic
│   ├── middleware/
│   │   ├── auth.js             # JWT authentication
│   │   ├── rateLimiter.js      # Rate limiting
│   │   ├── validator.js        # Input validation
│   │   ├── errorHandler.js     # Error handling
│   │   ├── upload.js           # File upload handling
│   │   └── security.js         # Security middleware
│   ├── models/
│   │   ├── Admin.js            # Admin schema
│   │   ├── Contact.js          # Contact schema
│   │   ├── Stats.js            # Statistics schema
│   │   ├── Video.js            # Video schema
│   │   └── Partner.js          # Partner schema
│   ├── routes/
│   │   ├── index.js            # Route aggregator
│   │   ├── authRoutes.js       # Auth endpoints
│   │   ├── contactRoutes.js    # Contact endpoints
│   │   ├── adminRoutes.js      # Admin CRUD endpoints
│   │   ├── contentRoutes.js    # Public content endpoints
│   │   └── healthRoutes.js     # Health check
│   ├── services/
│   │   ├── emailService.js     # Email sending logic
│   │   ├── authService.js      # Authentication logic
│   │   └── fileService.js      # File handling logic
│   ├── templates/
│   │   ├── notificationEmail.js # Admin notification template
│   │   └── autoReplyEmail.js    # User auto-reply template
│   ├── utils/
│   │   ├── logger.js           # Logging utility
│   │   ├── sanitizer.js        # Input sanitization
│   │   └── helpers.js          # Helper functions
│   └── app.js                  # Express app setup
├── uploads/                     # Uploaded files directory
│   ├── videos/
│   ├── thumbnails/
│   └── partners/
├── tests/
│   ├── auth.test.js            # Auth tests
│   ├── contact.test.js         # Contact tests
│   └── admin.test.js           # Admin CRUD tests
├── scripts/
│   └── createAdmin.js          # Script to create initial admin
├── .env.example                # Environment variables template
├── .gitignore
├── package.json
└── server.js                   # Entry point
```

---

## Testing Requirements

### Unit Tests
Test each function independently:
- Validation functions
- Email sending
- Database operations
- Sanitization functions

### Integration Tests
Test complete workflows:
- Successful form submission
- Validation errors
- Rate limiting
- Email delivery
- Database storage

### Test Cases
```javascript
describe('POST /api/contact', () => {
  test('should accept valid contact form submission', async () => {
    // Test implementation
  });

  test('should reject invalid email format', async () => {
    // Test implementation
  });

  test('should enforce rate limiting', async () => {
    // Test implementation
  });

  test('should send notification email', async () => {
    // Test implementation
  });

  test('should send auto-reply email', async () => {
    // Test implementation
  });

  test('should handle email service failure gracefully', async () => {
    // Test implementation
  });
});
```

---

## Deployment Considerations

### Environment Setup
1. Set all environment variables
2. Configure SMTP/email service
3. Set up database (if using)
4. Configure CORS for production domain
5. Enable HTTPS

### Performance
- Implement caching where appropriate
- Use compression middleware
- Optimize database queries
- Monitor response times

### Monitoring
- Set up error tracking (e.g., Sentry)
- Monitor API response times
- Track email delivery rates
- Set up uptime monitoring

### Backup & Recovery
- Regular database backups (if using)
- Log rotation
- Error recovery procedures

---

## Frontend Integration

### API Base URL
```javascript
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://api.wemakeplus.com' 
  : 'http://localhost:5000';
```

### Fetch Example (main.js)
```javascript
// In your main.js file, replace the form submission handler with:

async function handleContactSubmit(e) {
  e.preventDefault();
  
  const formData = {
    name: document.getElementById('name').value,
    email: document.getElementById('email').value,
    phone: document.getElementById('phone').value,
    company: document.getElementById('company').value,
    subject: document.getElementById('subject').value,
    message: document.getElementById('message').value,
    language: document.documentElement.getAttribute('data-lang') || 'fr'
  };

  // Show loading state
  const submitBtn = e.target.querySelector('.submit-btn');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<span>Envoi en cours...</span>';
  submitBtn.disabled = true;

  try {
    const response = await fetch(`${API_BASE_URL}/api/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData)
    });

    const data = await response.json();

    if (data.success) {
      // Show success message
      showNotification('success', 
        formData.language === 'fr' 
          ? 'Message envoyé avec succès!' 
          : 'Message sent successfully!');
      e.target.reset(); // Clear form
    } else {
      // Show error message
      showNotification('error', data.message);
    }
  } catch (error) {
    console.error('Error:', error);
    showNotification('error', 
      formData.language === 'fr'
        ? 'Une erreur est survenue. Veuillez réessayer.'
        : 'An error occurred. Please try again.');
  } finally {
    // Restore button state
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  }
}

function showNotification(type, message) {
  // Implement notification UI (toast, modal, etc.)
  // Example: Simple alert for now
  alert(message);
  
  // TODO: Implement proper toast notification
}

// Attach event listener
document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.querySelector('.contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', handleContactSubmit);
  }
});
```

---

## Phase 1 Implementation (MVP)

**Priority Features:**
1. ✅ Basic Express server setup
2. ✅ POST /api/contact endpoint
3. ✅ Input validation
4. ✅ Email sending to contact@makeplus.com (notification + auto-reply)
5. ✅ Rate limiting
6. ✅ Error handling
7. ✅ CORS configuration
8. ✅ Security headers (Helmet)
9. ✅ MongoDB database setup
10. ✅ Admin authentication (JWT)
11. ✅ Statistics CRUD API
12. ✅ Video upload and management API
13. ✅ Partner management API
14. ✅ Contact submissions management API

**Phase 2 (Optional Enhancements):**
- Admin dashboard frontend (separate React/Vue app)
- Email templates customization
- Advanced analytics
- Webhook integrations
- Multiple admin users
- Audit logs

---

## Admin Dashboard Frontend Specification

### Recommended Stack
- **React.js** or **Vue.js** for the frontend
- **Tailwind CSS** for styling
- **React Router** / **Vue Router** for navigation
- **Axios** for API calls
- **React Query** / **TanStack Query** for data fetching

### Admin Dashboard Pages

#### 1. Login Page (`/admin/login`)
- Email input
- Password input
- Remember me checkbox
- Login button
- Error display

#### 2. Dashboard Home (`/admin`)
- Overview statistics cards
- Recent contact submissions (last 5)
- Quick actions

#### 3. Statistics Page (`/admin/stats`)
- Edit each statistic value
- Edit French and English labels
- Save button
- Preview of how it looks on website

#### 4. Videos Page (`/admin/videos`)
- List of all videos with thumbnails
- Drag-and-drop reordering
- Upload new video button
- Edit/Delete actions for each video
- Toggle active/inactive
- Video preview

#### 5. Partners Page (`/admin/partners`)
- Grid of partner logos
- Upload new partner logo
- Edit/Delete actions
- Toggle active/inactive
- Reorder functionality

#### 6. Contact Submissions (`/admin/contacts`)
- Table with pagination
- Filter by status (new, read, replied, archived)
- Search functionality
- View detail modal
- Change status dropdown
- Delete option

### Admin UI Wireframe

```
┌─────────────────────────────────────────────────────────────┐
│  🔷 Makeplus Admin                    👤 Admin ▼   [Logout] │
├─────────────────────────────────────────────────────────────┤
│ ┌──────────┐                                                │
│ │ Dashboard│  ┌─────────────────────────────────────────┐   │
│ │ Stats    │  │                                         │   │
│ │ Videos   │  │     MAIN CONTENT AREA                   │   │
│ │ Partners │  │                                         │   │
│ │ Contacts │  │     - Statistics cards                  │   │
│ │          │  │     - Recent submissions                │   │
│ │          │  │     - Quick actions                     │   │
│ │          │  │                                         │   │
│ └──────────┘  └─────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

### Statistics Edit Form

```
┌─────────────────────────────────────────────────────────────┐
│  📊 Edit Statistics                                         │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  International Congress                                     │
│  ┌────────────────┐  ┌─────────────────────────────────┐   │
│  │ Value: [11  ]  │  │ Label FR: [Congrés Internationale]│  │
│  └────────────────┘  └─────────────────────────────────┘   │
│                      ┌─────────────────────────────────┐   │
│                      │ Label EN: [International Congress]│  │
│                      └─────────────────────────────────┘   │
│                                                             │
│  Symposium                                                  │
│  ┌────────────────┐  ┌─────────────────────────────────┐   │
│  │ Value: [24  ]  │  │ Label FR: [Symposium           ] │  │
│  └────────────────┘  └─────────────────────────────────┘   │
│                      ┌─────────────────────────────────┐   │
│                      │ Label EN: [Symposium           ] │  │
│                      └─────────────────────────────────┘   │
│                                                             │
│  Satisfied Companies                                        │
│  ┌────────────────┐  ┌─────────────────────────────────┐   │
│  │ Value: [28  ]  │  │ Label FR: [Societé satisfait   ] │  │
│  └────────────────┘  └─────────────────────────────────┘   │
│                      ┌─────────────────────────────────┐   │
│                      │ Label EN: [Satisfied Companies ] │  │
│                      └─────────────────────────────────┘   │
│                                                             │
│                              [Cancel]  [💾 Save Changes]    │
└─────────────────────────────────────────────────────────────┘
```

### Video Management Page

```
┌─────────────────────────────────────────────────────────────┐
│  🎬 Video Management                    [+ Upload Video]    │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────┐ ┌─────────┐ ┌─────────┐ ┌─────────┐          │
│  │ 🎬      │ │ 🎬      │ │ 🎬      │ │ 🎬      │          │
│  │ thumb   │ │ thumb   │ │ thumb   │ │ thumb   │          │
│  │         │ │         │ │         │ │         │          │
│  ├─────────┤ ├─────────┤ ├─────────┤ ├─────────┤          │
│  │Video 1  │ │Video 2  │ │Video 3  │ │Video 4  │          │
│  │✅ Active │ │✅ Active │ │⬜ Hidden │ │✅ Active │          │
│  │[Edit]   │ │[Edit]   │ │[Edit]   │ │[Edit]   │          │
│  │[Delete] │ │[Delete] │ │[Delete] │ │[Delete] │          │
│  └─────────┘ └─────────┘ └─────────┘ └─────────┘          │
│                                                             │
│  💡 Drag and drop to reorder videos                         │
└─────────────────────────────────────────────────────────────┘
```

### Contact Submissions Page

```
┌─────────────────────────────────────────────────────────────┐
│  📧 Contact Submissions                                     │
├─────────────────────────────────────────────────────────────┤
│  Filter: [All ▼]  Search: [________________] [🔍]          │
├─────────────────────────────────────────────────────────────┤
│  │ Status │ Name        │ Email           │ Subject    │   │
│  ├────────┼─────────────┼─────────────────┼────────────┤   │
│  │ 🔵 New │ Ahmed K.    │ ahmed@mail.com  │ Event Req. │👁️│
│  │ 🔵 New │ Sarah M.    │ sarah@corp.dz   │ Quote      │👁️│
│  │ ✅ Read│ Omar L.     │ omar@biz.com    │ Partnership│👁️│
│  │ 📤 Sent│ Fatima B.   │ fatima@co.dz    │ Question   │👁️│
│  │ 📁 Arc │ Karim D.    │ karim@mail.dz   │ Info       │👁️│
├─────────────────────────────────────────────────────────────┤
│  Showing 1-5 of 47                    [<] [1] [2] [3] [>]  │
└─────────────────────────────────────────────────────────────┘
```

---

## Quick Start Commands

```bash
# Initialize project
npm init -y

# Install dependencies
npm install express cors helmet dotenv express-rate-limit express-validator nodemailer mongoose bcryptjs jsonwebtoken multer sharp cookie-parser

# Install dev dependencies
npm install --save-dev nodemon

# Create initial admin user
node scripts/createAdmin.js

# Start development server
npm run dev

# Start production server
npm start
```

---

## Initial Admin Setup Script

Create `scripts/createAdmin.js`:
```javascript
require('dotenv').config();
const mongoose = require('mongoose');
const Admin = require('../src/models/Admin');

const createAdmin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Check if admin already exists
    const existingAdmin = await Admin.findOne({ email: process.env.DEFAULT_ADMIN_EMAIL });
    
    if (existingAdmin) {
      console.log('Admin already exists');
      process.exit(0);
    }
    
    // Create new admin
    const admin = await Admin.create({
      email: process.env.DEFAULT_ADMIN_EMAIL || 'admin@makeplus.com',
      password: process.env.DEFAULT_ADMIN_PASSWORD || 'ChangeThisPassword123!',
      name: process.env.DEFAULT_ADMIN_NAME || 'Makeplus Admin',
      role: 'superadmin'
    });
    
    console.log('Admin created successfully:', admin.email);
    console.log('⚠️  IMPORTANT: Change the default password immediately!');
    process.exit(0);
  } catch (error) {
    console.error('Error creating admin:', error);
    process.exit(1);
  }
};

createAdmin();
```

---

## Authentication Middleware

```javascript
// src/middleware/auth.js
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const protect = async (req, res, next) => {
  try {
    let token;
    
    // Check for token in header or cookie
    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.token) {
      token = req.cookies.token;
    }
    
    if (!token) {
      return res.status(401).json({
        success: false,
        message: 'Not authorized to access this route'
      });
    }
    
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    // Check if admin still exists
    const admin = await Admin.findById(decoded.id).select('-password');
    
    if (!admin || !admin.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Admin no longer exists or is inactive'
      });
    }
    
    req.admin = admin;
    next();
  } catch (error) {
    return res.status(401).json({
      success: false,
      message: 'Not authorized to access this route'
    });
  }
};

module.exports = { protect };
```

---

## Success Criteria

✅ Form submissions are received and processed
✅ Validation prevents invalid data
✅ Contact emails are sent to contact@makeplus.com
✅ Auto-reply emails are sent to users
✅ Rate limiting prevents abuse
✅ Errors are handled gracefully
✅ Response times < 2 seconds
✅ Email delivery rate > 98%
✅ No security vulnerabilities
✅ Admin can login securely
✅ Admin can update statistics
✅ Admin can add/edit/delete videos
✅ Admin can manage partners
✅ Admin can view/manage contact submissions

---

## File Upload Specifications

### Video Uploads
- **Max file size**: 100MB
- **Allowed formats**: .mp4, .webm, .mov
- **Storage**: `/uploads/videos/`
- **Naming**: `{timestamp}-{uuid}.{ext}`
- **Thumbnail generation**: Auto-generate from video or allow manual upload
- **Thumbnail size**: 640x360px

### Image/Logo Uploads
- **Max file size**: 5MB
- **Allowed formats**: .jpg, .jpeg, .png, .svg, .webp
- **Storage**: `/uploads/partners/` or `/uploads/thumbnails/`
- **Naming**: `{timestamp}-{uuid}.{ext}`
- **Optimization**: Resize/compress on upload (except SVG)

---

## Support & Documentation

**Node.js**: https://nodejs.org/docs
**Express.js**: https://expressjs.com
**Nodemailer**: https://nodemailer.com
**Express Validator**: https://express-validator.github.io
**Helmet**: https://helmetjs.github.io

---

## Contact for Clarifications

If any requirements are unclear or need additional features, please reach out before implementation.

**End of Specification**
