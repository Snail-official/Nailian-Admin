import 'server-only'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import crypto from 'crypto'

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

export async function uploadToS3(file: File): Promise<string> {
  try {
    const arrayBuffer = await file.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    // SHA256 해시계산
    const hash = crypto.createHash('sha256').update(buffer).digest('hex')
    const folder = hash.slice(0, 2)
    const extension = 'png'
    const key = `nail/${folder}/${hash}.${extension}`

    await s3Client.send(
      new PutObjectCommand({
        Bucket: process.env.AWS_BUCKET_NAME || 'nailian-assets',
        Key: key,
        Body: buffer,
        ContentType: 'image/png',
      })
    )

    return `${process.env.AWS_CLOUDFRONT_DOMAIN}/${key}`
  } catch (error) {
    console.error('S3 Upload Error:', error)
    throw new Error('파일 업로드 중 오류가 발생했습니다.')
  }
}
