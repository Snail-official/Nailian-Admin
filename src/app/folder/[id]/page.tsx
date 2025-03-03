"use client"

import { useParams, useRouter, useSearchParams } from "next/navigation"
import Image from "next/image"
import EllipseIcon from "@/assets/icons/EllipseIcon.svg"
import CirclePlusIcon from "@/assets/icons/CirclePlusIcon.svg"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NailSetDetailModal } from "@/components/nailset/NailSetDetailModal"
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { nailSetApi } from "@/lib/api/nail-set"
import { NailSet } from "@/types/api/nail-set"
import { FINGER_POSITIONS } from "@/types/nail"

export default function FolderDetailPage() {
  const { id } = useParams() as { id: string }
  const name = useSearchParams().get('name') || ""
  const router = useRouter()
  const queryClient = useQueryClient()
  const [selectedNailSet, setSelectedNailSet] = useState<number | null>(null)

  const { data: nailSetsData = [], isLoading } = useQuery({
    queryKey: ['nailsets', id],
    queryFn: () => nailSetApi.getNailSets(id)
  })

  const deleteMutation = useMutation({
    mutationFn: nailSetApi.deleteNailSet,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['nailsets', id] })
      setSelectedNailSet(null)
    }
  })

  const handleNailSetClick = (nailSetId: number) => {
    setSelectedNailSet(nailSetId)
  }

  const handleDelete = (nailSetId: number) => {
    deleteMutation.mutate(nailSetId)
  }

  const handleCreate = () => {
    router.push(`/combination?folderId=${id}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-16 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium">{name}</span>
            <EllipseIcon className="w-1 h-1" />
            <span className="text-lg text-gray-600">
              총 <span className="text-[#CD19FF]">{nailSetsData.length}</span>개
            </span>
          </div>
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100"
            onClick={handleCreate}
          >
            <CirclePlusIcon className="w-5 h-5 mr-2" />
            생성하기
          </Button>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <p>로딩 중...</p>
          </div>
        ) : nailSetsData.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {nailSetsData.map((nailSet: NailSet) => (
              <div
                key={nailSet.id}
                className="relative h-32 w-full bg-[#FBEBD8] rounded-lg shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleNailSetClick(nailSet.id)}
              >
                {FINGER_POSITIONS.map((finger, index) => (
                  <div 
                    key={finger}
                    className="absolute w-20 aspect-square transform -translate-x-1/2"
                    style={{
                      left: `calc(50% + ${(index - 2) * 25}px)`,
                    }}
                  >
                    <Image
                      src={nailSet[finger].image}
                      alt={`${finger} nail`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            ))}
          </div>
        ) : (
          <div className="col-span-full text-center py-8">
            <p className="text-gray-500">아직 네일 세트가 없습니다.</p>
            <Button 
              variant="outline" 
              className="mt-4"
              onClick={handleCreate}
            >
              <CirclePlusIcon className="w-5 h-5 mr-2" />
              첫 네일 세트 생성하기
            </Button>
          </div>
        )}

        {/* 모달 */}
        {selectedNailSet && (
          <NailSetDetailModal
            isOpen={selectedNailSet !== null}
            onOpenChange={(open) => !open && setSelectedNailSet(null)}
            nailSet={nailSetsData.find((set: NailSet) => set.id === selectedNailSet)!}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
} 