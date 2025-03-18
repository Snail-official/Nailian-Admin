import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl
    const isAuthenticated = request.cookies.has('accessToken') || request.cookies.has('refreshToken')

    // 공개 경로 목록 (로그인하지 않아도 접근 가능한 경로)
    const publicPaths = ['/login', '/api/auth/login', '/api/auth/signup', '/images']
    const isPublicPath = publicPaths.some(path => pathname.startsWith(path))

    // 로그인하지 않은 경우
    if (!isAuthenticated) {
        // 이미 로그인 페이지에 있거나 공개 경로인 경우 그대로 진행
        if (isPublicPath) {
            return NextResponse.next()
        }
        
        // 그 외의 경우 로그인 페이지로 리다이렉트
        return NextResponse.redirect(new URL('/login', request.url))
    }

    // 로그인한 상태에서 로그인 페이지 접근 시도하면 메인으로 리다이렉트
    if (isAuthenticated && pathname === '/login') {
        return NextResponse.redirect(new URL('/', request.url))
    }

    return NextResponse.next()
}

// 미들웨어를 적용할 경로 설정
export const config = {
    matcher: [
        /*
         * Match all request paths except for the ones starting with:
         * - _next/static (static files)
         * - _next/image (image optimization files)
         * - favicon.ico (favicon file)
         */
        '/((?!_next/static|_next/image|favicon.ico|public).*)',
    ],
} 