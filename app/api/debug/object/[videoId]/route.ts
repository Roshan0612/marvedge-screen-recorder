import { NextResponse } from 'next/server'
import { HeadObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '@/lib/s3'

export const runtime = 'nodejs'

export async function GET(_req: Request, { params }: { params: { videoId: string } | Promise<{ videoId: string }> }) {
  try {
    const { videoId } = await params
    const key = `recordings/${videoId}.webm`

    const cmd = new HeadObjectCommand({ Bucket: process.env.AWS_S3_BUCKET_NAME!, Key: key })
    const head = await s3.send(cmd)

    return NextResponse.json({ key, contentType: head.ContentType, contentLength: head.ContentLength, metadata: head.Metadata })
  } catch (err) {
    console.error('HeadObject failed', err)
    return NextResponse.json({ error: 'not found' }, { status: 404 })
  }
}
