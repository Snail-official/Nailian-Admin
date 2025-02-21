import { Button } from "../ui/button"

const tipColors = ["화이트", "블랙", "옐로우", "핑크", "그린", "베이지", "블루", "실버"]

interface NailColorChipsProps {
  selectedValue: string | null
  onSelect: (value: string | null) => void
}

export function NailColorChips({ selectedValue, onSelect }: NailColorChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tipColors.map((color) => (
        <Button
          key={color}
          variant="outline"
          className={`rounded-full transition-colors ${
            selectedValue === color 
              ? "bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]" 
              : "bg-white text-black hover:bg-gray-100"
          }`}
          onClick={() => onSelect(color === selectedValue ? null : color)}
        >
          {color}
        </Button>
      ))}
    </div>
  )
} 