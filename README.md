# Marvedge

Marvedge is a browser-based screen recorder built for technical explanations. It lets you capture what is happening on your screen, record your voice, trim out the extra bits, and send a clean shareable link to someone else.

It is aimed at product updates, bug reports, walkthroughs, and quick explanations where a short recorded clip is clearer than a long message.

## What it does

- Capture screen and microphone input directly in the browser
- Preview the recording before saving it
- Trim the timeline to keep only the important part
- Re-encode the final clip with FFmpeg for a cleaner result
- Upload the final video to an S3-compatible storage bucket
- Generate a share link and count views on the playback page

## Tech stack

- Next.js 16
- React 19
- TypeScript
- Tailwind CSS
- Browser MediaRecorder API
- AWS SDK for S3 uploads and signed playback URLs
- Node.js for server-side processing and FFmpeg integration

## Project structure

```text
app/
  api/              Upload, trim, playback, and analytics handlers
  record/           Recording page
  share/[videoId]/  Playback page for a shared recording
  page.tsx          Landing page
components/
  Recorder.tsx      Capture, preview, trim, and upload flow
lib/
  s3.ts             S3 client setup and signed URL helper
data/               Metadata for uploaded recordings
tmp/                Temporary files used during trimming
uploads/            Local app upload workspace
```

## Local setup

This project expects Node.js, FFmpeg, and S3 credentials to be available locally.

```bash
npm install
npm run dev
```

Then open the app in the browser and start recording from the recorder page.

## Environment variables

Create a `.env.local` file in the project root with values like:

```bash
AWS_REGION=
AWS_ACCESS_KEY_ID=
AWS_SECRET_ACCESS_KEY=
AWS_S3_BUCKET_NAME=
FFMPEG_PATH=ffmpeg
```

`FFMPEG_PATH` is optional if `ffmpeg` is already installed and available on your machine.

## How the flow works

The recorder page asks for screen and microphone access, combines the tracks, and stores the result as a WebM recording in the browser. Once the clip is ready, it can be trimmed by selecting a start and end time. The trimmed output is processed through FFmpeg and then uploaded to S3. The app returns a share URL, and the playback page loads the clip while tracking view counts.

## Screenshots

Screenshots will be added here as the product continues to evolve.

## Notes

This is a focused app for making technical explanations easier to share. The goal is simple: capture the moment, keep only what matters, and send a clean link without extra friction.


