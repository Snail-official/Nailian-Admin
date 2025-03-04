"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import PencilIcon from "@/assets/icons/PencilIcon.svg"
import TrashIcon from "@/assets/icons/TrashIcon.svg"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { DeleteDialog } from "@/components/delete/DeleteDialog"
import { NailSet } from "@/types/api/nail-set"
import { formatToKST } from "@/lib/date"

interface NailSetDetailModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    nailSet: NailSet
    onDelete?: (id: number) => void
}

export function NailSetDetailModal({ isOpen, onOpenChange, nailSet, onDelete }: NailSetDetailModalProps) {
    const router = useRouter()
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

    // 각 손가락 데이터를 배열로 변환
    const tips = [
        { id: nailSet.thumb.tipId, image: nailSet.thumb.image },
        { id: nailSet.index.tipId, image: nailSet.index.image },
        { id: nailSet.middle.tipId, image: nailSet.middle.image },
        { id: nailSet.ring.tipId, image: nailSet.ring.image },
        { id: nailSet.pinky.tipId, image: nailSet.pinky.image }
    ]

    const handleEdit = () => {
        router.push(`/combination?setId=${nailSet.id}`)
        onOpenChange(false)
    }

    const handleDelete = () => {
        onDelete?.(nailSet.id)
        setIsDeleteDialogOpen(false)
        onOpenChange(false)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle>네일 세트 상세</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col gap-4">
                        <div className="flex items-center justify-between">
                            <div className="text-sm text-gray-600">
                                <p>업로더: {nailSet.uploadedBy || ''}</p>
                                <p>생성일: {nailSet.createdAt ? formatToKST(nailSet.createdAt, 'datetime') : '날짜 없음'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant="default" 
                                    size="sm" 
                                    className="bg-black text-white hover:bg-black/80"
                                    onClick={handleEdit}
                                >
                                    <PencilIcon className="w-4 h-4 mr-2" />
                                    수정하기
                                </Button>
                                <Button 
                                    variant="destructive" 
                                    size="sm"
                                    onClick={() => setIsDeleteDialogOpen(true)}
                                >
                                    <TrashIcon className="w-4 h-4 mr-2" />
                                    삭제하기
                                </Button>
                            </div>
                        </div>
                        {/* 네일 세트 이미지 */}
                        <div className="relative h-40 bg-[#FBEBD8] rounded-lg flex items-center justify-center">
                            {tips.map((tip, index) => (
                                <div
                                    key={tip.id}
                                    className="absolute w-20 aspect-square transform -translate-x-1/2"
                                    style={{
                                        left: `calc(50% + ${(index - 2) * 25}px)`,
                                        top: '50%',
                                        transform: 'translate(-50%, -50%)'
                                    }}
                                >
                                    <Image
                                        src={tip.image}
                                        alt={`네일 ${index + 1}`}
                                        fill
                                        className="object-contain"
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                selectedCount={1}
                onDelete={handleDelete}
            />
        </>
    )
} 