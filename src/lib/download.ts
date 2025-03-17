import JSZip from 'jszip';

export async function downloadImages(urls: string[], folderName?: string, fileNamePrefix?: string) {
    if (!urls || urls.length === 0) {
        console.error('No URLs provided for download')
        throw new Error('다운로드할 이미지가 없습니다.')
    }
    
    const failedUrls: string[] = []
    
    // 여러 파일을 다운로드할 때 사용할 ZIP 파일 생성 준비
    let zipFile: JSZip | null = null;
    let shouldUseZip = urls.length > 1 && folderName && typeof window !== 'undefined';
    
    // JSZip 라이브러리 동적 로드
    if (shouldUseZip) {
        try {
            const JSZip = (await import('jszip')).default;
            zipFile = new JSZip();
            
            // 폴더 생성
            if (folderName) {
                zipFile = zipFile.folder(folderName);
            }
        } catch (error) {
            console.error('Failed to load JSZip:', error);
            shouldUseZip = false;
        }
    }
    
    for (let i = 0; i < urls.length; i++) {
        const url = urls[i];
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
            
            // 파일 이름 추출 및 생성
            let fileName = url.split('/').pop() || 'image.png'
            // URL 파라미터 제거
            fileName = fileName.split('?')[0]
            
            // 파일명 접두사 추가
            if (fileNamePrefix) {
                // 파일 확장자 유지
                const extension = fileName.split('.').pop() || 'png';
                fileName = `${fileNamePrefix}_${i + 1}.${extension}`;
            }
            
            if (shouldUseZip && zipFile) {
                // ZIP 파일에 이미지 추가
                zipFile.file(fileName, blob);
                
                // 마지막 이미지인 경우 ZIP 파일 다운로드
                if (i === urls.length - 1) {
                    const zipBlob = await zipFile.generateAsync({ type: 'blob' });
                    const zipLink = document.createElement('a');
                    zipLink.href = URL.createObjectURL(zipBlob);
                    zipLink.download = `${folderName || 'images'}.zip`;
                    zipLink.style.display = 'none';
                    
                    document.body.appendChild(zipLink);
                    zipLink.click();
                    
                    setTimeout(() => {
                        URL.revokeObjectURL(zipLink.href);
                        document.body.removeChild(zipLink);
                    }, 100);
                }
            } else {
                // 개별 파일 다운로드 (ZIP을 사용하지 않는 경우)
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
            }
            
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