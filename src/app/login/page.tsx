"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        // TODO: 실제 로그인 로직 구현
        console.log("Login attempt:", { email, password })
        router.push("/")
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen flex justify-center">
            <div className="w-[400px] h-[400px] rounded-xl border bg-white shadow p-6 mt-[120px]">
                <div className="flex flex-col items-center space-y-4 mb-6">
                    <Image
                        src="/images/logo_black.png"
                        alt="네일리안 로고"
                        width={150}
                        height={50}
                        className="object-contain mb-2"
                        priority
                    />
                    <p className="text-sm text-muted-foreground">
                        이메일과 비밀번호를 입력해주세요
                    </p>
                </div>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            type="email"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#CD19FF] hover:bg-[#CD19FF]/90"
                    >
                        로그인
                    </Button>
                </form>
            </div>
        </div>
    )
} 