import FolderIcon from "@/assets/icons/FolderIcon.svg"
import PlusIcon from "@/assets/icons/PlusIcon.svg"

interface FolderHeaderProps {
  onCreateClick: () => void
  disabled?: boolean
}

export function FolderHeader({ onCreateClick, disabled }: FolderHeaderProps) {
  return (
    <div className="px-[32px] pr-[36px]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <FolderIcon className="w-5 h-5 flex-shrink-0" />
          <div className="flex justify-center items-center">
            <span className="inline-flex items-center">폴더</span>
          </div>
        </div>
        <button 
          onClick={onCreateClick}
          disabled={disabled}
          className={`${disabled ? 'opacity-50 cursor-not-allowed' : 'hover:opacity-70'}`}
        >
          <PlusIcon className="w-5 h-5" />
        </button>
      </div>
    </div>
  )
} 