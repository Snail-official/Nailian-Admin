"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { FolderHeader } from "./FolderHeader"
import { FolderList } from "./FolderList"
import { FolderCreateDialog } from "./FolderCreateDialog"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { folderApi } from "@/lib/api/folder"
import { toast } from "sonner"
import type { Folder } from "@/types/api/folder"

interface FolderSectionProps {
  onFolderClick?: () => void
}

export function FolderSection({ onFolderClick }: FolderSectionProps) {
  const queryClient = useQueryClient()
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false)

  const { data: folders = [] } = useQuery<Folder[]>({
    queryKey: ['folders'],
    queryFn: folderApi.getFolders
  })

  const createMutation = useMutation({
    mutationFn: folderApi.createFolder,
    onSuccess: () => {
      setIsCreateDialogOpen(false)
      queryClient.invalidateQueries({ queryKey: ['folders'] })
      toast.success('폴더가 생성되었습니다.')
    },
    onError: (error) => {
      toast.error(error.message || '폴더 생성 중 오류가 발생했습니다.')
    }
  })

  const handleCreateFolder = (name: string) => {
    createMutation.mutate(name)
  }

  return (
    <div>
      <FolderHeader 
        onCreateClick={() => setIsCreateDialogOpen(true)}
        disabled={createMutation.isPending}
      />
      <Separator className="my-4 bg-gray-700" />
      <FolderList 
        folders={folders} 
        onFolderClick={onFolderClick}
      />
      
      <FolderCreateDialog
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        onCreateFolder={handleCreateFolder}
        isCreating={createMutation.isPending}
      />
    </div>
  )
} 