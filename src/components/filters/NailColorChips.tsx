import { Button } from "../ui/button"
import { Color, COLORS } from "@/types/nail"

export const COLOR_LABELS: Record<Color, string> = {
  "WHITE": "화이트",
  "BLACK": "블랙",
  "YELLOW": "옐로우",
  "PINK": "핑크",
  "GREEN": "그린",
  "BEIGE": "베이지",
  "BLUE": "블루",
  "SILVER": "실버"
}

interface NailColorChipsProps {
  selectedColor: Color | null
  onColorSelect: (color: Color | null) => void
}

export function NailColorChips({ selectedColor, onColorSelect }: NailColorChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.values(COLORS).map((color) => (
        <Button
          key={color}
          variant="outline"
          className={`rounded-full transition-colors ${
            selectedColor === color 
              ? "bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]" 
              : "bg-white text-black hover:bg-gray-100"
          }`}
          onClick={() => onColorSelect(color === selectedColor ? null : color)}
        >
          {COLOR_LABELS[color]}
        </Button>
      ))}
    </div>
  )
} 