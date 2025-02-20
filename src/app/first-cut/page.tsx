"use client"

import { Button } from "@/components/ui/button"
import Image from "next/image"
import IconTrash from "@/assets/icons/icon_trash.svg"
import IconCirclePlus from "@/assets/icons/icons_circle_plus.svg"
import IconDownload from "@/assets/icons/icon_download.svg"

// Mock 데이터
const mockImages = Array.from({ length: 12 }, (_, i) => ({
  id: i + 1,
  src: "/mocks/tip.png",
  alt: `네일 이미지 ${i + 1}`,
  uploadedBy: "김민지",
  date: "2024-01-15"
}))

const tipShapes = ["아몬드", "라운드", "스틸레토", "스퀘어", "발레리나"]

export default function FirstCutPage() {
  return (
    <div className="py-6 max-w-6xl mx-auto">
      {/* 필터 및 버튼 행 */}
      <div className="flex items-center justify-between mb-12 pl-6 pr-[72px]">
        <div className="flex gap-2">
          {tipShapes.map((shape) => (
            <Button
              key={shape}
              variant="outline"
              className="rounded-full bg-white text-black hover:bg-gray-100"
            >
              {shape}
            </Button>
          ))}
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100"
          >
            <IconCirclePlus className="w-5 h-5" />
            업로드하기
          </Button>
          <Button className="bg-black text-white hover:bg-gray-900">
            <IconDownload className="w-5 h-5" />
            다운로드
          </Button>
        </div>
      </div>

      {/* 제목 및 삭제 행 */}
      <div className="flex items-center justify-between mb-4 pl-6 pr-[72px]">
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
            className="relative rounded-lg border-2 border-[#CD19FF] overflow-hidden p-2"
          >
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