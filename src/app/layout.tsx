import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/Header";
import { Toaster } from 'sonner'
import Providers from './providers'
import { cookies } from 'next/headers'

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "네일리안 어드민",
  description: "네일리안 어드민 대시보드",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  // 서버에서 인증 상태 확인
  const cookieStore = await cookies()
  const isAuthenticated = !!cookieStore.get('accessToken') || !!cookieStore.get('refreshToken')

  return (
    <html lang="ko">
      <body className={inter.className}>
        <Providers>
          <Header isAuthenticated={isAuthenticated} />
          <main>
            {children}
          </main>
          <Toaster position="top-center" duration={1500} />
        </Providers>
      </body>
    </html>
  );
}
