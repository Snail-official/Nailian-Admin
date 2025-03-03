import { Button } from "@/components/ui/button"

interface SaveButtonProps {
  disabled: boolean
  onSave: () => void
}

export function SaveButton({ disabled, onSave }: SaveButtonProps) {
  return (
    <Button 
      variant="outline" 
      className="bg-black text-white hover:bg-black/90 hover:text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
      onClick={onSave}
      disabled={disabled}
    >
      저장하기
    </Button>
  )
} 