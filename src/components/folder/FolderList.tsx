"use client"

import ChevronRightIcon from "@/assets/icons/ChevronRightIcon.svg"
import { useRouter } from "next/navigation"

interface Folder {
  id: string
  name: string
}

interface FolderListProps {
  folders: Folder[]
  onFolderClick?: () => void
}

export function FolderList({ folders, onFolderClick }: FolderListProps) {
  const router = useRouter()

  const handleFolderClick = (folderId: string) => {
    router.push(`/folder/${folderId}`)
    onFolderClick?.()
  }

  return (
    <div className="space-y-1">
      {folders.map((folder) => (
        <div
          key={folder.id}
          className="cursor-pointer"
          onClick={() => handleFolderClick(folder.id)}
        >
          <div className="flex items-center justify-between px-[32px] pr-[36px] hover:bg-gray-100 transition-colors">
            <span className="py-2">{folder.name}</span>
            <ChevronRightIcon className="w-4 h-4 flex-shrink-0" />
            </div>
        </div>
      ))}
    </div>
  )
} 