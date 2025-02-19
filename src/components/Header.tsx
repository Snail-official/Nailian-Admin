"use client"

import { Button } from "@/components/ui/button"
import { Sheet, SheetTrigger } from "@/components/ui/sheet"
import Link from "next/link"
import Image from "next/image"
import IconHamburger from "@/assets/icons/icon_hamburger.svg"

export function Header() {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#191919] backdrop-blur supports-[backdrop-filter]:bg-[#191919]/60">
      <div className="flex w-full h-16 items-center pl-[24px] pr-[72px] ">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="mr-4 text-white w-[28px] h-[28px] cursor-pointer">
              <IconHamburger className='w-[28px] h-[28px]' />
              <span className="sr-only">Toggle navigation menu</span>
            </Button>
          </SheetTrigger>
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