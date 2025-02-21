"use client"

import { useState } from "react"
import { NailBox } from "@/components/nail/NailBox"
import { NailShapeChips } from "@/components/filters/NailShapeChips"
import { NailColorChips } from "@/components/filters/NailColorChips"
import { NailPatternChips } from "@/components/filters/NailPatternChips"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { FolderSaveControls } from "@/components/folder/FolderSaveControls"
import { NailFilterSection } from "@/components/filters/NailFilterSection"

interface MockImage {
  id: number
  src: string
  alt: string
  uploadedBy: string
  date: string
  shape?: string
}

export default function CombinationPage() {
  const [selectedFolders, setSelectedFolders] = useState<string[]>([])
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [selectedColor, setSelectedColor] = useState<string | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<string | null>(null)
  const [mockImages] = useState<MockImage[]>(
    Array.from({ length: 9 }, (_, i) => ({
      id: i + 1,
      src: "/mocks/tip.png",
      alt: `네일 이미지 ${i + 1}`,
      uploadedBy: "김민지",
      date: "2024-01-15",
    }))
  )
  const [selectedNailImages, setSelectedNailImages] = useState<Record<string, number>>({})
  const [activeNail, setActiveNail] = useState<string | null>(null)

  // 폴더 목록 
  const folders = [
    { id: '1', name: '웨딩네일' },
    { id: '2', name: '데일리네일' },
    { id: '3', name: '파티네일' },
    { id: '4', name: '심플네일' },
  ]

  const handleNailClick = (nail: string) => {
    if (activeNail === nail) {
      setActiveNail(null)
    } else {
      setActiveNail(nail)
    }
  }

  const handleFolderToggle = (folderId: string) => {
    setSelectedFolders(current =>
      current.includes(folderId)
        ? current.filter(id => id !== folderId)
        : [...current, folderId]
    )
  }

  const handleImageSelect = (imageId: number) => {
    if (activeNail) {
      setSelectedNailImages(prev => ({
        ...prev,
        [activeNail]: imageId
      }))
      setActiveNail(null)
    }
  }

  const handleSave = () => {
    // 저장 로직 구현
    console.log('Saving...')
  }

  return (
    <div className="p-4 max-w-6xl mx-auto">
      <FolderSaveControls
        selectedFolders={selectedFolders}
        folders={folders}
        onFolderToggle={handleFolderToggle}
        onSave={handleSave}
      />

      <div className="flex justify-center mb-4">
        <div className="flex gap-5">
          {["엄지", "검지", "중지", "약지", "소지"].map((nail) => (
            <NailBox 
              key={nail} 
              onClick={() => handleNailClick(nail)}
              isSelected={activeNail === nail}
              selectedImage={selectedNailImages[nail] ? `/mocks/tip.png` : undefined}
              onImageDelete={() => {
                setSelectedNailImages(prev => {
                  const newImages = { ...prev };
                  delete newImages[nail];
                  return newImages;
                });
              }}
            />
          ))}
        </div>
      </div>

      <NailFilterSection
        selectedShape={selectedShape}
        selectedColor={selectedColor}
        selectedPattern={selectedPattern}
        onShapeSelect={setSelectedShape}
        onColorSelect={setSelectedColor}
        onPatternSelect={setSelectedPattern}
      />

      <NailTipGrid
        images={mockImages}
        selectedImages={Object.values(selectedNailImages)}
        onImageSelect={handleImageSelect}
      />
    </div>
  )
}