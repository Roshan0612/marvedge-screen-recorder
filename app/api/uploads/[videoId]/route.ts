import { NextResponse } from 'next/server'
import { GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { s3 } from '@/lib/s3'

export const runtime = 'nodejs'

export async function GET(
  req: Request,
  { params }: { params: { videoId: string } | Promise<{ videoId: string }> }
) {
  try {
    const { videoId } = await params

    const key = `recordings/${videoId}.webm`

    const command = new GetObjectCommand({
      Bucket: process.env.AWS_S3_BUCKET_NAME!,
      Key: key,
    })

    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    })

    return NextResponse.json({ url: signedUrl })
  } catch (err) {
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
