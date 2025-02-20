"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import IconTrash from "@/assets/icons/icon_trash.svg"
import IconCirclePlus from "@/assets/icons/icons_circle_plus.svg"
import IconDownload from "@/assets/icons/icon_download.svg"
import IconCheck from "@/assets/icons/icon_check.svg"
import { useState } from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

// Mock 데이터
const mockImages = Array.from({ length: 9 }, (_, i) => ({
  id: i + 1,
  src: "/mocks/tip.png",
  alt: `네일 이미지 ${i + 1}`,
  uploadedBy: "김민지",
  date: "2024-01-15"
}))

const tipShapes = ["아몬드", "라운드", "스틸레토", "스퀘어", "발레리나"]

export default function FirstCutPage() {
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)

  const toggleImageSelection = (id: number) => {
    setSelectedImages(prev => 
      prev.includes(id) 
        ? prev.filter(imageId => imageId !== id)
        : [...prev, id]
    )
  }

  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* 필터 및 버튼 행 */}
      <div className="flex items-center justify-between mb-4 pl-6 pr-[72px]">
        <div className="flex gap-2">
          {tipShapes.map((shape) => (
            <Button
              key={shape}
              variant="outline"
              className={`rounded-full transition-colors ${
                selectedShape === shape 
                  ? "bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]" 
                  : "bg-white text-black hover:bg-gray-100"
              }`}
              onClick={() => setSelectedShape(shape === selectedShape ? null : shape)}
            >
              {shape}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
            <DialogTrigger asChild>
              <Button
                variant="outline"
                className="bg-white text-black hover:bg-gray-100"
              >
                <IconCirclePlus className="w-5 h-5 mr-2" />
                업로드하기
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>이미지 업로드</DialogTitle>
              </DialogHeader>
              <div className="mt-4">
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                  <p className="text-gray-500 mb-2">
                    이미지를 드래그하여 업로드하거나
                  </p>
                  <Button variant="outline" className="mx-auto">
                    파일 선택하기
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
          <Button className="bg-black text-white hover:bg-gray-900">
            <IconDownload className="w-5 h-5" />
            결과처리
          </Button>
        </div>
      </div>

      {/* 제목 및 삭제 행 */}
      <div className="flex items-center justify-between mb-8 pl-6 pr-[72px]">
        <h1 className="text-2xl font-bold">
          총 <span className="text-[#CD19FF]">{mockImages.length}</span>개
        </h1>
        <Button variant="ghost" className="text-gray-600 hover:text-gray-900">
          <IconTrash className="w-5 h-5" />
          <span className="text-[#FF3535]">삭제하기</span>
        </Button>
      </div>

      {/* 이미지 그리드 */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 pl-6 pr-[72px]">
        {mockImages.map((image) => (
          <div 
            key={image.id} 
            className="relative rounded-lg border-2 border-[#CD19FF] overflow-hidden p-2 cursor-pointer"
            onClick={() => toggleImageSelection(image.id)}
          >
            {selectedImages.includes(image.id) && (
              <div className="absolute top-1 right-1 z-10">
                <IconCheck className="w-5 h-5" />
              </div>
            )}
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image.src}
                alt={image.alt}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-2 space-y-1 bg-white flex flex-col justify-center items-center">
              <p className="text-xs text-gray-600">{image.uploadedBy}</p>
              <p className="text-xs text-gray-600">{image.date}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
} 