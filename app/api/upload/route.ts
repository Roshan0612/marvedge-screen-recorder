import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'

export const runtime = 'nodejs'

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()

    const file = formData.get('file')
    const durationRaw = formData.get('duration')

    if (!file || typeof (file as any).arrayBuffer !== 'function') {
      return NextResponse.json({ error: '`file` is required' }, { status: 400 })
    }

    const duration = durationRaw != null ? Number(String(durationRaw)) : undefined

    const videoId = randomUUID()

    const uploadsDir = path.join(process.cwd(), 'uploads')
    const dataDir = path.join(process.cwd(), 'data')
    await mkdir(uploadsDir, { recursive: true })
    await mkdir(dataDir, { recursive: true })

    const uploadPath = path.join(uploadsDir, `${videoId}.webm`)

    const buffer = Buffer.from(await (file as any).arrayBuffer())
    await writeFile(uploadPath, buffer)

    const meta = {
      videoId,
      createdAt: new Date().toISOString(),
      views: 0,
      duration: Number.isFinite(duration) ? duration : null,
      watchedSeconds: 0,
    }

    const metaPath = path.join(dataDir, `${videoId}.json`)
    await writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8')

    const shareUrl = `/share/${videoId}`

    return NextResponse.json({ videoId, shareUrl }, { status: 201 })
  } catch (err) {
    console.error('Upload failed', err)
    return NextResponse.json({ error: 'Upload failed' }, { status: 500 })
  }
}
