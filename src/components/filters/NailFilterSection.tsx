import { NailColorChips } from "./NailColorChips"
import { NailPatternChips } from "./NailPatternChips"
import { NailShapeChips } from "./NailShapeChips"

interface NailFilterSectionProps {
  selectedShape: string | null
  selectedColor: string | null
  selectedPattern: string | null
  onShapeSelect: (shape: string | null) => void
  onColorSelect: (color: string | null) => void
  onPatternSelect: (pattern: string | null) => void
}

export function NailFilterSection({
  selectedShape,
  selectedColor,
  selectedPattern,
  onShapeSelect,
  onColorSelect,
  onPatternSelect,
}: NailFilterSectionProps) {
    return (
      <div className="space-y-4 mb-8 pl-6 pr-[72px]">
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">쉐입</h2>
          <NailShapeChips
            selectedShape={selectedShape}
            onShapeSelect={onShapeSelect}
          />
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">색상</h2>
          <NailColorChips
            selectedValue={selectedColor}
            onSelect={onColorSelect}
          />
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">패턴</h2>
          <NailPatternChips
            selectedValue={selectedPattern}
            onSelect={onPatternSelect}
          />
        </div>
      </div>
    )
} 