import FolderIcon from "@/assets/icons/FolderIcon.svg"
import PlusIcon from "@/assets/icons/PlusIcon.svg"

interface FolderHeaderProps {
  onCreateClick: () => void
}

export function FolderHeader({ onCreateClick }: FolderHeaderProps) {
  return (
    <div className="px-[32px] pr-[36px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderIcon className="w-5 h-5 flex-shrink-0" />
          <div className="flex justify-center items-center">
            <span className="inline-flex items-center">폴더</span>
          </div>
        </div>
        <button onClick={onCreateClick}>
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
} 