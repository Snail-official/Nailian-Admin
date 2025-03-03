import { Button } from "@/components/ui/button"
import TrashIcon from "@/assets/icons/TrashIcon.svg"

interface DeleteButtonProps {
  onClick: () => void
  disabled?: boolean
}

export function DeleteButton({ onClick, disabled = false }: DeleteButtonProps) {
  return (
    <Button
      variant="outline"
      className="text-[#FF3535] hover:bg-red-50 hover:text-[#FF3535] disabled:opacity-50 disabled:cursor-not-allowed"
      onClick={onClick}
      disabled={disabled}
    >
      <TrashIcon className="w-5 h-5 mr-2" />
      삭제하기
    </Button>
  )
}