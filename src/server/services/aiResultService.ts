import { aiResultRepository } from '@/server/repositories/aiResultRepository'
import { Shape } from '@/types/nail'
import { AiResultImage, AiResultReview } from '@/types/api/ai-result'
import { Prisma } from '@prisma/client'
import { chooseMaskPathBasedOnShape } from '../utils/image'
import { processImageWithMask } from '../utils/image'
import { uploadToS3 } from '../lib/s3'

export class AiResultService {
  private repository = aiResultRepository

  // AI 결과 이미지 조회
  async getAiResults(shape: Shape | null) {
    const assets = await this.repository.findMany({
      shape: shape || undefined
    })

    // 응답 형식으로 변환
    const images: AiResultImage[] = assets.map(asset => ({
      id: asset.id,
      src: asset.image_url,
      shape: asset.shape as Shape,
      uploadedBy: asset.user_nail_assets_uploaded_byTouser.nickname || 'Unknown',
      createdAt: asset.created_at.toISOString()
    }))

    return images
  }

  // AI 결과 이미지 업로드
  async uploadAiResults(files: File[], shape: Shape, adminId: number) {
    const uploadPromises = files.map(async (file) => {
      try {
        // 파일을 버퍼로 변환
        const arrayBuffer = await file.arrayBuffer();
        const buffer = Buffer.from(arrayBuffer);
        
        // 해당 모양에 맞는 마스크 정보 가져오기
        const maskInfo = chooseMaskPathBasedOnShape(shape);
        
        // 이미지 처리 (마스크 적용) - 버퍼 직접 전달
        const processedBuffer = await processImageWithMask(maskInfo, buffer);
        
        // 처리된 이미지 S3에 업로드
        const processedImageBlob = new Blob([processedBuffer], { type: 'image/png' });
        const processedImageUrl = await uploadToS3(
          new File([processedImageBlob], `processed-${Date.now()}.png`, { type: 'image/png' })
        );
        
        // DB에 저장
        return this.repository.create({
          imageUrl: processedImageUrl,
          shape,
          uploadedBy: adminId
        });
      } catch (error) {
        console.error('Error processing image:', error);
        throw error; 
      }
    });

    await Promise.all(uploadPromises);
    return true;
  }

  // AI 결과 이미지 검토
  async reviewAiResults(reviews: AiResultReview[], adminId: number) {
    await this.repository.transaction(async (tx: Prisma.TransactionClient) => {
      for (const review of reviews) {
        if (review.isDeleted) {
          // 삭제 처리
          await this.repository.deleteAiAssetInTx(tx, review.id, adminId)
        } else {
          // 승인된 이미지 처리
          const asset = await this.repository.findByIdInTx(tx, review.id)

          if (asset) {
            
            // nail_tips로 이동
            await this.repository.createNailTipInTx(tx, {
              imageUrl: asset.image_url,
              shape: asset.shape,
              category: review.category!,
              color: review.color!,
              checkedBy: adminId
            })

            // 기존 asset 삭제 처리 (승인된 경우 deleted_by는 null)
            await this.repository.markAssetAsDeletedInTx(tx, asset.id, null)
          }
        }
      }
    })

    return true
  }
}

// 싱글톤 인스턴스 생성
export const aiResultService = new AiResultService() 