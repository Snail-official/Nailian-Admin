"use client"

import { Button } from "@/components/ui/button"
import TrashIcon from "@/assets/icons/TrashIcon.svg"
import ScrapIcon from "@/assets/icons/ScrapIcon.svg"
import { useState } from "react"
import { NailShapeChips } from "@/components/filters/NailShapeChips"
import { NailColorChips } from "@/components/filters/NailColorChips"
import { NailPatternChips } from "@/components/filters/NailPatternChips"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { NailDetailModal } from "@/components/nail/NailDetailModal"
import CirclePlusIcon from "@/assets/icons/CirclePlusIcon.svg"
import { useRouter } from "next/navigation"

interface MockImage {
  id: number
  src: string
  alt: string
  uploadedBy: string
  date: string
  shape?: string
  color?: string
  pattern?: string
  isScraped?: boolean
  isDeleted?: boolean
}

export default function FinalPage() {
  const [mockImages, setMockImages] = useState<MockImage[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      src: "/mocks/tip.png",
      alt: `네일 이미지 ${i + 1}`,
      uploadedBy: "김민지",
      date: "2024-01-15",
      isScraped: false,
      isDeleted: false,
    }))
  )
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [viewMode, setViewMode] = useState<'all' | 'deleted' | 'scraped'>('all')
  const [selectedTipIdForDetail, setSelectedTipIdForDetail] = useState<number | null>(null)
  const router = useRouter()

  const filteredImages = mockImages.filter(image => {
    // 삭제된 이미지 필터
    if (viewMode === 'deleted') return image.isDeleted
    // 스크랩된 이미지 필터
    if (viewMode === 'scraped') return image.isScraped && !image.isDeleted
    // 일반 모드 (삭제되지 않은 이미지만)
    if (!image.isDeleted) {
      if (selectedShape && image.shape !== selectedShape) return false
      if (selectedColor && image.color !== selectedColor) return false
      if (selectedPattern && image.pattern !== selectedPattern) return false
      return true
    }
    return false
  })

  const handleTipImageClick = (id: number) => {
    setSelectedTipIdForDetail(id)
  }

  const handleDelete = () => {
    setMockImages(prev => prev.map(image =>
      selectedImages.includes(image.id)
        ? { ...image, isDeleted: true }
        : image
    ))
    setSelectedImages([])
  }

  const toggleScrap = (id: number) => {
    setMockImages(prev => prev.map(image =>
      image.id === id
        ? { ...image, isScraped: !image.isScraped }
        : image
    ))
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
      <div className="space-y-4 mb-8 pl-6 pr-[72px]">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">쉐입</h2>
          <NailShapeChips
            selectedShape={selectedShape}
            onShapeSelect={setSelectedShape}
          />
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">색상</h2>
          <NailColorChips
            selectedValue={selectedColor}
            onSelect={setSelectedColor}
          />
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">패턴</h2>
          <NailPatternChips
            selectedValue={selectedPattern}
            onSelect={setSelectedPattern}
          />
        </div>
      </div>

      {/* 제목 및 버튼 행 */}
      <div className="flex items-center justify-between mb-8 pl-6 pr-[72px]">
        <h1 className="text-2xl font-bold">
          총 <span className="text-[#CD19FF]">{filteredImages.length}</span>개
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
        images={filteredImages}
        selectedImages={selectedImages}
        onImageSelect={handleTipImageClick}
      />

      {selectedTipIdForDetail && (
        <NailDetailModal
          isOpen={!!selectedTipIdForDetail}
          tipId={selectedTipIdForDetail}
          onOpenChange={(open) => {
            if (!open) setSelectedTipIdForDetail(null)
          }}
          onDelete={handleDelete}
          onScrap={toggleScrap}
        />
      )}
    </div>
  )
} 