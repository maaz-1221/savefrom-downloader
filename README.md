# SaveFrom.net Clone - Full-Stack Online Video Downloader

Ek mukammal (complete) aur fully-functional web application jo **https://en1.savefrom.net/** ka exact clone hai. Isay **REA (Reverse Engineer Anything)** skill ke zariye original SaveFrom site ka DOM, styling, SVG assets aur network requests reverse-engineer kar ke tayyar kiya gaya hai.

---

## 🌟 Features

1. **Exact SaveFrom.net UI & Design**:
   - Signature SaveFrom Green theme (`#00a859`, `#02b763`).
   - Original SVG icons for all platforms (YouTube, TikTok, Instagram, Facebook, Twitter/X, Vimeo, Reddit, etc.).
   - Responsive input bar with **1-click Clipboard Paste** and **Clear** buttons.
   - Dynamic Results Card with video thumbnail, duration badge, title, and resolution dropdown.
   - Interactive 3-Step "How to Download" guide and Feature cards.
   - Complete interactive FAQ accordion.

2. **Real Video Extraction & Downloading (Powered by yt-dlp & FFmpeg)**:
   - **YouTube**: 4K, 2K, 1080p Full HD, 720p HD, 480p, 360p & MP3 Audio.
   - **TikTok**: Watermark-free HD videos.
   - **Instagram**: Reels, Stories, and post videos.
   - **Facebook**: Public HD video downloads.
   - **Twitter / X**: Video clips & GIF streams.
   - **Over 1,000+ Platforms**: Vimeo, Reddit, Dailymotion, SoundCloud, etc.

3. **In-Browser Direct Streaming**:
   - Downloads start immediately in your browser's default download manager.
   - Clean filename formatting without illegal filesystem characters.
   - Automatic temp file cleanup to keep disk space free.

---

## 🚀 How to Run (Kaise Run Karein)

### Method 1: 1-Click Launcher (Windows)
Sirf project folder mein mojood **`run.bat`** file par double click karein! Server start ho jayega aur browser automatically open ho jayega.

### Method 2: Command Line
1. Terminal / PowerShell open karein:
```bash
cd "C:\Users\Maz\.gemini\antigravity\scratch\savefrom-downloader"
```
2. Server start karein:
```bash
python -m uvicorn app:app --host 127.0.0.1 --port 8000 --reload
```
3. Browser mein open karein:
```
http://localhost:8000
```

---

## 📁 Project Structure

```
savefrom-downloader/
├── app.py                # FastAPI backend + yt-dlp extraction & streaming download API
├── static/
│   ├── css/
│   │   └── style.css     # SaveFrom exact stylesheet & responsive design
│   ├── js/
│   │   └── main.js       # Dynamic UI controller (paste, fetch, format selection, download)
│   └── img/              # Original SaveFrom logos, platform icons, SVGs
├── templates/
│   └── index.html        # Main SaveFrom interface
├── requirements.txt      # Python dependencies
├── run.bat               # 1-click Windows launcher
└── README.md             # Documentation
```

---

## 🔌 API Endpoints

- `GET /` : Main SaveFrom.net web page.
- `POST /api/extract` : Accepts `{ "url": "..." }`, returns video title, thumbnail, duration, and resolutions.
- `GET /api/download?url=...&format_id=...&is_audio=...&title=...` : Streams the video file directly to the browser with `Content-Disposition: attachment`.
- `GET /api/health` : Health check endpoint.
