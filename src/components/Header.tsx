"use client"

import Link from "next/link"
import Image from "next/image"
import { SideSheet } from "@/components/navigation/SideSheet"
import { usePathname, useRouter } from "next/navigation"
import { authApi } from "@/lib/api/auth"
import { toast } from "sonner"

interface HeaderProps {
  isAuthenticated: boolean
}

export function Header({ isAuthenticated }: HeaderProps) {
  const pathname = usePathname()
  const router = useRouter()

  // 현재 페이지 확인 함수
  const isActivePath = (path: string) => {
    return pathname === path
  }

  // 로그아웃 처리
  const handleLogout = async () => {
    try {
      await authApi.logout()
      toast.success('로그아웃 성공')
      router.refresh()
    } catch {
      toast.error('로그아웃 중 오류')
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-[#191919] backdrop-blur">
      <div className="flex w-full h-16 items-center pl-[24px] pr-[72px]">
        <SideSheet />

        {/* 로고 */}
        <Link href="/" className="p-[12px] flex items-center space-x-2">
          <Image
            src="/images/logo_white.png"
            alt="네일리안 로고"
            width={110}
            height={36}
            className="object-contain"
          />
        </Link>

           {/* 네비게이션 */}
           {isAuthenticated && (
          <nav className="hidden md:flex items-center space-x-6 ml-auto">
            <Link
              href="/first-cut"
              className={`text-sm font-medium transition-all ${
                isActivePath('/first-cut') 
                  ? 'text-[#CD19FF] font-bold' 
                  : 'text-white hover:opacity-80 focus:opacity-70'
              }`}
            >
              1차 누끼
            </Link>
            <Link
              href="/ai-result"
              className={`text-sm font-medium transition-all ${
                isActivePath('/ai-result') 
                  ? 'text-[#CD19FF] font-bold' 
                  : 'text-white hover:opacity-80 focus:opacity-70'
              }`}
            >
              AI 생성 결과물
            </Link>
            <Link
              href="/final"
              className={`text-sm font-medium transition-all ${
                isActivePath('/final') 
                  ? 'text-[#CD19FF] font-bold' 
                  : 'text-white hover:opacity-80 focus:opacity-70'
              }`}
            >
              최종
            </Link>
            
            {/* 로그아웃 버튼 */}
            <button
              onClick={handleLogout}
              className="ml-6 px-4 py-2 rounded-md bg-[#CD19FF] text-white text-sm font-medium hover:bg-opacity-90 transition-all"
            >
              로그아웃
            </button>
          </nav>
        )}
      </div>
    </header>
  )
} 