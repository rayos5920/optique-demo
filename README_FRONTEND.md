# Optique Frontend

React + TypeScript + Vite frontend for Optique image similarity detection.

## 🏗️ Architecture

```
React Components
    ↓
Services (API calls)
    ↓
Backend API (http://localhost:7860 or https://hf.space)
```

## 📦 Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   ├── ImageUploader.tsx    - Image upload component
│   │   ├── LoadingSpinner.tsx   - Loading indicator
│   │   └── FeedbackModal.tsx    - Feedback form
│   ├── pages/
│   │   ├── HomePage.tsx         - Main page with image upload
│   │   └── ResultPage.tsx       - Results display page
│   ├── services/
│   │   └── api.ts               - API client
│   ├── types/
│   │   └── index.ts             - TypeScript types
│   ├── App.tsx                  - Main app component
│   └── main.tsx                 - Entry point
├── public/                      - Static assets
├── .env.example                 - Template (do not use directly)
├── .env.development             - Dev configuration
├── .env.production              - Production configuration
├── Dockerfile                   - Docker build
├── vite.config.ts              - Vite config
├── tsconfig.json               - TypeScript config
└── package.json                - Dependencies
```

## 🚀 Quick Start

### Development

```bash
# Install dependencies
npm install

# Start dev server (http://localhost:5173)
npm run dev
```

Make sure backend is running at `http://localhost:7860`

### Production Build

```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 🌍 Environment Configuration

### Development (`.env.development`)
```env
VITE_API_URL=http://localhost:7860
```

### Production (`.env.production`)
```env
VITE_API_URL=https://username-optique-backend.hf.space
```

Replace `username` with your Hugging Face username.

## 🔧 API Integration

The app communicates with backend via `src/services/api.ts`:

```typescript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:7860';
```

### API Endpoints Used

- `GET /api/health` - Health check
- `POST /api/compare` - Compare two images
- `POST /api/feedback` - Submit user feedback

## 🎨 UI Components

### HomePage
- Image upload for original and AI-generated images
- Compare button
- Error handling

### ResultPage
- Display comparison metrics
- Similarity visualization
- Feedback submission form

### FeedbackModal
- Feedback type selection
- Rating system (1-5 stars)
- Feedback text input

## 🐳 Docker Deployment

### Build for Vercel

```bash
# Build Docker image for testing
docker build -t optique-frontend .

# Run locally
docker run -p 3000:80 \
  -e VITE_API_URL=https://username-optique-backend.hf.space \
  optique-frontend
```

### Deploy to Vercel

1. Push code to GitHub
2. Connect to Vercel (https://vercel.com)
3. Set environment variable:
   - `VITE_API_URL=https://username-optique-backend.hf.space`
4. Deploy

Vercel will automatically:
- Install dependencies (`npm install`)
- Build app (`npm run build`)
- Deploy `dist/` folder

## 📝 Configuration Guide

### Step 1: Get Backend URL

After deploying backend on HF Spaces:
```
https://YOUR_USERNAME-optique-backend.hf.space
```

### Step 2: Update Environment Variables

**For Vercel deployment**, set environment variable in Vercel dashboard:
```
VITE_API_URL=https://YOUR_USERNAME-optique-backend.hf.space
```

**For local development**, use `.env.development`:
```env
VITE_API_URL=http://localhost:7860
```

### Step 3: Deploy

Push to GitHub → Vercel auto-deploys

## 🧪 Testing

### Test with local backend
```bash
# Terminal 1: Backend
cd backend
python app.py

# Terminal 2: Frontend
npm run dev
```

Visit: `http://localhost:5173`

### Test with HF backend
```bash
npm run build
VITE_API_URL=https://username-optique-backend.hf.space npm run preview
```

## 📊 Build Output

```bash
npm run build
```

Creates optimized `dist/` folder:
- `index.html` - Entry page
- `assets/` - JavaScript, CSS (minified & hashed)
- Total size: ~100-150 KB (gzipped)

## 🔐 Security

- ✅ No sensitive data in frontend
- ✅ API URLs via environment variables
- ✅ HTTPS-only in production
- ✅ CORS handled by backend

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| API connection error | Check `VITE_API_URL` env variable |
| Build fails | Run `npm install` again, check Node version >= 20 |
| Port 5173 already in use | Kill process or use different port |
| Images not uploading | Check backend is running and CORS enabled |

## 📚 Useful Commands

```bash
# Development
npm run dev              # Start dev server
npm run build            # Production build
npm run preview          # Preview build
npm run lint             # Run ESLint

# Docker
docker build -t optique-frontend .
docker run -p 3000:80 optique-frontend
```

## 🚀 Deployment Checklist

- [ ] Backend deployed on HF Spaces
- [ ] Get backend URL
- [ ] Update `.env.production` with backend URL
- [ ] Push to GitHub
- [ ] Connect GitHub repo to Vercel
- [ ] Set environment variable in Vercel
- [ ] Deploy
- [ ] Test with: https://optique.vercel.app

## 📝 License

MIT
