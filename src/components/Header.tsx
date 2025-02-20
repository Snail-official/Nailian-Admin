"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger, SheetContent, SheetTitle } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import HamburgerIcon from "@/assets/icons/icon_hamburger.svg"
import FolderIcon from "@/assets/icons/icon_folder.svg"
import PlusIcon from "@/assets/icons/icon_plus.svg"
import ChevronRightIcon from "@/assets/icons/icon_chevron_right.svg"
import { Separator } from "@/components/ui/separator"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { useState } from "react"

export function Header() {
  const [folders, setFolders] = useState<string[]>([])
  const [newFolderName, setNewFolderName] = useState("")
  const [open, setOpen] = useState(false)

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      setFolders([...folders, newFolderName.trim()])
      setNewFolderName("")
      setOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#191919] backdrop-blur supports-[backdrop-filter]:bg-[#191919]/60">
      <div className="flex w-full h-16 items-center pl-[24px] pr-[72px] ">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4 text-white w-[28px] h-[28px] cursor-pointer">
              <HamburgerIcon className='w-[28px] h-[28px]' />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[300px]">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            
            {/* 첫 번째 줄: 폴더 */}
            <div className="px-[32px] pr-[36px]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <FolderIcon className="w-5 h-5 flex-shrink-0" />
                  <div className="flex justify-center items-center">
                    <span className="inline-flex items-center">폴더</span>
                  </div>
                </div>
                <Dialog open={open} onOpenChange={setOpen}>
                  <DialogTrigger asChild>
                    <button>
                      <PlusIcon className="w-5 h-5" />
                    </button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>새 폴더 만들기</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                      <Input
                        type="text" 
                        placeholder="폴더 이름" 
                        value={newFolderName}
                        onChange={(e) => setNewFolderName(e.target.value)}
                      />
                      <div className="flex justify-center">
                        <Button onClick={handleCreateFolder}>
                          폴더 생성
                        </Button>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>

            {/* 구분선 */}
            <Separator className="my-4 bg-gray-700" />

            {/* 폴더 목록 */}
            <div className="space-y-4">
              {folders.map((folder, index) => (
                <div key={index} className="px-[32px] pr-[36px]">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center">{folder}</span>
                    <ChevronRightIcon className="w-4 h-4" />
                  </div>
                </div>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        {/* 로고 */}
        <Link href="/" className="p-[12px] flex items-center space-x-2">
          <Image
            src="/images/logo.png"
            alt="네일리안 로고"
            width={110}
            height={36}
            className="object-contain"
          />
        </Link>

        {/* 네비게이션 */}
        <nav className="hidden md:flex items-center space-x-6 ml-auto">
          <Link
            href="/first-cut"
            className="text-sm font-medium text-white hover:opacity-80 focus:opacity-70 transition-all"
          >
            1차 누끼
          </Link>
          <Link
            href="/ai-result"
            className="text-sm font-medium text-white hover:opacity-80 focus:opacity-70 transition-all"
          >
            AI 생성 결과물
          </Link>
          <Link
            href="/final"
            className="text-sm font-medium text-white hover:opacity-80 focus:opacity-70 transition-all"
          >
            최종
          </Link>
        </nav>
      </div>
    </header>
  )
} 