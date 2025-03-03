import { Shape, SHAPES } from "@/types/nail"
import { Button } from "../ui/button"

export const SHAPE_LABELS: Record<Shape, string> = {
  "ALMOND": "아몬드",
  "ROUND": "라운드",
  "STILETTO": "스틸레토",
  "SQUARE": "스퀘어",
  "BALLERINA": "발레리나"
}

interface NailShapeChipsProps {
  selectedShape: Shape | null
  onShapeSelect: (shape: Shape | null) => void
}

export function NailShapeChips({ selectedShape, onShapeSelect }: NailShapeChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {SHAPES.map((shape) => (
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
          {SHAPE_LABELS[shape]}
        </Button>
      ))}
    </div>
  )
} 