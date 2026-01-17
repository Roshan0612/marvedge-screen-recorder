import { NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const runtime = 'nodejs'

const s3 = new S3Client({
  region: process.env.AWS_REGION!,
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
  },
})

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

    // Signed URL valid for 5 minutes
    const signedUrl = await getSignedUrl(s3, command, {
      expiresIn: 300,
    })

    return NextResponse.json({ url: signedUrl })
  } catch (err) {
    console.error('Failed to generate signed URL', err)
    return NextResponse.json({ error: 'Not found' }, { status: 404 })
  }
}
