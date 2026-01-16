import { NextResponse } from 'next/server'
import { readFile, writeFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function POST(req: Request, { params }: { params: { videoId: string } | Promise<{ videoId: string }> }) {
  try {
    const { videoId } = (await params) as { videoId: string }
    const body = await req.json()
    const watchedSeconds = Number(body?.watchedSeconds)

    if (!Number.isFinite(watchedSeconds) || watchedSeconds < 0) {
      return NextResponse.json({ error: 'Invalid watchedSeconds' }, { status: 400 })
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

    meta.watchedSeconds = Math.max(Number(meta.watchedSeconds || 0), watchedSeconds)

    await writeFile(metaPath, JSON.stringify(meta, null, 2), 'utf8')

    return NextResponse.json(meta)
  } catch (err) {
    console.error('Failed to update analytics', err)
    return NextResponse.json({ error: 'Update failed' }, { status: 500 })
  }
}
