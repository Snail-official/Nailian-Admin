import { CATEGORIES, Category } from "@/types/nail"
import { Button } from "../ui/button"

export const CATEGORY_LABELS: Record<Category, string> = {
  "GRADIENT": "그라데이션",
  "ONE_COLOR": "원컬러",
  "FRENCH": "프렌치",
  "ART": "아트"
}

interface NailCategoryChipsProps {
  selectedCategory: Category | null
  onCategorySelect: (category: Category | null) => void
}

export function NailCategoryChips({ selectedCategory, onCategorySelect }: NailCategoryChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {Object.values(CATEGORIES).map((category) => (
        <Button
          key={category}
          variant="outline"
          className={`rounded-full transition-colors ${
            selectedCategory === category 
              ? "bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]" 
              : "bg-white text-black hover:bg-gray-100"
          }`}
          onClick={() => onCategorySelect(category === selectedCategory ? null : category)}
        >
          {CATEGORY_LABELS[category]}
        </Button>
      ))}
    </div>
  )
} 