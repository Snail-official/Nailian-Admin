import { Button } from "@/components/ui/button"
import PlusIcon from "@/assets/icons/PlusIcon.svg"
import CircleCheckIcon from "@/assets/icons/CircleCheckIcon.svg"
import CircleDeleteIcon from "@/assets/icons/CircleDeleteIcon.svg"
import Image from "next/image"

interface NailBoxProps {
  onClick: () => void
  isSelected: boolean
  selectedImage?: string
  onImageDelete?: () => void
}

export function NailBox({ onClick, isSelected, selectedImage, onImageDelete }: NailBoxProps) {
  return (
    <div 
      className={`
        group relative border p-4 flex flex-col items-center justify-center cursor-pointer w-[185px] h-[185px] rounded-[10px]
        ${isSelected 
          ? 'border-[#101010] border-solid border-2' 
          : 'border-[#919191] border-dashed'
        }
      `}
      onClick={onClick}
    >
      {selectedImage ? (
        <>
          <div className="w-full h-full relative">
            <Image
              src={selectedImage}
              alt="Selected nail design"
              fill
              className="object-cover rounded-[8px]"
            />
          </div>
          <div 
            className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
            onClick={(e) => {
              e.stopPropagation();
              onImageDelete?.();
            }}
          >
            <CircleDeleteIcon className="w-8 h-8" />
          </div>
        </>
      ) : (
        <Button 
          className="bg-white hover:bg-white text-black" 
          variant="ghost"
        >
          {isSelected ? (
            <CircleCheckIcon className="w-8 h-8" />
          ) : (
            <PlusIcon className="w-6 h-6 [&>path]:stroke-[#CCCCCC]" />
          )}
        </Button>
      )}
    </div>
  )
}
