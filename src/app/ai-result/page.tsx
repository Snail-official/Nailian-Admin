"use client"

import { Button } from "@/components/ui/button"
import CirclePlusIcon from "@/assets/icons/CirclePlusIcon.svg"
import { useState } from "react"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { UploadModal } from "@/components/upload/UploadModal"
import { DeleteDialog } from "@/components/delete/DeleteDialog"
import { NailShapeChips } from "@/components/filters/NailShapeChips"
import { ReviewModal } from "@/components/review/ReviewModal"

interface MockImage {
  id: number
  src: string
  alt: string
  uploadedBy: string
  date: string
  shape?: string
}

export default function AiResultPage() {
  const [mockImages, setMockImages] = useState<MockImage[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      src: "/mocks/tip.png",
      alt: `네일 이미지 ${i + 1}`,
      uploadedBy: "김민지",
      date: "2024-01-15",
    }))
  )
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isReviewOpen, setIsReviewOpen] = useState(false)

  const filteredImages = selectedShape
    ? mockImages.filter(image => image.shape === selectedShape)
    : mockImages

  const toggleImageSelection = (id: number) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    )
  }

  const handleUploadComplete = (files: File[], shape: string | null) => {
    const newImages: MockImage[] = files.map((file, index) => ({
      id: mockImages.length + index + 1,
      src: URL.createObjectURL(file),
      alt: file.name,
      uploadedBy: "김민지",
      date: new Date().toISOString().split('T')[0],
      shape: shape || undefined
    }))

    setMockImages(prev => [...prev, ...newImages])
  }

  const handleDelete = () => {
    setMockImages(prev => prev.filter(image => !selectedImages.includes(image.id)))
    setSelectedImages([])
    setIsDeleteDialogOpen(false)
  }

  // 선택된 이미지들만 필터링
  const selectedImageData = mockImages
    .filter(img => selectedImages.includes(img.id))
    .map(img => ({
      id: img.id,
      src: img.src
    }))

  const handleReviewComplete = (reviewedData: { id: number; color: string | null; pattern: string | null; isDeleted: boolean }[]) => {
    // 삭제할 이미지 ID들 수집
    const deleteIds = reviewedData.filter(data => data.isDeleted).map(data => data.id)
    
    // 이미지 삭제 처리
    setMockImages(prev => prev.filter(img => !deleteIds.includes(img.id)))
    setSelectedImages([])
  }

  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* 필터 및 버튼 행 */}
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
          >
            <CirclePlusIcon className="w-5 h-5 mr-2" />
            업로드하기
          </Button>
          <Button 
            className="bg-black text-white hover:bg-gray-900"
            onClick={() => setIsReviewOpen(true)}
          >
            검토하기
          </Button>
        </div>
      </div>

      {/* 제목 및 삭제 행 */}
      <div className="flex items-center justify-between mb-8 pl-6 pr-[72px]">
        <h1 className="text-2xl font-bold">
          총 <span className="text-[#CD19FF]">{filteredImages.length}</span>개
        </h1>
      </div>

      <NailTipGrid
        images={filteredImages}
        selectedImages={selectedImages}
        onImageSelect={toggleImageSelection}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUploadComplete={handleUploadComplete}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedCount={selectedImages.length}
        onDelete={handleDelete}
      />

      <ReviewModal
        isOpen={isReviewOpen}
        onOpenChange={setIsReviewOpen}
        images={selectedImageData}
        onComplete={handleReviewComplete}
      />
    </div>
  )
} 