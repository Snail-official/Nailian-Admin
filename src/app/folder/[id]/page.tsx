"use client"

import { useParams, useRouter } from "next/navigation"
import Image from "next/image"
import EllipseIcon from "@/assets/icons/EllipseIcon.svg"
import CirclePlusIcon from "@/assets/icons/CirclePlusIcon.svg"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { NailSetDetailModal } from "@/components/nailset/NailSetDetailModal"

// 목 데이터
const mockNailSets = [
  {
    id: 1,
    uploader: "김네일1",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 2,
    uploader: "김네일2",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 3,
    uploader: "김네일3",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 4,
    uploader: "김네일4",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 5,
    uploader: "김네일5",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 6,
    uploader: "김네일6",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 7,
    uploader: "김네일7",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 8,
    uploader: "김네일8",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  },
  {
    id: 9,
    uploader: "김네일9",
    createdAt: '2024-02-05',
    tips: [
      { id: 1, position: "엄지", image: "/mocks/nail.png" },
      { id: 2, position: "검지", image: "/mocks/nail.png" },
      { id: 3, position: "중지", image: "/mocks/nail.png" },
      { id: 4, position: "약지", image: "/mocks/nail.png" },
      { id: 5, position: "소지", image: "/mocks/nail.png" },
    ]
  }
]

export default function FolderDetailPage() {
  const params = useParams()
  const router = useRouter()
  const folderId = params.id as string
  const [selectedNailSet, setSelectedNailSet] = useState<number | null>(null)
  const [nailSets, setNailSets] = useState(mockNailSets)

  const handleNailSetClick = (nailSetId: number) => {
    setSelectedNailSet(nailSetId)
  }

  const handleDelete = (nailSetId: number) => {
    // 실제로는 여기서 API 호출을 통해 서버에서 삭제
    setNailSets(prev => prev.filter(set => set.id !== nailSetId))
  }

  const handleCreate = () => {
    router.push(`/combination?folderId=${folderId}`)
  }

  return (
    <div className="container mx-auto py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-16 mt-6">
          <div className="flex items-center gap-2">
            <span className="text-xl font-medium">웨딩 네일</span>
            <EllipseIcon className="w-1 h-1" />
            <span className="text-lg text-gray-600">총 <span className="text-[#CD19FF]">{mockNailSets.length}</span>개</span>
          </div>
          <Button
            variant="outline"
            className="bg-white text-black hover:bg-gray-100"
            onClick={handleCreate}
          >
            <CirclePlusIcon className="w-5 h-5" />
            생성하기
          </Button>
        </div>

        {/* 네일 세트 목록 */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
          {nailSets.length > 0 ? (
            nailSets.map((nailSet) => (
              <div
                key={nailSet.id}
                className="relative h-32 w-full bg-[#FBEBD8] rounded-lg shadow flex items-center justify-center cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => handleNailSetClick(nailSet.id)}
              >
                {nailSet.tips.map((tip, index) => (
                  <div 
                    key={tip.id}
                    className="absolute w-20 aspect-square transform -translate-x-1/2"
                    style={{
                      left: `calc(50% + ${(index - 2) * 25}px)`,
                    }}
                  >
                    <Image
                      src={tip.image}
                      alt={`${tip.position} 네일`}
                      fill
                      className="object-contain"
                    />
                  </div>
                ))}
              </div>
            ))
          ) : (
            <div className="bg-white rounded-lg shadow p-4">
              <p className="text-gray-500">아직 네일 세트가 없습니다.</p>
            </div>
          )}
        </div>

        {/* 모달 */}
        {selectedNailSet && (
          <NailSetDetailModal
            isOpen={selectedNailSet !== null}
            onOpenChange={(open) => !open && setSelectedNailSet(null)}
            nailSet={nailSets.find(set => set.id === selectedNailSet)!}
            onDelete={handleDelete}
          />
        )}
      </div>
    </div>
  )
} 