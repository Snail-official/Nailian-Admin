import { Button } from "../ui/button"

const tipShapes = ["아몬드", "라운드", "스틸레토", "스퀘어", "발레리나"]

interface TipShapeChipsProps {
  selectedShape: string | null
  onShapeSelect: (shape: string | null) => void
}

export function TipShapeChips({ selectedShape, onShapeSelect }: TipShapeChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tipShapes.map((shape) => (
        <Button
          key={shape}
          variant="outline"
          className={`rounded-full transition-colors ${
            selectedShape === shape 
              ? "bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]" 
              : "bg-white text-black hover:bg-gray-100"
          }`}
          onClick={() => onShapeSelect(shape === selectedShape ? null : shape)}
        >
          {shape}
        </Button>
      ))}
    </div>
  )
} 