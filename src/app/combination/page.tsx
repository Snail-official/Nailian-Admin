"use client"

import { useState, useEffect, Suspense } from "react"
import { useSearchParams } from "next/navigation"
import { useQuery } from "@tanstack/react-query"
import { finalApi } from "@/lib/api/final"
import { NailFilterSection } from "@/components/filters/NailFilterSection"
import { FolderSelect } from "@/components/folder/FolderSelect"
import { SaveButton } from "@/components/folder/SaveButton"
import { useMutation } from "@tanstack/react-query"
import { toast } from "sonner"
import { Shape, Color, Category } from "@/types/nail"
import { FingerPosition } from "@/types/nail"
import { folderApi } from "@/lib/api/folder"
import { NailBox } from "@/components/nail/NailBox"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { FinalImage } from "@/types/api/final"
import { nailSetApi } from "@/lib/api/nail-set"
import { NailTip } from "@/types/api/nail-set"
import { FINGER_POSITIONS } from "@/types/nail"

function CombinationContent() {
  const searchParams = useSearchParams()
  const setId = searchParams.get('setId')
  const folderId = parseInt(searchParams.get('folderId') || '0')

  const [selectedFolders, setSelectedFolders] = useState<number[]>([])

  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [selectedColor, setSelectedColor] = useState<Color | null>(null)
  const [selectedPattern, setSelectedPattern] = useState<Category | null>(null)

  const [selectedNails, setSelectedNails] = useState<Record<FingerPosition, NailTip | null>>({
    thumb: null,
    index: null,
    middle: null,
    ring: null,
    pinky: null
  })
  
  const [activeFinger, setActiveFinger] = useState<FingerPosition | null>(null)

  // /api/final 데이터 가져오기
  const { data: nailTips } = useQuery<FinalImage[]>({
    queryKey: ['finals', selectedShape, selectedColor, selectedPattern],
    queryFn: () => finalApi.getFinals<FinalImage>({
      shape: selectedShape,
      color: selectedColor,
      category: selectedPattern,
      viewMode: 'all'
    })
  })

  // 세트 데이터 조회
  const { data: setData } = useQuery({
    queryKey: ['nailset', setId],
    queryFn: () => setId ? nailSetApi.getNailSet(parseInt(setId)) : null,
    enabled: !!setId,
  })

  // 폴더 목록 조회
  const { data: folders = [] } = useQuery({
    queryKey: ['folders'],
    queryFn: () => folderApi.getFolders()
  })

  useEffect(() => {
    if (setData) {
      // API 응답으로 받은 데이터를 selectedNails 형식으로 변환
      setSelectedNails({
        thumb: setData.thumb,
        index: setData.index,
        middle: setData.middle,
        ring: setData.ring,
        pinky: setData.pinky
      })
    }
  }, [setData])

  // folderId가 있으면 자동으로 해당 폴더 선택
  useEffect(() => {
    if (folderId) {
      setSelectedFolders([folderId])
    }
  }, [folderId])

  const handleNailClick = (position: FingerPosition) => {
    if (activeFinger === position) {
      setActiveFinger(null)
    } else {
      setActiveFinger(position)
    }
  }

  const handleFolderToggle = (folderId: number) => {
    setSelectedFolders(current =>
      current.includes(folderId)
        ? current.filter(id => id !== folderId)
        : [...current, folderId]
    )
  }

  const handleImageSelect = (image: { id: number; src: string }) => {
    if (activeFinger) {
      setSelectedNails(prev => ({
        ...prev,
        [activeFinger]: {
          tipId: image.id,
          image: image.src
        }
      }))
      setActiveFinger(null)
    }
  }

  // 세트 수정 mutation
  const updateSetMutation = useMutation({
    mutationFn: (id: number) => nailSetApi.updateNailSet(id, {
      thumb: selectedNails.thumb!,
      index: selectedNails.index!,
      middle: selectedNails.middle!,
      ring: selectedNails.ring!,
      pinky: selectedNails.pinky!
    }),
    onSuccess: () => {
      toast.success("세트가 수정되었습니다")
    },
    onError: (error) => {
      toast.error(error.message || "세트 수정 중 오류가 발생했습니다")
    }
  })

  // 새 세트 저장 mutation
  const createSetMutation = useMutation({
    mutationFn: () => nailSetApi.createNailSet({
      folderIds: selectedFolders,
      thumb: selectedNails.thumb!,
      index: selectedNails.index!,
      middle: selectedNails.middle!,
      ring: selectedNails.ring!,
      pinky: selectedNails.pinky!
    }),
    onSuccess: () => {
      toast.success("세트가 저장되었습니다")
    },
    onError: (error) => {
      toast.error(error.message || "세트 저장 중 오류가 발생했습니다")
    }
  })

  const handleSave = () => {
    // 모든 손가락에 네일이 선택되었는지 확인
    const allFingersSelected = FINGER_POSITIONS.every(pos => selectedNails[pos] !== null)
    
    if (!allFingersSelected) {
      toast.error("모든 손가락에 네일을 선택해주세요")
      return
    }

    if (setId) {
      // Case 1: 기존 세트 수정
      updateSetMutation.mutate(parseInt(setId))
    } else if (folderId) {
      // Case 2: 특정 폴더에 새 세트 저장
      createSetMutation.mutate()
    } else if (selectedFolders.length > 0) {
      // Case 3: 선택된 폴더들에 새 세트 저장
      createSetMutation.mutate()
    } else {
      toast.error("저장할 폴더를 선택해주세요")
    }
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
          {FINGER_POSITIONS.map((position) => (
            <NailBox 
              key={position}
              onClick={() => handleNailClick(position)}
              isSelected={activeFinger === position}
              selectedImage={selectedNails[position]?.image}
              onImageDelete={() => {
                setSelectedNails(prev => ({
                  ...prev,
                  [position]: null
                }))
              }}
            />
          ))}
        </div>
      </div>

      <NailFilterSection
        selectedShape={selectedShape}
        selectedColor={selectedColor}
        selectedCategory={selectedPattern}
        onShapeSelect={setSelectedShape}
        onColorSelect={setSelectedColor}
        onCategorySelect={setSelectedPattern}
      />

      <NailTipGrid
        usage="combination"
        images={nailTips?.map((image) => ({
          id: image.id,
          src: image.src,
          username: image.checkedBy || 'Unknown',
          createdAt: image.createdAt,
        })) ?? []}
        selectedImages={Object.values(selectedNails)
          .filter(nail => nail !== null)
          .map(nail => nail!.tipId)}
        onImageSelect={handleImageSelect}
      />
    </div>
  )
}

export default function CombinationPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CombinationContent />
    </Suspense>
  )
}