import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import IconScrap from "@/assets/icons/icon_scrap.svg"
import IconScrapFilled from "@/assets/icons/icon_scrap_filled.svg"
import { useState } from "react"
import { DeleteButton } from "./DeleteButton"

interface ImageDetailModalProps {
    isOpen: boolean
    tipId: number
    onOpenChange: (open: boolean) => void
    onDelete: (id: number) => void
    onScrap: (id: number) => void
}

export function NailDetailModal({
    isOpen,
    onOpenChange,
    tipId,
    onDelete,
    onScrap
}: ImageDetailModalProps) {
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const tipDetail = {
        id: tipId,
        src: "/mocks/tip.png",
        alt: "네일 이미지 1",
        shape: "아몬드",
        color: "핑크",
        pattern: "그라데이션",
        uploadedBy: "김민지",
        date: "2024-01-15",
        isScraped: true,
    } as const

    const handleDelete = () => {
        onDelete(tipDetail.id)
        setIsDeleteDialogOpen(false)
        onOpenChange(false)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md w-full">
                    <DialogTitle className="text-xl font-bold">
                        네일 상세 정보
                    </DialogTitle>

                    <div className="w-full flex justify-end">
                        <DeleteButton onClick={() => setIsDeleteDialogOpen(true)} />
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* 이미지 영역 */}
                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#CD19FF]">
                            <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 z-10 shadow-sm text-[#CD19FF]"
                                onClick={() => onScrap(tipDetail.id)}
                            >
                                {tipDetail.isScraped ? (
                                    <IconScrapFilled className="w-[24px] h-[24px]" />
                                ) : (
                                    <IconScrap className="w-[24px] h-[24px]" />
                                )}
                            </Button>
                            <Image
                                src={tipDetail.src}
                                alt={tipDetail.alt}
                                fill
                                className="object-cover"
                            />
                        </div>

                        {/* 정보 영역 */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-8">
                                {/* 왼쪽 컬럼: 쉐입, 컬러, 패턴 */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">쉐입</h3>
                                        <p className="text-base font-medium">{tipDetail.shape || '-'}</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">컬러</h3>
                                        <p className="text-base font-medium">{tipDetail.color || '-'}</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">패턴</h3>
                                        <p className="text-base font-medium">{tipDetail.pattern || '-'}</p>
                                    </div>
                                </div>

                                {/* 오른쪽 컬럼: 업로드, 날짜 */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">업로드</h3>
                                        <p className="text-base font-medium">{tipDetail.uploadedBy}</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">날짜</h3>
                                        <p className="text-base font-medium">{tipDetail.date}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 삭제 확인 모달 */}
            <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
                <DialogContent className="max-w-sm">
                    <DialogTitle className="text-lg font-bold mb-4">
                        네일 삭제
                    </DialogTitle>
                    <p className="text-gray-600 mb-6">
                        해당 네일을 삭제하시겠습니까?
                    </p>
                    <div className="flex justify-end gap-2">
                        <Button
                            variant="outline"
                            onClick={() => setIsDeleteDialogOpen(false)}
                        >
                            취소
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                        >
                            삭제
                        </Button>
                    </div>
                </DialogContent>
            </Dialog>
        </>
    )
} 