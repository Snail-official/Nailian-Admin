"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { FolderHeader } from "./FolderHeader"
import { FolderList } from "./FolderList"
import { FolderCreateDialog } from "./FolderCreateDialog"

interface Folder {
  id: string
  name: string
}

interface FolderSectionProps {
  onFolderClick?: () => void
}

export function FolderSection({ onFolderClick }: FolderSectionProps) {
  const [folders, setFolders] = useState<Folder[]>([])
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const handleCreateFolder = (name: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name: name
    }
    setFolders(prev => [...prev, newFolder])
  }

  return (
    <div>
      <FolderHeader onCreateClick={() => setIsCreateDialogOpen(true)} />
      <Separator className="my-4 bg-gray-700" />
      <FolderList 
        folders={folders} 
        onFolderClick={onFolderClick}
      />
      
      <FolderCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateFolder={handleCreateFolder}
      />
    </div>
  )
} 