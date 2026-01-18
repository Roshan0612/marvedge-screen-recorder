import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

async function readMeta(videoId: string) {
  const metaPath = path.join(process.cwd(), 'data', `${videoId}.json`)
  const raw = await readFile(metaPath, 'utf8')
  return JSON.parse(raw)
}

async function writeMeta(videoId: string, data: any) {
  const metaPath = path.join(process.cwd(), 'data', `${videoId}.json`)
  await writeFile(metaPath, JSON.stringify(data, null, 2), 'utf8')
}

export async function GET(_req: Request, { params }: { params: { videoId: string } | Promise<{ videoId: string }> }) {
  try {
    const { videoId } = await params
    const meta = await readMeta(videoId)
    return NextResponse.json({ views: meta.views ?? 0 })
  } catch (err) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}

export async function POST(req: Request, { params }: { params: { videoId: string } | Promise<{ videoId: string }> }) {
  try {
    const { videoId } = (await params) as { videoId: string }

    let body: any = null
    try {
      body = await req.json()
    } catch (e) {
      body = null
    }

    const metaPath = path.join(process.cwd(), 'data', `${videoId}.json`)

    let meta: any
    try {
      const raw = await readFile(metaPath, 'utf8')
      meta = JSON.parse(raw)
    } catch (e: any) {
      if (e && e.code === 'ENOENT') {
        meta = {
          videoId,
          createdAt: new Date().toISOString(),
          views: 0,
          duration: null,
          watchedSeconds: 0,
        }
      } else {
        throw e
      }
    }

    if (body && typeof body.watchedSeconds !== 'undefined') {
      const watchedSeconds = Number(body.watchedSeconds)
      if (!Number.isFinite(watchedSeconds) || watchedSeconds < 0) {
        return NextResponse.json({ error: 'Invalid watchedSeconds' }, { status: 400 })
      }
      meta.watchedSeconds = Math.max(Number(meta.watchedSeconds || 0), watchedSeconds)
      await writeMeta(videoId, meta)
      return NextResponse.json(meta)
    }

    meta.views = (Number(meta.views) || 0) + 1
    await writeMeta(videoId, meta)
    return NextResponse.json({ views: meta.views })
  } catch (err) {
    console.error('Failed to update analytics', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
