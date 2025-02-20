import { Button } from "../ui/button"

const tipPatterns = ["그라데이션", "원컬러", "프렌치", "아트"]

interface TipPatternChipsProps {
  selectedValue: string | null
  onSelect: (value: string | null) => void
}

export function TipPatternChips({ selectedValue, onSelect }: TipPatternChipsProps) {
  return (
    <div className="flex gap-2 flex-wrap">
      {tipPatterns.map((pattern) => (
        <Button
          key={pattern}
          variant="outline"
          className={`rounded-full transition-colors ${
            selectedValue === pattern 
              ? "bg-[#CD19FF] text-white hover:text-white hover:bg-[#CD19FF]" 
              : "bg-white text-black hover:bg-gray-100"
          }`}
          onClick={() => onSelect(pattern === selectedValue ? null : pattern)}
        >
          {pattern}
        </Button>
      ))}
    </div>
  )
} 