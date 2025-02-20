import { Button } from "../ui/button"

interface TipShapeChipsProps {
  shapes: string[]
  selectedShape: string | null
  onShapeSelect: (shape: string | null) => void
}

export function TipShapeChips({ shapes, selectedShape, onShapeSelect }: TipShapeChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {shapes.map((shape) => (
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