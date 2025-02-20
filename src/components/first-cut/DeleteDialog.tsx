import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

interface DeleteDialogProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  selectedCount: number
  onDelete: () => void
}

export function DeleteDialog({ isOpen, onOpenChange, selectedCount, onDelete }: DeleteDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md w-full">
        <DialogHeader>
          <DialogTitle>이미지 삭제</DialogTitle>
        </DialogHeader>
        <div className="py-4">
          <p className="text-center text-gray-600 mb-4">
            선택한 {selectedCount}개의 이미지를 삭제하시겠습니까?
          </p>
          <div className="flex justify-center gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              취소
            </Button>
            <Button
              className="bg-[#FF3535] hover:bg-[#FF3535]/90 text-white"
              onClick={onDelete}
            >
              삭제
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 