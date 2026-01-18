import { NextRequest, NextResponse } from 'next/server'
import { writeFile, unlink, readFile, mkdir } from 'fs/promises'
import { spawn } from 'child_process'
import path from 'path'
import { randomUUID } from 'crypto'

// Prefer an explicit env var, but fall back to `ffmpeg` so systems with ffmpeg on PATH work (Windows/Unix)
const FFMPEG_PATH = process.env.FFMPEG_PATH || 'ffmpeg'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const file = formData.get('file')
    const startRaw = formData.get('start')
    const endRaw = formData.get('end')

    if (!file) {
      console.error('Missing `file` in formData')
      return NextResponse.json({ error: '`file` is required' }, { status: 400 })
    }

    if (startRaw === null || endRaw === null) {
      console.error('Missing `start` or `end` in formData', { startRaw, endRaw })
      return NextResponse.json({ error: '`start` and `end` are required' }, { status: 400 })
    }

    const start = Number(String(startRaw))
    const end = Number(String(endRaw))

    if (!Number.isFinite(start) || !Number.isFinite(end) || start < 0 || end <= start) {
      console.error('Invalid start/end values', { startRaw, endRaw, start, end })
      return NextResponse.json({ error: 'Invalid `start`/`end` values' }, { status: 400 })
    }

    if (typeof (file as any).arrayBuffer !== 'function') {
      console.error('`file` does not expose arrayBuffer()', { fileType: typeof file })
      return NextResponse.json({ error: '`file` must be a binary upload' }, { status: 400 })
    }

    const buffer = Buffer.from(await (file as any).arrayBuffer())

    const inputPath = path.join(process.cwd(), 'tmp', `${randomUUID()}-input.webm`)

    const outputPath = inputPath.replace('input', 'output')

    await mkdir(path.dirname(inputPath), { recursive: true })
    await writeFile(inputPath, buffer)

    const ffmpegArgs = [
      '-i', inputPath,
      '-ss', String(start),
      '-to', String(end),
      '-c:v', 'libvpx',
      '-crf', '10',
      '-b:v', '1M',
      '-c:a', 'libopus',
      '-b:a', '64k',
      outputPath,
    ]

    let stderr = ''
    try {
      await new Promise<void>((resolve, reject) => {
        const proc = spawn(FFMPEG_PATH, ffmpegArgs, { windowsHide: true })

        proc.stderr?.on('data', (chunk) => {
          stderr += chunk.toString()
        })
        proc.stdout?.on('data', () => {
        })

        proc.on('error', (err) => {
          console.error('ffmpeg process error', err)
          reject(err)
        })
        proc.on('close', (code) => {
          if (code === 0) resolve()
          else {
            console.error('ffmpeg exited non-zero', { code, stderr })
            reject(new Error(`ffmpeg exited with code ${code}: ${stderr}`))
          }
        })
      })

      const outputBuffer = await readFile(outputPath)

      return new NextResponse(outputBuffer, {
        headers: {
          'Content-Type': 'video/webm',
          'Content-Disposition': 'attachment; filename="trimmed.webm"',
        },
      })
    } finally {
      try {
        await unlink(inputPath)
      } catch (e) {
        console.warn('Failed to remove input temp file', inputPath, e)
      }
      try {
        await unlink(outputPath)
      } catch (e) {
        console.warn('Failed to remove output temp file', outputPath, e)
      }
    }
  } catch (err: any) {
    console.error('Trim handler error', err)
    const details = typeof err?.message === 'string' ? err.message : String(err)
    const suggestion = err && (err.code === 'ENOENT' || String(details).includes('spawn') && String(details).includes('ENOENT'))
      ? 'ffmpeg not found. Install ffmpeg or set the FFMPEG_PATH env var to the ffmpeg executable.'
      : undefined
    return NextResponse.json({ error: 'Video processing failed', details: details.slice?.(0, 2000), suggestion }, { status: 500 })
  }
}
