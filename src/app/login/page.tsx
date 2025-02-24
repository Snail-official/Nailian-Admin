"use client"

import Image from "next/image"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"

export default function LoginPage() {
    const router = useRouter()
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsLoading(true)

        try {
            const response = await fetch("/api/auth/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email, password }),
            })

            const data = await response.json()

            if (data.success) {
                toast.success("로그인 성공!")
                router.push("/")
            } else {
                toast.error(data.message)
            }
        } catch (error) {
            toast.error("로그인 중 오류가 발생했습니다.")
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <div className="max-w-6xl mx-auto min-h-screen flex flex-col items-center">
            <div className="w-[400px] h-[400px] rounded-xl border bg-white shadow p-6 mt-32">
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
                            id="text"
                            type="text"
                            placeholder="name@example.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            disabled={isLoading}
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
                            disabled={isLoading}
                        />
                    </div>
                    <Button
                        type="submit"
                        className="w-full bg-[#CD19FF] hover:bg-[#CD19FF]/90"
                        disabled={isLoading}
                    >
                        {isLoading ? "로그인 중..." : "로그인"}
                    </Button>
                </form>
            </div>
        </div>
    )
} 