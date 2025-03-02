import Image from "next/image"
import CheckIcon from "@/assets/icons/CheckIcon.svg"
import { NailType } from "@/types/nail"

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
  onImageSelect: (id: number) => void
}

type NailTipGridProps = FinalPageGridProps | CombinationPageGridProps | DefaultGridProps

export function NailTipGrid(props: NailTipGridProps) {
  const { images, selectedImages } = props

  const handleImageClick = (image: Image) => {
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
      // usage가 없는 경우 (기본 동작)
      props.onImageSelect(image.id)
    }
  }

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-4 pl-6 pr-[72px]">
      {images.map((image) => (
        <div 
          key={`${image.id}-${image.createdAt}`}
          className={`relative rounded-md overflow-hidden cursor-pointer ${image.isDownloaded ? '' : 'border-2'}`}
          onClick={() => handleImageClick(image)}
        >
          {selectedImages && selectedImages.includes(image.id) && (
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
              {new Date(image.createdAt).toISOString().replace('T', ' ').slice(0, 16)}
            </p>
          </div>
          {image.isDownloaded && (
            <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
            </div>
          )}
        </div>
      ))}
    </div>
  )
} 