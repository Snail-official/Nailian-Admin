import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
    const url = req.nextUrl.searchParams.get('url')
    
    if (!url) {
        return new NextResponse('URL parameter is required', { status: 400 })
    }
    
    try {
        // 커스텀 헤더 추가
        const response = await fetch(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
                'Accept': 'image/webp,image/apng,image/*,*/*;q=0.8',
                'Accept-Language': 'en-US,en;q=0.9',
            },
            cache: 'no-store'
        })
        
        if (!response.ok) {
            console.error(`Failed to fetch image with status: ${response.status}`)
            return new NextResponse(`Failed to fetch image: ${response.status}`, { status: response.status })
        }
        
        const arrayBuffer = await response.arrayBuffer()
        const contentType = response.headers.get('Content-Type') || 'application/octet-stream'
        
        // 파일명 추출
        const urlParts = url.split('/')
        const fileName = urlParts[urlParts.length - 1].split('?')[0]
        
        const headers = new Headers()
        headers.set('Content-Type', contentType)
        headers.set('Content-Disposition', `attachment; filename="${fileName}"`)
        headers.set('Access-Control-Allow-Origin', '*')
        headers.set('Cache-Control', 'no-cache, no-store, must-revalidate')
        
        return new NextResponse(arrayBuffer, {
            status: 200,
            headers
        })
    } catch (error) {
        console.error('Proxy download error:', error)
        return new NextResponse(`Failed to proxy download: ${error instanceof Error ? error.message : 'Unknown error'}`, { status: 500 })
    }
} 