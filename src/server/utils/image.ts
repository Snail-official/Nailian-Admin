import { Shape } from "@/types/nail";
import sharp from "sharp";
import { getImageFromS3 } from "../lib/s3";

export function chooseMaskPathBasedOnShape(shape: Shape): { bucket: string, key: string } {
  // S3 경로 형식으로 변경 (버킷/키 형식)
  const maskMapping: Record<Shape, { bucket: string, key: string }> = {
    ROUND: { 
      bucket: process.env.AWS_BUCKET_NAME || 'nailian-assets', 
      key: 'base/round.png' 
    },
    SQUARE: { 
      bucket: process.env.AWS_BUCKET_NAME || 'nailian-assets', 
      key: 'base/square.png' 
    },
    STILETTO: { 
      bucket: process.env.AWS_BUCKET_NAME || 'nailian-assets', 
      key: 'base/stiletto.png' 
    },
    BALLERINA: { 
      bucket: process.env.AWS_BUCKET_NAME || 'nailian-assets', 
      key: 'base/ballerina.png' 
    },
    ALMOND: { 
      bucket: process.env.AWS_BUCKET_NAME || 'nailian-assets', 
      key: 'base/almond.png' 
    },
  };
  
  // 객체 직접 반환
  return maskMapping[shape];
}

  
export async function processImageWithMask(maskInfo: { bucket: string, key: string }, imageBuffer: Buffer): Promise<Buffer> {
  try {
    // 마스크 이미지 가져오기
    const maskBuffer = await getImageFromS3(maskInfo.bucket, maskInfo.key);

    // 베이스 이미지(마스크) 정보 가져오기
    const baseImageInfo = await sharp(maskBuffer).metadata();

    // 컬러 네일 이미지 리사이징 (Nearest Neighbor 방식)
    const resizedColorNail = await sharp(imageBuffer)
      .resize({
        width: baseImageInfo.width,
        height: baseImageInfo.height,
        kernel: sharp.kernel.nearest,
        fit: 'fill'
      })
      .toBuffer();

    // 베이스 이미지에서 투명한 부분 마스크 추출
    const { data: baseData, info: baseInfo } = await sharp(maskBuffer)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 리사이징된 컬러 네일 이미지 로드
    const { data: colorData } = await sharp(resizedColorNail)
      .ensureAlpha()
      .raw()
      .toBuffer({ resolveWithObject: true });

    // 새 이미지 데이터 생성
    const pixelCount = baseInfo.width * baseInfo.height;
    const newData = Buffer.alloc(pixelCount * 4);

    // 픽셀 단위로 처리 (베이스 이미지의 투명한 부분에만 tip 이미지 픽셀 적용)
    for (let i = 0; i < pixelCount; i++) {
      const baseAlpha = baseData[i * 4 + 3];
      
      // 베이스 이미지가 투명한 부분 (알파값 1 미만)인 경우 tip 이미지 픽셀 사용
      if (baseAlpha < 1) {
        newData[i * 4] = colorData[i * 4];       // R
        newData[i * 4 + 1] = colorData[i * 4 + 1]; // G
        newData[i * 4 + 2] = colorData[i * 4 + 2]; // B
        newData[i * 4 + 3] = colorData[i * 4 + 3]; // A
      } else {
        // 나머지는 완전 투명 처리
        newData[i * 4] = 0;
        newData[i * 4 + 1] = 0;
        newData[i * 4 + 2] = 0;
        newData[i * 4 + 3] = 0;
      }
    }

    // 새 이미지 생성 및 버퍼로 반환
    return await sharp(newData, {
      raw: {
        width: baseInfo.width,
        height: baseInfo.height,
        channels: 4
      }
    }).png().toBuffer();
  } catch {
    throw new Error('이미지 처리 중 오류');
  }
}