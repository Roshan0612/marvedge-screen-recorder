import { NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { s3 } from '@/lib/s3'

export const runtime = 'nodejs'

export async function GET(req: Request, { params }: { params: { videoId: string } | Promise<{ videoId: string }> }) {
  try {
    const { videoId } = await params
    const key = `recordings/${videoId}.webm`

    
    const rangeHeader = req.headers.get('range') ?? undefined
    const cmdParams: any = { Bucket: process.env.AWS_S3_BUCKET_NAME!, Key: key }
    if (rangeHeader) cmdParams.Range = rangeHeader

    const cmd = new GetObjectCommand(cmdParams)
    const res = await s3.send(cmd)

    const headers: Record<string, string> = {}
    if (res.ContentType) headers['Content-Type'] = res.ContentType
    if (res.ContentLength != null) headers['Content-Length'] = String(res.ContentLength)
    if (res.AcceptRanges) headers['Accept-Ranges'] = res.AcceptRanges
    if (res.ContentRange) headers['Content-Range'] = res.ContentRange

    const status = res.ContentRange ? 206 : 200

    return new NextResponse(res.Body as any, { status, headers })
  } catch (err) {
    console.error('Raw proxy failed', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
