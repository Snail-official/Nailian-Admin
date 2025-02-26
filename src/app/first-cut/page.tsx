"use client"

import { Button } from "@/components/ui/button"
import CirclePlusIcon from "@/assets/icons/CirclePlusIcon.svg"
import DownloadIcon from "@/assets/icons/DownloadIcon.svg"  
import { useState } from "react"
import { NailTipGrid } from "@/components/nail/NailTipGrid"
import { UploadModal } from "@/components/upload/UploadModal"
import { DeleteDialog } from "@/components/delete/DeleteDialog"
import { DeleteButton } from "@/components/delete/DeleteButton"
import { NailShapeChips } from "@/components/filters/NailShapeChips"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from "sonner"
import { firstCutApi } from "@/lib/api/first-cut"
import { Shape, SHAPES } from "@/types/nail"

export default function FirstCutPage() {
  const queryClient = useQueryClient()
  const [selectedShape, setSelectedShape] = useState<Shape | null>(null)
  const [selectedImages, setSelectedImages] = useState<number[]>([])
  const [isUploadOpen, setIsUploadOpen] = useState(false)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { data: images = [], isLoading } = useQuery({
    queryKey: ['firstCut', selectedShape],
    queryFn: () => firstCutApi.getFirstCuts(selectedShape),
  })

  const uploadMutation = useMutation({
    mutationFn: firstCutApi.uploadFirstCuts,
    onSuccess: () => {
      setIsUploadOpen(false)
      toast.success("업로드가 완료되었습니다.")
      queryClient.invalidateQueries({ queryKey: ['firstCut'] })
    },
    onError: (error: any) => {
      toast.error(error.message || "업로드 중 오류가 발생했습니다.")
    }
  })

  const deleteMutation = useMutation({
    mutationFn: firstCutApi.deleteFirstCuts,
    onSuccess: () => {
      setSelectedImages([])
      setIsDeleteDialogOpen(false)
      toast.success("선택한 이미지가 삭제되었습니다.")
      queryClient.invalidateQueries({ queryKey: ['firstCut'] })
    },
    onError: (error: any) => {
      toast.error(error.message || "삭제 중 오류가 발생했습니다.")
    }
  })

  const handleUploadComplete = (files: File[], shape: Shape) => {
    uploadMutation.mutate({ files, shape })
  }

  const handleDelete = () => {
    deleteMutation.mutate(selectedImages)
  }

  if (isLoading) {
    return <div>로딩 중...</div>
  }

  return (
    <div className="py-6 max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-4 pl-6 pr-[72px]">
        <NailShapeChips
          selectedShape={selectedShape}
          onShapeSelect={setSelectedShape}
        />
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100"
            onClick={() => setIsUploadOpen(true)}
            disabled={uploadMutation.isPending}
          >
            <CirclePlusIcon className="w-5 h-5 mr-2" />
            {uploadMutation.isPending ? "업로드 중..." : "업로드하기"}
          </Button>
          <Button className="bg-black text-white hover:bg-gray-900">
            <DownloadIcon className="w-5 h-5 mr-2" />
            다운로드
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between mb-8 pl-6 pr-[72px]">
        <h1 className="text-2xl font-bold">
          총 <span className="text-[#CD19FF]">{images.length}</span>개
        </h1>
        <DeleteButton 
          onClick={() => setIsDeleteDialogOpen(true)}
          disabled={selectedImages.length === 0 || deleteMutation.isPending}
        />
      </div>

      <NailTipGrid
        images={images.map(image => ({
          id: image.id,
          src: image.src,
          username: image.uploadedBy,
          createdAt: image.createdAt
        }))}
        selectedImages={selectedImages}
        onImageSelect={(id) => setSelectedImages(prev => 
          prev.includes(id) 
            ? prev.filter(imageId => imageId !== id)
            : [...prev, id]
        )}
      />

      <UploadModal
        isOpen={isUploadOpen}
        onOpenChange={setIsUploadOpen}
        onUploadComplete={handleUploadComplete}
      />

      <DeleteDialog
        isOpen={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
        selectedCount={selectedImages.length}
        onDelete={handleDelete}
      />
    </div>
  )
} 