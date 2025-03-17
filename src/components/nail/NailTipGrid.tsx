import Image from "next/image"
import CheckIcon from "@/assets/icons/CheckIcon.svg"
import { NailType } from "@/types/nail"
import { formatToKST } from "@/lib/date"
import { useState, useEffect, useMemo } from "react"

export interface Image {
  id: number
  src: string
  username: string
  createdAt: string
  type?: NailType
  icon?: React.ReactNode
  isDownloaded?: boolean
}

// 각 사용처별 Props 타입 정의
interface BaseNailTipGridProps {
  images: Image[]
  selectedImages?: number[]
}

interface FinalPageGridProps extends BaseNailTipGridProps {
  usage: 'final'
  onImageSelect: (id: number, type: NailType) => void
}

interface CombinationPageGridProps extends BaseNailTipGridProps {
  usage: 'combination'
  onImageSelect: (image: { id: number; src: string }) => void
}

interface DefaultGridProps extends BaseNailTipGridProps {
  usage?: never
  onImageSelect: (ids: number[]) => void  // 다중 선택을 위해 배열로 변경
}

type NailTipGridProps = FinalPageGridProps | CombinationPageGridProps | DefaultGridProps

export function NailTipGrid(props: NailTipGridProps) {
  const { images, selectedImages: externalSelectedImages } = props
  const selectedImages = useMemo(() => externalSelectedImages || [], [externalSelectedImages])

  // 내부 선택 상태 관리 (다중 선택용)
  const [internalSelectedImages, setInternalSelectedImages] = useState<number[]>(selectedImages ?? [])
  // 마지막으로 클릭한 이미지 인덱스 저장
  const [lastClickedIndex, setLastClickedIndex] = useState<number | null>(null)
  // Shift 키 상태 추적
  const [isShiftKeyPressed, setIsShiftKeyPressed] = useState(false)

  // 다중 선택 모드인지 확인 (usage가 없으면 항상 다중 선택)
  const isMultiSelectMode = !('usage' in props)

  // Shift 키 상태 감지
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftKeyPressed(true)
      }
    }

    const handleKeyUp = (e: KeyboardEvent) => {
      if (e.key === 'Shift') {
        setIsShiftKeyPressed(false)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    window.addEventListener('keyup', handleKeyUp)

    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('keyup', handleKeyUp)
    }
  }, [])

  // 외부에서 selectedImages가 변경되면 내부 상태도 업데이트
  useEffect(() => {
    if (JSON.stringify(selectedImages) !== JSON.stringify(internalSelectedImages)) {
      setInternalSelectedImages(selectedImages ?? [])
    }
  }, [selectedImages, internalSelectedImages])


  const handleImageClick = (image: Image, index: number) => {
    if ('usage' in props) {
      switch (props.usage) {
        case 'final':
          if (image.type) {
            props.onImageSelect(image.id, image.type)
          }
          break
        case 'combination':
          props.onImageSelect({ id: image.id, src: image.src })
          break
      }
    } else {
      // 기본 모드 (항상 다중 선택 지원)
      if (isMultiSelectMode) {
        let newSelectedImages = [...internalSelectedImages]

        // Shift 키를 누른 상태에서 클릭하고, 이전에 클릭한 이미지가 있는 경우
        if (isShiftKeyPressed && lastClickedIndex !== null) {
          const start = Math.min(lastClickedIndex, index)
          const end = Math.max(lastClickedIndex, index)

          // 시작과 끝 사이의 모든 이미지 ID 가져오기
          const rangeIds = images.slice(start, end + 1).map(img => img.id)

          // 이미 선택된 이미지와 새로 선택할 범위를 합치기
          const allSelectedIds = new Set([...internalSelectedImages, ...rangeIds])
          newSelectedImages = Array.from(allSelectedIds)
        } else {
          // 일반 클릭 - 토글 방식
          const isSelected = internalSelectedImages.includes(image.id)

          if (isSelected) {
            newSelectedImages = internalSelectedImages.filter(id => id !== image.id)
          } else {
            newSelectedImages = [...internalSelectedImages, image.id]
          }
        }

        // 마지막으로 클릭한 인덱스 업데이트
        setLastClickedIndex(index)

        // 내부 상태 업데이트
        setInternalSelectedImages(newSelectedImages)

        // 부모 컴포넌트에 선택 상태 전달
        props.onImageSelect(newSelectedImages)
      }
    }
  }


  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 pl-6 pr-[72px]">
      {images.map((image, index) => {
        // 현재 이미지가 선택되었는지 확인
        const isSelected = isMultiSelectMode
          ? internalSelectedImages.includes(image.id)
          : selectedImages.includes(image.id)

        return (
          <div
            key={`${image.id}-${image.createdAt}`}
            className={`relative rounded-md overflow-hidden cursor-pointer ${image.isDownloaded ? '' : 'border-2'
              } ${isSelected ? 'ring-2 ring-[#CD19FF]' : ''}`}
            onClick={() => handleImageClick(image, index)}
          >
            {isSelected && (
              <div className="absolute top-1 right-1 z-10">
                <CheckIcon className="w-5 h-5" />
              </div>
            )}
            {
              image.icon && (
                <div className="absolute top-1 left-2 z-10">
                  {image.icon}
                </div>
              )
            }
            <div className="relative aspect-square rounded-lg overflow-hidden">
              <Image
                src={image.src}
                alt={`nail design uploaded by ${image.username}`}
                fill
                className="object-cover hover:scale-105 transition-transform duration-200"
              />
            </div>
            <div className="p-2 space-y-1 bg-white flex flex-col justify-center items-center">
              <p className="text-xs text-gray-600">{image.username}</p>
              <p className="text-xs text-gray-600">
                {formatToKST(image.createdAt, 'datetime')}
              </p>
            </div>
            {image.isDownloaded && (
              <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
} 