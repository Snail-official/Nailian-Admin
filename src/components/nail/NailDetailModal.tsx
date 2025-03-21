import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import ScrapIcon from "@/assets/icons/ScrapIcon.svg"
import ScrapFilledIcon from "@/assets/icons/ScrapFilledIcon.svg"
import { useState } from "react"
import { DeleteButton } from "../delete/DeleteButton"
import { DeleteDialog } from "../delete/DeleteDialog"
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { finalApi } from '@/lib/api/final'
import { SHAPE_LABELS } from "../filters/NailShapeChips"
import { COLOR_LABELS } from "../filters/NailColorChips"
import { CATEGORY_LABELS } from "../filters/NailCategoryChips"
import { toast } from "sonner"
import { RefreshCcw } from "lucide-react"
import { formatToKST } from "@/lib/date"

interface NailDetailModalProps {
    isOpen: boolean
    tipId: number
    onOpenChange: (open: boolean) => void
    onDelete: (tipId: number) => void
    onScrap: (tipId: number) => void
}

export function NailDetailModal({
    isOpen,
    onOpenChange,
    tipId,
    onDelete,
    onScrap
}: NailDetailModalProps) {

    const queryClient = useQueryClient()

    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
    const { data: nailDetail } = useQuery({
        queryKey: ['nailDetail', tipId],
        queryFn: () => finalApi.getFinalById(tipId),
        enabled: !!tipId && tipId > 0,
    })

    const recoverMutation = useMutation({
        mutationFn: (id: number) => finalApi.recoverFinal(id),
        onSuccess: () => {
            toast.success('네일이 성공적으로 복구되었습니다.')
            queryClient.invalidateQueries({ queryKey: ['nailDetail', tipId] })
            queryClient.invalidateQueries({ queryKey: ['finals'] })
        },
        onError: (error) => {
            toast.error(error.message || '복구 중 오류가 발생했습니다.')
        }
    })

    const handleRecover = () => {
        recoverMutation.mutate(tipId)
    }

    return (
        <>
            <Dialog open={isOpen} onOpenChange={onOpenChange}>
                <DialogContent className="max-w-md w-full">
                    <DialogTitle className="text-xl font-bold">
                        네일 상세 정보
                    </DialogTitle>

                    <div className="w-full flex justify-end">
                        {nailDetail?.isDeleted ? (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={handleRecover}
                                className="flex items-center gap-1"
                            >
                                <RefreshCcw className="h-4 w-4" />
                                <span>복구</span>
                            </Button>
                        ) : (
                            <DeleteButton onClick={() => setIsDeleteDialogOpen(true)} />
                        )}
                    </div>

                    <div className="flex flex-col gap-6">
                        {/* 이미지 영역 */}
                        <div className="relative aspect-square rounded-lg overflow-hidden border-2 border-[#CD19FF]">
                            {nailDetail?.isDeleted ? null : <Button
                                variant="ghost"
                                size="icon"
                                className="absolute top-1 right-1 z-10 shadow-sm text-[#CD19FF]"
                                onClick={() => onScrap(tipId)}
                            >
                                {nailDetail?.isScraped ? (
                                    <ScrapFilledIcon className="w-[24px] h-[24px]" />
                                ) : (
                                    <ScrapIcon className="w-[24px] h-[24px]" />
                                )}
                            </Button>}
                            {nailDetail?.src ? (
                                <Image
                                    src={nailDetail.src}
                                    alt={`${nailDetail?.shape} ${nailDetail?.color}`}
                                    fill
                                    className="object-cover"
                                />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center bg-gray-100">
                                    <p className="text-gray-500">이미지를 찾을 수 없습니다</p>
                                </div>
                            )}
                        </div>

                        {/* 정보 영역 */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-x-8">
                                {/* 왼쪽 컬럼: 쉐입, 컬러, 패턴 */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">쉐입</h3>
                                        <p className="text-base font-medium">{nailDetail?.shape ? SHAPE_LABELS[nailDetail?.shape] : '-'}</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">컬러</h3>
                                        <p className="text-base font-medium">{nailDetail?.color ? COLOR_LABELS[nailDetail?.color] : '-'}</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">카테고리</h3>
                                        <p className="text-base font-medium">{nailDetail?.category ? CATEGORY_LABELS[nailDetail?.category] : '-'}</p>
                                    </div>
                                </div>

                                {/* 오른쪽 컬럼: 검토자, 날짜 */}
                                <div className="space-y-4">
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">검토자</h3>
                                        <p className="text-base font-medium">{nailDetail?.checkedBy || '-'}</p>
                                    </div>
                                    <div className="border-b border-gray-100 pb-2">
                                        <h3 className="text-xs font-medium text-gray-500 mb-1">날짜</h3>
                                        <p className="text-base font-medium">{nailDetail?.createdAt ? formatToKST(nailDetail?.createdAt, 'datetime') : '-'}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* 삭제 확인 모달 */}
            {nailDetail?.isDeleted ? null : <DeleteDialog
                isOpen={isDeleteDialogOpen}
                onOpenChange={setIsDeleteDialogOpen}
                selectedCount={1}
                onDelete={() => onDelete(tipId)}
            />}
        </>
    )
} 