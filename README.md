# Marvedge

Marvedge is a browser-based screen recorder for explaining technical work with a focused, shareable video workflow.

## Features

- Capture display video and microphone audio with the browser MediaRecorder API.
- Preview recordings locally in the browser.
- Trim clips by choosing start and end timestamps.
- Re-encode trimmed WebM video with FFmpeg for reliable cuts.
- Upload recordings to an S3-compatible bucket.
- Share recordings through generated links and track views on the share page.

## Tech Stack

- Next.js 16 with the App Router
- React 19
- TypeScript
- Tailwind CSS 4 and PostCSS
- Browser MediaRecorder and Media Capture APIs
- AWS SDK for JavaScript v3 and Amazon S3-compatible storage
- Node.js runtime for filesystem and FFmpeg processing

## Screenshots

Screenshots can be added here as the product evolves.

## Getting Started

### Prerequisites

- Node.js 18 or later
- FFmpeg installed and available on `PATH` for trimming
- An S3-compatible bucket and credentials for upload and playback

### Install and run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in a browser that supports screen capture. Use `npm run build` to create a production build and `npm start` to serve it.

## Environment Variables

Create a `.env.local` file with the storage configuration used by the API routes:

```bash
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
FFMPEG_PATH=ffmpeg
```

Do not commit real credentials. `FFMPEG_PATH` is optional when `ffmpeg` is already on `PATH`; it can point to an absolute executable path when needed.

## Project Structure

```text
app/
  api/              Upload, trim, playback, and analytics route handlers
  record/           Recording page
  share/[videoId]/  Shared recording playback and view count
  page.tsx          Home page
components/
  Recorder.tsx      Browser capture, preview, trim, and upload UI
lib/
  s3.ts             S3 client and signed URL helper
data/               Recording metadata stored by the application
uploads/            Local application upload workspace
tmp/                Temporary files used during FFmpeg processing
```

## How It Works

The recording page requests display video and microphone access, combines their tracks, and records them as WebM in the browser. A recorded clip can be previewed and sent to `/api/trim`, where FFmpeg processes the requested time range. The resulting file is uploaded to S3 through `/api/upload`, which returns a `/share/[videoId]` route. The share page loads the video through a signed URL or server proxy and records playback views through the analytics route.

## Development

Run `npm run dev` while working locally. Use `npm run lint` for ESLint checks and `npm run build` to validate the production bundle. Browser permissions must be granted for screen and microphone capture, and FFmpeg must be available to test trimming.

## Deployment

Deploy the Next.js application to a Node.js-compatible host. Configure the AWS variables in the host environment, provide FFmpeg in the runtime image or set `FFMPEG_PATH`, and ensure the process can write to the temporary and upload directories. Use an S3 bucket policy and credentials appropriate for the deployment environment.

## Contributing

Keep changes focused, preserve the existing recording and API contracts, and verify lint and build checks before opening a pull request. Describe user-visible changes and include screenshots for UI updates.

## License

No license file is currently included in this repository.
