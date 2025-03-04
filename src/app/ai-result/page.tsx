"use client"

import { Button } from "@/components/ui/button"
import CirclePlusIcon from "@/assets/icons/CirclePlusIcon.svg"
import { useState } from "react"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { UploadModal } from "@/components/upload/UploadModal"
import { NailShapeChips } from "@/components/filters/NailShapeChips"
import { ReviewModal } from "@/components/review/ReviewModal"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner"
import { aiResultApi } from "@/lib/api/ai-result"
import { Category, Color, Shape } from "@/types/nail"

export default function AiResultPage() {
  const queryClient = useQueryClient()
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['aiResults', selectedShape],
    queryFn: () => aiResultApi.getResults(selectedShape),
  })

  const uploadMutation = useMutation({
    mutationFn: aiResultApi.uploadResults,
    onSuccess: () => {
      setIsUploadOpen(false)
      toast.success("업로드가 완료되었습니다.")
      queryClient.invalidateQueries({ queryKey: ['aiResults'] })
    },
    onError: (error) => {
      toast.error(error.message || "업로드 중 오류가 발생했습니다.")
    }
  })

  const reviewMutation = useMutation({
    mutationFn: aiResultApi.reviewResults,
    onSuccess: () => {
      setIsReviewOpen(false)
      toast.success("검토가 완료되었습니다.")
      queryClient.invalidateQueries({ queryKey: ['aiResults'] })
    },
    onError: (error) => {
      toast.error(error.message || "검토 중 오류가 발생했습니다.")
    }
  })

  const handleUploadComplete = (files: File[], shape: Shape | null) => {
    uploadMutation.mutate({ files, shape })
  }

  const handleReviewComplete = (reviews: { id: number; color: Color | null; category: Category | null; isDeleted: boolean }[]) => {
    reviewMutation.mutate(reviews)
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 pl-6 pr-[72px]">
        <NailShapeChips
          selectedShape={selectedShape}
          onShapeSelect={setSelectedShape}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100"
            onClick={() => setIsUploadOpen(true)}
            disabled={uploadMutation.isPending}
          >
            <CirclePlusIcon className="w-5 h-5 mr-2" />
            {uploadMutation.isPending ? "업로드 중..." : "업로드하기"}
          </Button>
          <Button
            className="bg-black text-white hover:bg-gray-900"
            onClick={() => setIsReviewOpen(true)}
            disabled={reviewMutation.isPending || selectedImages.length === 0}
          >
            {reviewMutation.isPending ? "검토 중..." : "검토하기"}
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 pl-6 pr-[72px]">
        <h1 className="text-2xl font-bold">
          총 <span className="text-[#CD19FF]">{images.length}</span>개
        </h1>
      </div>

      <NailTipGrid
        images={images.map(image => ({
          id: image.id,
          src: image.src,
          username: image.uploadedBy,
          createdAt: image.createdAt
        }))}
        selectedImages={selectedImages}
        onImageSelect={(selectedIds) => {
          if (Array.isArray(selectedIds)) {
            setSelectedImages(selectedIds);
          } else {
            setSelectedImages(prev => 
              prev.includes(selectedIds) 
                ? prev.filter(imageId => imageId !== selectedIds)
                : [...prev, selectedIds]
            );
          }
        }}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUploadComplete={handleUploadComplete}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        images={images.filter(img => selectedImages.includes(img.id))}
        onComplete={handleReviewComplete}
      />
    </div>
  )
} 