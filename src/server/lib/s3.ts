import 'server-only'
import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
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

export async function getImageFromS3(bucket: string, key: string): Promise<Buffer> {
  try {
    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });
    
    const response = await s3Client.send(command);
    
    // 응답 본문을 버퍼로 변환
    const chunks: Buffer[] = [];
    for await (const chunk of response.Body as any) {
      chunks.push(Buffer.from(chunk));
    }
    
    return Buffer.concat(chunks);
  } catch (error) {
    console.error('S3에서 이미지 가져오기 실패:', error);
    throw new Error(`S3에서 이미지를 가져올 수 없습니다: ${bucket}/${key}`);
  }
}
