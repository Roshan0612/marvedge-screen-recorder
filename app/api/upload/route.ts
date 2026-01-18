import { NextRequest, NextResponse } from 'next/server'
import { writeFile, mkdir } from 'fs/promises'
import path from 'path'
import { randomUUID } from 'crypto'
import { PutObjectCommand } from "@aws-sdk/client-s3"
import { s3 } from "@/lib/s3"

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

    
    const buffer = Buffer.from(await (file as any).arrayBuffer())
    const s3Key = `recordings/${videoId}.webm`

    await s3.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_S3_BUCKET_NAME!,
        Key: s3Key,
        Body: buffer,
        ContentType: 'video/webm',
      })
    )

    
    const dataDir = path.join(process.cwd(), 'data')
    await mkdir(dataDir, { recursive: true })

    const meta = {
      videoId,
      s3Key,
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
