"use client"

import { useState, useEffect } from "react"
import { useSearchParams } from "next/navigation"
import { NailBox } from "@/components/nail/NailBox"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { NailFilterSection } from "@/components/filters/NailFilterSection"
import { FolderSelect } from "@/components/folder/FolderSelect"
import { SaveButton } from "@/components/folder/SaveButton"

interface MockImage {
  id: number
  src: string
  alt: string
  uploadedBy: string
  date: string
  shape?: string
}

const mockNailSets = [
  {
    id: 1,
    uploader: "김네일",
    createdAt: new Date().toISOString().split('T')[0],
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 2,
    uploader: "이네일",
    createdAt: new Date().toISOString().split('T')[0],
    tips: [
      { id: 6, position: "엄지", image: "/mocks/nail.png" },
      { id: 7, position: "검지", image: "/mocks/nail.png" },
      { id: 8, position: "중지", image: "/mocks/nail.png" },
      { id: 9, position: "약지", image: "/mocks/nail.png" },
      { id: 10, position: "소지", image: "/mocks/nail.png" },
    ]
  },
]

export default function CombinationPage() {
  const searchParams = useSearchParams()
  const setId = searchParams.get('setId')
  const folderId = searchParams.get('folderId')
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

  // folderId가 있으면 자동으로 해당 폴더 선택
  useEffect(() => {
    if (folderId) {
      setSelectedFolders([folderId])
    }
  }, [folderId])

  useEffect(() => {
    if (setId) {
      // API 호출
      const nailSet = mockNailSets.find(set => set.id === parseInt(setId))
      if (nailSet) {
        setSelectedNailImages({
          "엄지": nailSet.tips[0].id,
          "검지": nailSet.tips[1].id,
          "중지": nailSet.tips[2].id,
          "약지": nailSet.tips[3].id,
          "소지": nailSet.tips[4].id,
        })
      }
    }
  }, [searchParams])

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
      <div className="flex justify-end mb-4">
        <div className="flex gap-2">
          {!setId && !folderId && (
            <FolderSelect
              selectedFolders={selectedFolders}
              folders={folders}
              onFolderToggle={handleFolderToggle}
            />
          )}
          <SaveButton
            disabled={!setId && !folderId && selectedFolders.length === 0}
            onSave={handleSave}
          />
        </div>
      </div>

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
                  const newImages = { ...prev }
                  delete newImages[nail]
                  return newImages
                })
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