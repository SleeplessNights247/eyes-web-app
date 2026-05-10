# EYES Web App

Mobile-friendly progressive web app (PWA) version of the [EYES Flutter app](../eyes_app/), built with React + TypeScript + Vite. Deployed at **[eyes-web.netlify.app](https://eyes-web.netlify.app)**.

## Features

- **Real-time object detection** — capture image from camera, send to YOLOv8 backend, display labelled bounding boxes
- **Distance estimation** — MiDaS depth map integrated into results
- **Low-light enhancement** — Zero-DCE model applied automatically when lighting is poor
- **Text-to-speech guidance** — ElevenLabs reads backend-generated voice alerts
- **Haptic feedback** — `navigator.vibrate()` on analyze complete
- **Auto-scan** — continuous capture loop with configurable interval
- **Scan history** — last 50 results stored in localStorage
- **Dark / Light theme** — matches Flutter app color system
- **English / Filipino** — full localization parity with Flutter app
- **Offline detection** — connection banner when backend unreachable
- **Installable PWA** — full `manifest.json`, add-to-homescreen support

## Stack

| Layer | Technology |
|---|---|
| UI | React 18 + TypeScript |
| Build | Vite 5 |
| Styling | Tailwind CSS 3 |
| Routing | React Router DOM v7 |
| State | React Context (no external store) |
| Deploy | Netlify |

## Local Development

```bash
cd eyes-web-app
npm install
npm run dev          # http://localhost:5173
```

## Build & Deploy

```bash
npm run build        # output → dist/
```

Netlify picks up `netlify.toml` automatically:
- Build command: `npm run build`
- Publish directory: `dist`
- SPA redirect: all routes → `/index.html` (status 200)

## Backend

The web app calls the FastAPI backend hosted on Railway:

```
https://web-production-1f25d.up.railway.app
```

Key endpoints used:

| Method | Path | Description |
|---|---|---|
| `POST` | `/api/analyze` | Multipart image upload → annotated image, detections, distances, scene, priority object, and voice alert |
| `POST` | `/api/tts` | Backend ElevenLabs proxy → audio/mpeg |
| `GET` | `/health` | Liveness probe |

Set `VITE_API_BASE_URL` in Netlify to your Railway backend URL, for example `https://your-app.up.railway.app`. The app falls back to the default URL in [`src/config/constants.ts`](src/config/constants.ts) when the variable is not set.

## Project Structure

```
eyes-web-app/
├── public/
│   ├── images/          # Flutter app assets (PNGs)
│   ├── manifest.json    # PWA manifest
│   ├── robots.txt
│   └── sitemap.xml
├── src/
│   ├── config/          # constants, theme, localizations
│   ├── hooks/           # useSettings, useAppState (React Context)
│   ├── models/          # ResultModel, Settings interfaces
│   ├── pages/           # Splash, Onboarding, Home, History, Settings, About
│   ├── services/        # api, ElevenLabs tts, haptic
│   └── components/      # StatusBar, AnalyzeButton, ResultSheet, BoundingBoxOverlay …
├── index.html
├── netlify.toml
└── vite.config.ts
```

## Environment

Recommended Netlify environment variables:

```bash
VITE_API_BASE_URL=https://your-railway-backend.up.railway.app
```

Recommended Railway environment variables:

```bash
ELEVENLABS_API_KEY=your_elevenlabs_api_key
ELEVENLABS_VOICE_ID=your_voice_id
ALLOWED_ORIGINS=https://your-netlify-site.netlify.app,http://localhost:5173,http://localhost:4173
```
