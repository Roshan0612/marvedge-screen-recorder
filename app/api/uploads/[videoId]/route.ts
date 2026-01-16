import { NextResponse } from 'next/server'
import { readFile } from 'fs/promises'
import path from 'path'

export const runtime = 'nodejs'

export async function GET(req: Request, { params }: { params: { videoId: string } | Promise<{ videoId: string }> }) {
  try {
    const { videoId } = (await params) as { videoId: string }
    const uploadPath = path.join(process.cwd(), 'uploads', `${videoId}.webm`)

    const data = await readFile(uploadPath)

    return new NextResponse(data, {
      headers: {
        'Content-Type': 'video/webm',
        'Content-Length': String(data.byteLength),
      },
    })
  } catch (err) {
    console.error('Failed to read upload', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
