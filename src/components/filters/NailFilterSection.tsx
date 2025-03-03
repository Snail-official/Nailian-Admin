import { Category, Color, Shape } from "@/types/nail"
import { NailColorChips } from "./NailColorChips"
import { NailShapeChips } from "./NailShapeChips"
import { NailCategoryChips } from "./NailCategoryChips"

interface NailFilterSectionProps {
  selectedShape: Shape | null
  selectedColor: Color | null
  selectedCategory: Category | null
  onShapeSelect: (shape: Shape | null) => void
  onColorSelect: (color: Color | null) => void
  onCategorySelect: (category: Category | null) => void
}

export function NailFilterSection({
  selectedShape,
  selectedColor,
  selectedCategory,
  onShapeSelect,
  onColorSelect,
  onCategorySelect,
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
            selectedColor={selectedColor}
            onColorSelect={onColorSelect}
          />
        </div>
        <div className="flex items-center gap-4">
          <h2 className="text-lg font-medium">패턴</h2>
          <NailCategoryChips
            selectedCategory={selectedCategory}
            onCategorySelect={onCategorySelect}
          />
        </div>
      </div>
    )
} 