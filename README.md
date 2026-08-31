# Audiom (Mood-Adaptive Music Streaming Platform) 🎧✨

An intelligent audio streaming and discovery platform that uses real-time computer vision and facial expression detection to analyze user mood and dynamically curate personalized music playlists.

[![GitHub Repo](https://img.shields.io/badge/GitHub-Repository-181717?style=flat&logo=github)](https://github.com/DeveloperHarshal92/Modify-Your_Moddy_Music_Player.git)
[![React](https://img.shields.io/badge/React-19.2-61DAFB?style=flat&logo=react)](https://react.dev/)
[![MediaPipe](https://img.shields.io/badge/MediaPipe-Tasks_Vision-0097A7?style=flat&logo=google)](https://developers.google.com/mediapipe)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?style=flat&logo=tailwindcss)](https://tailwindcss.com/)
[![Express](https://img.shields.io/badge/Express-5.2-000000?style=flat&logo=express)](https://expressjs.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=flat&logo=mongodb)](https://mongoosejs.com/)
[![Redis](https://img.shields.io/badge/Redis-Cache-DC382D?style=flat&logo=redis)](https://redis.io/)

---

## 🌟 Key Features

- **Facial Emotion Recognition**: Real-time camera detection using `@mediapipe/tasks-vision` classifies facial expressions (Happy, Energetic, Calm, Melancholic) to serve instant mood-based music queues.
- **Full-Featured Audio Player**: Seamless track playback with progress controls, queue management, similar track recommendations, and time-stamped play history.
- **Audio Metadata Extraction**: Automatically parses MP3 tags (`node-id3`) on upload, extracting embedded artist, album art, bitrate, and duration.
- **Cloud Storage & Streaming**: Integrated with ImageKit for fast CDN-backed audio delivery and cover art storage.
- **Interactive Community & Engagement**: Track commenting system, canvas-confetti celebration triggers, and Lenis smooth scroll ergonomics.
- **High-Performance Caching**: Redis-backed cache layer for ultra-fast song metadata and user playlist retrieval.

---

## 🛠️ Tech Stack

### Frontend
- **Framework**: React 19, Vite
- **AI / Vision**: `@mediapipe/tasks-vision` (client-side facial expression analysis)
- **Styling & UI**: Tailwind CSS v4, Motion (Framer Motion v13), Lucide React, Lenis Smooth Scroll
- **Routing & Networking**: React Router v7, Axios

### Backend
- **Server Runtime**: Node.js, Express v5
- **Database & ODM**: MongoDB, Mongoose v9
- **Caching**: Redis (`ioredis`)
- **Media Engine & Metadata**: ImageKit Node SDK, `node-id3`, Multer
- **Authentication**: JWT, `bcryptjs`, token blacklist validation

---

## 📁 Repository Architecture

```
02 - Audiom/
├── Backend/
│   ├── src/
│   │   ├── config/          # MongoDB and Redis connection setup
│   │   ├── controllers/     # Song, history, comment, auth controllers
│   │   ├── middleware/      # Auth guard, upload handler
│   │   ├── models/          # User, Song, PlayHistory, Comment, Blacklist
│   │   ├── routes/          # API endpoint routes
│   │   └── services/        # Storage and ImageKit integrations
│   ├── server.js            # Express API server entry
│   └── package.json
└── Frontend/
    ├── src/
    │   ├── features/
    │   │   ├── Expression/  # MediaPipe face expression detection & utils
    │   │   ├── home/        # Player, feed, search, curated playlists, comments
    │   │   └── auth/        # Login, registration, route protection
    │   ├── components/      # AudiomLogo, Loader
    │   ├── App.jsx
    │   └── main.jsx
    └── package.json
```

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- MongoDB connection string
- Redis instance
- ImageKit API credentials

### 1. Configure & Run Backend
```bash
cd Backend
npm install
```
Create a `.env` file in `Backend/`:
```env
PORT=5000
MONGODB_URI=your_mongodb_connection_string
REDIS_URI=your_redis_url
JWT_SECRET=your_jwt_secret
IMAGEKIT_PUBLIC_KEY=your_imagekit_public_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
IMAGEKIT_URL_ENDPOINT=your_imagekit_url_endpoint
```
Start server:
```bash
npm run dev
```

### 2. Configure & Run Frontend
```bash
cd ../Frontend
npm install
npm run dev
```

---

## 📡 API Overview

| Route | Method | Description |
| :--- | :--- | :--- |
| `/api/auth/register` | POST | Register new listener |
| `/api/auth/login` | POST | Login and retrieve auth token |
| `/api/songs` | GET | Fetch music catalog / filter by mood |
| `/api/songs/upload` | POST | Upload MP3 track + auto-extract ID3 tags |
| `/api/history` | GET / POST | User listen history & track timing |
| `/api/comments/:songId` | GET / POST | Track discussion and comments |

---

## 📄 License
ISC License. Built for portfolio showcase.
