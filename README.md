# PeakClipper

**AI-powered video clipping engine.** Automatically detects and extracts the most engaging moments from any long-form video, then exports them as short clips ready for TikTok, Reels, and YouTube Shorts.

---

## What It Does

1. **Accepts** a YouTube/TikTok/Instagram URL — or a video file you upload directly
2. **Transcribes** the audio using auto-generated subtitles (yt-dlp)
3. **Scores** every moment using heuristic analysis: hook words, emotional keywords, question density, and speaking pace
4. **Clips** the top segments with ffmpeg — supports 9:16, 1:1, and 16:9 crops
5. **Burns in captions** in 9 styles (Bold Yellow, Minimal, Neon, Fire, etc.)
6. **Streams progress** in real time to the browser over SSE

---

## Demo Mode vs Full Mode

| | Demo Mode | Full Mode |
|---|---|---|
| **Where it runs** | Vercel / any host | VPS, Railway, Render, Docker |
| **Requires** | Node.js only | Node.js + yt-dlp + ffmpeg |
| **Video processing** | Simulated (mock clips) | Real end-to-end |
| **Downloads** | Sample placeholder MP4 | Actual cropped + captioned clips |
| **Use case** | Sales demos, UI previews | Production deployment |

When `yt-dlp` is not found on startup, the engine automatically switches to Demo Mode — no configuration needed.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16.2.9 — App Router, Turbopack |
| Language | TypeScript |
| Styling | Tailwind CSS v4 (CSS-first, `@theme` config) |
| UI components | Radix UI (Dialog, DropdownMenu, Switch, Tabs) |
| Icons | Lucide React |
| Video download | yt-dlp |
| Video processing | ffmpeg (libx264, aac) |
| Real-time updates | Server-Sent Events (SSE) |
| Job state | In-memory Map (global, hot-reload safe) |
| Auth state | localStorage |

---

## Prerequisites

### Minimum (Demo Mode only)
- **Node.js** 18 or later — [nodejs.org](https://nodejs.org)
- **npm** 9+ (comes with Node)

### Full processing
- Everything above, plus:
- **yt-dlp** — video downloader
- **ffmpeg** — video encoder with libx264 support

---

## Installation

### 1. Clone the repository

```bash
git clone https://github.com/your-org/peakclipper.git
cd peakclipper
```

### 2. Install Node dependencies

```bash
npm install
```

### 3. Install yt-dlp

**macOS**
```bash
brew install yt-dlp
```

**Ubuntu / Debian**
```bash
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o /usr/local/bin/yt-dlp
sudo chmod +x /usr/local/bin/yt-dlp
yt-dlp --version   # verify
```

**Windows (PowerShell as Admin)**
```powershell
winget install yt-dlp.yt-dlp
```

### 4. Install ffmpeg

**macOS**
```bash
brew install ffmpeg
```

**Ubuntu / Debian**
```bash
sudo apt update && sudo apt install -y ffmpeg
ffmpeg -version   # verify
```

**Windows**
```powershell
winget install Gyan.FFmpeg
```

---

## Running in Development

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

The app detects whether `yt-dlp` is available at startup. If missing, it runs in Demo Mode automatically.

---

## Building for Production

```bash
npm run build
npm start
```

Or with a custom port:
```bash
PORT=8080 npm start
```

---

## Deployment

### Option A — Vercel (Demo Mode only)

Vercel serverless functions cannot run `yt-dlp` or `ffmpeg`. The app runs in Demo Mode automatically, which is perfect for sales demos.

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

All API routes include `export const runtime = "nodejs"` and `export const maxDuration` so they work on Vercel's Node.js runtime.

> **Note:** Because Vercel uses ephemeral serverless functions, in-memory jobs are not shared across requests. Demo Mode still works correctly because it completes within a single function invocation.

---

### Option B — Railway (Recommended for full processing)

Railway gives you a persistent Node.js server where yt-dlp and ffmpeg can be installed.

1. Push your repo to GitHub
2. Go to [railway.app](https://railway.app) → New Project → Deploy from GitHub
3. Add a **Nixpacks build** or a custom `Dockerfile` (see below)
4. Set start command: `npm run build && npm start`

**railway.json** (place in project root):
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "npm run build && npm start",
    "restartPolicyType": "ON_FAILURE"
  }
}
```

**nixpacks.toml** (for yt-dlp + ffmpeg):
```toml
[phases.setup]
nixPkgs = ["yt-dlp", "ffmpeg"]
```

---

### Option C — VPS / Ubuntu Server (Full control)

```bash
# On your server
sudo apt update
sudo apt install -y nodejs npm ffmpeg

# Install yt-dlp
sudo curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
  -o /usr/local/bin/yt-dlp
sudo chmod +x /usr/local/bin/yt-dlp

# Clone and build
git clone https://github.com/your-org/peakclipper.git /opt/peakclipper
cd /opt/peakclipper
npm install
npm run build

# Run with PM2 (process manager)
npm install -g pm2
pm2 start npm --name peakclipper -- start
pm2 save
pm2 startup
```

**Nginx reverse proxy** (`/etc/nginx/sites-available/peakclipper`):
```nginx
server {
    listen 80;
    server_name yourdomain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
        # Required for SSE (real-time progress)
        proxy_buffering off;
        proxy_read_timeout 300s;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/peakclipper /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
```

---

### Option D — Docker

**Dockerfile**:
```dockerfile
FROM node:20-slim

# Install system dependencies
RUN apt-get update && apt-get install -y \
    ffmpeg \
    curl \
    python3 \
    && rm -rf /var/lib/apt/lists/*

# Install yt-dlp
RUN curl -L https://github.com/yt-dlp/yt-dlp/releases/latest/download/yt-dlp \
    -o /usr/local/bin/yt-dlp && chmod +x /usr/local/bin/yt-dlp

WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production

COPY . .
RUN npm run build

ENV PORT=3000
EXPOSE 3000
CMD ["npm", "start"]
```

```bash
docker build -t peakclipper .
docker run -p 3000:3000 peakclipper
```

---

## Environment Variables

No environment variables are required for the base app. All user preferences are stored in the browser's `localStorage`.

If you add OAuth providers in the future, you would add:
```env
NEXTAUTH_SECRET=your-secret-here
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

---

## API Reference

All routes require the Node.js runtime. SSE routes require `proxy_buffering off` in Nginx.

### `GET /api/video-info?url=<url>`
Returns video metadata without downloading.

**Response:**
```json
{
  "title": "Video title",
  "duration": 1847,
  "thumbnail": "https://...",
  "channel": "Channel name"
}
```

---

### `POST /api/jobs`
Creates a new processing job.

**Body (JSON):**
```json
{
  "url": "https://youtube.com/watch?v=...",
  "settings": {
    "mode": "shorts",
    "clipLength": "auto",
    "language": "en",
    "captionStyle": "bold-yellow",
    "introTitle": true,
    "captions": true,
    "aspectRatio": "9:16"
  }
}
```

**Body (multipart, file upload):**
- `file`: Video file (MP4, MOV, etc.)
- `settings`: JSON string of settings above

**Response:**
```json
{ "jobId": "job_1234567890_abc123" }
```

---

### `GET /api/jobs`
Returns all jobs (in-memory, current server session).

---

### `GET /api/jobs/:id`
Returns a single job's status and results.

---

### `PATCH /api/jobs/:id`
Renames a job's display title.

**Body:**
```json
{ "displayTitle": "My renamed project" }
```

---

### `DELETE /api/jobs/:id`
Removes a job from memory.

---

### `GET /api/jobs/:id/stream`
SSE endpoint. Pushes job updates every 600ms until `status` is `"done"` or `"error"`.

**Event data shape:**
```json
{
  "status": "clipping",
  "progress": 82.5,
  "currentStep": "Clipped 3/5…",
  "videoInfo": { "title": "...", "duration": 1847, "thumbnail": "...", "channel": "..." },
  "clips": [
    {
      "id": "job_xxx_clip0",
      "title": "The hook that changes everything",
      "duration": 58,
      "score": 92,
      "transcript": "Most people think..."
    }
  ]
}
```

---

### `GET /api/clips/:clipId/video`
Streams a clip's MP4 file. Supports `Range` headers for seek support.

---

## Project Structure

```
peakclipper/
├── app/
│   ├── page.tsx              # Main dashboard (Clips list + input bar)
│   ├── onboarding/page.tsx   # Onboarding flow (4 steps)
│   ├── analytics/page.tsx    # Analytics stub page
│   ├── globals.css           # Tailwind v4 @theme config
│   └── api/
│       ├── video-info/       # GET — video metadata via yt-dlp
│       ├── jobs/             # GET list, POST create
│       └── jobs/[id]/
│           ├── route.ts      # GET, PATCH (rename), DELETE
│           ├── stream/       # SSE progress stream
│           └── clips/[clipId]/video/  # MP4 streaming
│
├── components/
│   ├── generate-modal.tsx    # 3-step modal: Configure → Processing → Results
│   ├── caption-style-picker.tsx  # 9 CSS caption style previews
│   └── ui/                   # Badge, Button, Switch primitives
│
├── hooks/
│   └── use-job-stream.ts     # EventSource hook for SSE
│
├── lib/
│   ├── video-processor.ts    # Main pipeline: info → download → transcript → clip
│   ├── ffmpeg.ts             # ffprobe + clipVideo wrapper
│   ├── highlight-detector.ts # Heuristic scoring algorithm
│   ├── subtitle-parser.ts    # VTT/SRT parser + segment merger
│   ├── job-store.ts          # In-memory job store (global, hot-reload safe)
│   └── user-prefs.ts         # localStorage-based user preferences
│
└── public/
    └── demo/
        └── sample-clip.mp4   # Demo mode download placeholder
```

---

## Highlight Detection Algorithm

When subtitles are available, each segment is scored on:

| Signal | Points |
|---|---|
| Hook words ("secret", "mistake", "honest", etc.) | +12 |
| Emotional keywords ("incredible", "failed", "love", etc.) | +8 |
| Transition phrases ("the reason is", "here's the thing") | +10 |
| Questions answered | +6 |
| Fast speaking pace (words/second) | +5 |
| Numbers & statistics | +4 |

Segments scoring above the median are selected as clips. If no subtitles are available, the video is split into equal-length intervals.

---

## Supported Sites

Any site supported by yt-dlp, including:

- YouTube (and Shorts)
- TikTok
- Instagram Reels
- Twitter / X
- Facebook
- Twitch VODs
- Vimeo
- 1000+ others

For file uploads: MP4, MOV, AVI, MKV, WebM, and any format ffmpeg can decode.

---

## Known Limitations

- **In-memory job store**: Jobs are lost when the server restarts. A future version can use Redis or SQLite.
- **Single-server only**: No distributed queue. Multiple Vercel instances will not share job state.
- **YouTube rate limits**: yt-dlp may be rate-limited or blocked on some IP ranges. Use a residential proxy or VPN if needed.
- **SSL on some networks**: Add `--no-check-certificate` to yt-dlp calls if behind a corporate proxy (already included).

---

## License

MIT — use freely for personal and commercial projects.
