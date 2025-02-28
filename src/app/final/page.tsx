"use client"

import { Button } from "@/components/ui/button"
import TrashIcon from "@/assets/icons/TrashIcon.svg"
import ScrapIcon from "@/assets/icons/ScrapIcon.svg"
import { useState } from "react"
import { NailFilterSection } from "@/components/filters/NailFilterSection"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { NailDetailModal } from "@/components/nail/NailDetailModal"
import CirclePlusIcon from "@/assets/icons/CirclePlusIcon.svg"
import ExclamationCircleIcon from "@/assets/icons/ExclamationCircleIcon.svg"
import { useRouter } from "next/navigation"
import { Shape, Color, Category, NailType } from "@/types/nail"
import { finalApi } from "@/lib/api/final"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"
import { ReviewModal } from "@/components/review/ReviewModal"
import { aiResultApi } from "@/lib/api"

export default function FinalPage() {
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedCategory, setselectedCategory] = useState<Category | null>(null)
  const [viewMode, setViewMode] = useState<'all' | 'deleted' | 'scraped'>('all')
  const [selectedTipIdForDetail, setSelectedTipIdForDetail] = useState<number | null>(null)
  const [selectedTipIdForReview, setSelectedTipIdForReview] = useState<number | null>(null)

  const router = useRouter()
  const queryClient = useQueryClient()

  const { data: images = [] } = useQuery({
    queryKey: ['finals', selectedShape, selectedColor, selectedCategory, viewMode],
    queryFn: () => finalApi.getFinals({
      shape: selectedShape,
      color: selectedColor,
      category: selectedCategory,
      viewMode
    })
  })


  const reviewMutation = useMutation({
    mutationFn: aiResultApi.reviewResults,
    onSuccess: () => {
      setSelectedTipIdForReview(null)
      toast.success("검토가 완료되었습니다.")
      queryClient.invalidateQueries({ queryKey: ['finals'] })
    },
    onError: (error: any) => {
      toast.error(error.message || "검토 중 오류가 발생했습니다.")
    }
  })

  // 삭제 mutation
  const deleteMutation = useMutation({
    mutationFn: finalApi.deleteFinal,
    onSuccess: () => {
      toast.success("이미지가 성공적으로 삭제되었습니다.")
      queryClient.invalidateQueries({ queryKey: ['finals'] })
      setSelectedTipIdForDetail(null)
    },
    onError: (error: any) => {
      toast.error(error.message || "이미지 삭제 중 오류가 발생했습니다.")
      console.error('Delete error:', error)
    }
  })

  // 스크랩 토글 mutation
  const scrapMutation = useMutation({
    mutationFn: finalApi.toggleScrap,
    onSuccess: (_, id) => {
      toast.success("스크랩 상태가 변경되었습니다.")
      // nailDetail 쿼리 키를 사용해 무효화
      queryClient.invalidateQueries({ queryKey: ['nailDetail', id] })
      // 목록 데이터도 함께 갱신
      queryClient.invalidateQueries({ queryKey: ['finals'] })
    },
    onError: (error: any) => {
      toast.error(error.message || "스크랩 처리 중 오류가 발생했습니다.")
      console.error('Scrap error:', error)
    }
  })

  const handleDelete = (tipId: number) => {
    deleteMutation.mutate(tipId)
  }

  const handleScrap = (tipId: number) => {
    scrapMutation.mutate(tipId)
  }


  const handleReviewComplete = (reviews: { id: number; color: Color | null; category: Category | null; isDeleted: boolean }[]) => {
    reviewMutation.mutate(reviews)
  }

  const handleImageSelect = (id: number, type?: NailType) => {
    if (type === 'FINAL') {
      setSelectedTipIdForDetail(id)
      setSelectedTipIdForReview(null)
    } else if (viewMode === 'deleted' && type === 'AI_GENERATED') {
      setSelectedTipIdForReview(id)
      setSelectedTipIdForDetail(null)
    }
  }

  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* 조합하기 버튼 */}
      <div className="flex justify-end pr-[72px]">
        <Button
          variant="outline"
          className="bg-white text-black hover:bg-gray-50"
          onClick={() => router.push("/combination")}
        >
          <CirclePlusIcon className="h-5 w-5" />
          조합만들기
        </Button>
      </div>

      {/* 필터 섹션 */}
      <NailFilterSection
        selectedShape={selectedShape}
        selectedColor={selectedColor}
        selectedCategory={selectedCategory}
        onShapeSelect={setSelectedShape}
        onColorSelect={setSelectedColor}
        onCategorySelect={setselectedCategory}
      />

      {/* 제목 및 버튼 행 */}
      <div className="flex items-center justify-between mb-8 pl-6 pr-[72px]">
        <h1 className="text-2xl font-bold">
          총 <span className="text-[#CD19FF]">{images.length}</span>개
        </h1>
        <div className="flex gap-3">
          <Button
            variant="outline"
            className={`
              px-4 py-2 rounded-lg border border-gray-100 transition-colors duration-200
              ${viewMode === 'scraped'
                ? 'bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]/90'
                : 'text-black hover:text-black'
              }
            `}
            onClick={() => setViewMode(prev => prev === 'scraped' ? 'all' : 'scraped')}
          >
            <ScrapIcon className={`w-5 h-5 fill-white`} />
            <span className="ml-2 font-medium">스크랩북</span>
          </Button>
          <Button
            variant="outline"
            className={`
              px-4 py-2 rounded-lg border border-gray-100 transition-colors duration-200
              ${viewMode === 'deleted'
                ? 'bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]/90'
                : 'text-black hover:text-black'
              }
            `}
            onClick={() => setViewMode(prev => prev === 'deleted' ? 'all' : 'deleted')}
          >
            <TrashIcon className={`w-5 h-5`} />
            <span className="ml-2 font-medium">삭제된 네일</span>
          </Button>
        </div>
      </div>

      <NailTipGrid
        images={images.map(image => {
          // FinalImage 타입인 경우
          if ('checkedBy' in image) {
            return {
              id: image.id,
              src: image.src,
              username: image.checkedBy || 'Unknown', // FinalImage의 경우 checkedBy를 username으로
              createdAt: image.createdAt,
              type: 'FINAL'
            };
          }
          // AiResultImage 타입인 경우
          else {
            return {
              id: image.id,
              src: image.src,
              username: image.deletedBy || 'Unknown', // AiResultImage의 경우 deletedBy를 username으로
              createdAt: image.createdAt,
              type: 'AI_GENERATED',
              icon: <ExclamationCircleIcon className="w-6 h-6 text-gray-500" />
            };
          }
        })}
        onImageSelect={handleImageSelect}
      />

      {selectedTipIdForDetail && (
        <NailDetailModal
          isOpen={!!selectedTipIdForDetail}
          tipId={selectedTipIdForDetail}
          onOpenChange={(open) => {
            if (!open) setSelectedTipIdForDetail(null)
          }}
          onDelete={handleDelete}
          onScrap={handleScrap}
        />
      )}
      {selectedTipIdForReview && viewMode === 'deleted' && (
        <ReviewModal
          isOpen={!!selectedTipIdForReview}
          onOpenChange={(open) => {
            if (!open) setSelectedTipIdForReview(null)
          }}
          images={images.filter(image => !("checkedBy" in image) && image.id === selectedTipIdForReview)}
          onComplete={handleReviewComplete}
        />
      )}
    </div>
  )
} 