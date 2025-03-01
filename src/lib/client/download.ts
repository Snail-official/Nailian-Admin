export async function downloadImages(urls: string[]) {
    if (!urls || urls.length === 0) {
        console.error('No URLs provided for download')
        throw new Error('다운로드할 이미지가 없습니다.')
    }
    
    const failedUrls: string[] = []
    
    for (const url of urls) {
        try {
            // URL이 유효한지 확인
            if (!url || typeof url !== 'string') {
                console.error('Invalid URL:', url)
                failedUrls.push(`Invalid URL: ${url}`)
                continue
            }
            
            // 이미지 직접 가져오기 (타임아웃 추가)
            const controller = new AbortController()
            const timeoutId = setTimeout(() => controller.abort(), 30000) 
            
            const response = await fetch(`/api/proxy-download?url=${encodeURIComponent(url)}`, {
                signal: controller.signal
            })
            
            clearTimeout(timeoutId)
            
            if (!response.ok) {
                const errorText = await response.text()
                console.error(`Download failed with status: ${response.status}, message: ${errorText}`)
                failedUrls.push(url)
                continue
            }
            
            const blob = await response.blob()
            
            // 파일 이름 추출 (URL의 마지막 부분 사용)
            let fileName = url.split('/').pop() || 'image.png'
            // URL 파라미터 제거
            fileName = fileName.split('?')[0]
            
            // 다운로드 링크 생성
            const link = document.createElement('a')
            link.href = URL.createObjectURL(blob)
            link.download = fileName
            link.style.display = 'none'
            
            // 링크 클릭하여 다운로드
            document.body.appendChild(link)
            link.click()
            
            // 정리
            setTimeout(() => {
                URL.revokeObjectURL(link.href)
                document.body.removeChild(link)
            }, 100)
            
            // 연속 다운로드 시 브라우저 제한을 방지하기 위한 지연
            await new Promise(resolve => setTimeout(resolve, 500))
        } catch (error) {
            console.error(`Failed to download image: ${url}`, error)
            failedUrls.push(url)
        }
    }
    
    if (failedUrls.length > 0) {
        throw new Error(`일부 이미지 다운로드 실패: ${failedUrls.length}개`)
    }
} 