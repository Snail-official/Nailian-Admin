"use client"

import { Button } from "@/components/ui/button"
import IconCirclePlus from "@/assets/icons/icons_circle_plus.svg"
import IconDownload from "@/assets/icons/icon_download.svg"
import { useState } from "react"

import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { UploadModal } from "@/components/upload/UploadModal"
import { DeleteDialog } from "@/components/delete/DeleteDialog"
import { DeleteButton } from "@/components/delete/DeleteButton"
import { NailShapeChips } from "@/components/filters/NailShapeChips"

interface MockImage {
  id: number
  src: string
  alt: string
  uploadedBy: string
  date: string
  shape?: string
}

export default function FirstCutPage() {
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
            <IconCirclePlus className="w-5 h-5 mr-2" />
            업로드하기
          </Button>
          <Button className="bg-black text-white hover:bg-gray-900">
            <IconDownload className="w-5 h-5 mr-2" />
            다운로드
          </Button>
        </div>
      </div>

      {/* 제목 및 삭제 행 */}
      <div className="flex items-center justify-between mb-8 pl-6 pr-[72px]">
        <h1 className="text-2xl font-bold">
          총 <span className="text-[#CD19FF]">{filteredImages.length}</span>개
        </h1>
        <DeleteButton 
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedImages.length === 0}
        />
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
    </div>
  )
} 