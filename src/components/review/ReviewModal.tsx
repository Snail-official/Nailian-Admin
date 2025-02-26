"use client"

import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import { ChevronLeft, ChevronRight, X } from "lucide-react"
import { useState } from "react"
import { DialogTitle } from "@radix-ui/react-dialog"
import { NailColorChips } from "@/components/filters/NailColorChips"

import { TrashIcon } from "lucide-react"
import { Category, Color } from "@/types/nail"
import { NailCategoryChips } from "../filters/NailCategoryChips"

interface ReviewModalProps {
    isOpen: boolean
    onOpenChange: (open: boolean) => void
    images: { id: number; src: string }[]
    onComplete?: (reviewedData: { id: number; color: Color | null; category: Category | null; isDeleted: boolean }[]) => void
}

interface ReviewData {
    color: Color | null
    category: Category | null
    isDeleted: boolean
}

export function ReviewModal({ isOpen, onOpenChange, images, onComplete }: ReviewModalProps) {
    const [currentIndex, setCurrentIndex] = useState(0)
    const [reviewData, setReviewData] = useState<Record<number, ReviewData>>({})

    const handlePrevious = () => {
        if (currentIndex > 0) {
            setCurrentIndex(currentIndex - 1)
        }
    }

    const handleNext = () => {
        if (currentIndex < images.length - 1) {
            setCurrentIndex(currentIndex + 1)
        }
    }

    const handleDelete = () => {
        const currentImage = images[currentIndex]
        setReviewData(prev => ({
            ...prev,
            [currentImage.id]: {
                color: null,
                category: null,
                isDeleted: !prev[currentImage.id]?.isDeleted
            }
        }))
    }

    const isCurrentImageReviewed = (imageId: number) => {
        const data = reviewData[imageId]
        return data?.isDeleted || (data?.color && data?.category)
    }

    const isAllReviewed = images.length > 0 && images.every(img => isCurrentImageReviewed(img.id))

    const handleColorSelect = (color: Color | null) => {
        const currentImage = images[currentIndex]
        setReviewData(prev => ({
            ...prev,
            [currentImage.id]: {
                ...prev[currentImage.id],
                color
            }
        }))
    }

    const handleCategorySelect = (category: Category | null) => {
        const currentImage = images[currentIndex]
        setReviewData(prev => ({
            ...prev,
            [currentImage.id]: {
                ...prev[currentImage.id],
                category
            }
        }))
    }

    const currentImageData = images[currentIndex] ? reviewData[images[currentIndex].id] : null

    const handleComplete = () => {
        const reviewedData = images.map(img => ({
            id: img.id,
            color: reviewData[img.id]?.color ?? null,
            category: reviewData[img.id]?.category ?? null,
            isDeleted: reviewData[img.id]?.isDeleted ?? false
        }))
        onComplete?.(reviewedData)
        onOpenChange(false)
    }

    return (
        <Dialog open={isOpen} onOpenChange={onOpenChange}>
            <DialogContent className="max-w-3xl">
                <DialogHeader className="mb-4">
                    <DialogTitle className="text-lg font-semibold">검토 하기</DialogTitle>
                </DialogHeader>
                <div className="flex flex-col items-center gap-6 py-8">
                    <div className="relative w-[400px] h-[400px] rounded-lg border border-gray-200 overflow-hidden">
                        {images.length > 0 && (
                            <>
                                <div className="relative w-full h-full">
                                    <Image
                                        src={images[currentIndex].src}
                                        alt={`Review image ${currentIndex + 1}`}
                                        fill
                                        className="object-cover"
                                    />
                                    {currentImageData?.isDeleted && (
                                        <div className="absolute inset-0 bg-gray-500 bg-opacity-50 transition-opacity z-[1]" />
                                    )}
                                </div>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleDelete}
                                    className="absolute top-3 right-3 bg-white hover:bg-gray-100 z-[2]"
                                >
                                    <TrashIcon className={`w-5 h-5 ${
                                        currentImageData?.isDeleted ? 'text-gray-900' : 'text-gray-500'
                                    }`} />
                                </Button>
                            </>
                        )}
                    </div>
                    <div className="flex flex-col items-center gap-4 w-full">
                        <div className="flex flex-col gap-4 w-full px-8">
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium min-w-[48px]">색상</span>
                                <div className={currentImageData?.isDeleted ? 'opacity-50 pointer-events-none' : ''}>
                                    <NailColorChips
                                        selectedColor={currentImageData?.color ?? null}
                                        onColorSelect={handleColorSelect}
                                    />
                                </div>
                            </div>
                            <div className="flex items-center gap-4">
                                <span className="text-sm font-medium min-w-[48px]">패턴</span>
                                <div className={currentImageData?.isDeleted ? 'opacity-50 pointer-events-none' : ''}>
                                    <NailCategoryChips
                                        selectedCategory={currentImageData?.category ?? null}
                                        onCategorySelect={handleCategorySelect}
                                    />
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <div className="flex items-center gap-4">
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handlePrevious}
                                    className="rounded-full"
                                    disabled={currentIndex === 0}
                                >
                                    <ChevronLeft className="h-4 w-4" />
                                </Button>
                                <span className="text-sm">
                                    {currentIndex + 1} / {images.length}
                                </span>
                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={handleNext}
                                    className="rounded-full"
                                    disabled={currentIndex === images.length - 1}
                                >
                                    <ChevronRight className="h-4 w-4" />
                                </Button>
                            </div>
                            <Button
                                className="w-[200px]"
                                disabled={!isAllReviewed}
                                onClick={handleComplete}
                            >
                                검토 완료
                            </Button>
                        </div>
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
} 