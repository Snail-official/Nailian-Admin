import React, { useState, useRef } from 'react'
import { Button } from "@/components/ui/button"
import { TipShapeChips } from "./TipShapeChips"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog" 

interface UploadModalProps {
  isOpen: boolean
  onOpenChange: (open: boolean) => void
  onUploadComplete: (files: File[], shape: string | null) => void
}

export function UploadModal({ isOpen, onOpenChange, onUploadComplete }: UploadModalProps) {
  const [selectedShape, setSelectedShape] = useState<string | null>(null)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      setUploadedFiles(prev => [...prev, ...fileArray])
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const files = e.dataTransfer.files
    if (files && files.length > 0) {
      const fileArray = Array.from(files)
      setUploadedFiles(prev => [...prev, ...fileArray])
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
  }

  const handleUploadComplete = () => {
    onUploadComplete(uploadedFiles, selectedShape)
    onOpenChange(false)
    setUploadedFiles([])
    setSelectedShape(null)
  }

  return (
    <Dialog 
      open={isOpen} 
      onOpenChange={(open) => {
        onOpenChange(open)
        if (!open) {
          setSelectedShape(null)
          setUploadedFiles([])
        }
      }}
    >
      <DialogContent className="max-w-lg w-full p-6">
        <DialogHeader>
          <DialogTitle>이미지 업로드</DialogTitle>
        </DialogHeader>

        {/* 팁 모양 선택 칩 */}
        <TipShapeChips
          selectedShape={selectedShape}
          onShapeSelect={setSelectedShape}
        />

        <div className="space-y-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            style={{
              border: '2px dashed #E5E7EB',
              borderRadius: '0.5rem',
              padding: '2rem',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '1rem'
            }}
          >
            <p className="text-gray-500 mb-2">
              이미지를 드래그하여 업로드하거나
            </p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileUpload}
              className="hidden"
              accept="image/*"
              multiple
            />
            <Button 
              variant="outline" 
              className="mx-auto"
              onClick={() => fileInputRef.current?.click()}
            >
              파일 선택하기
            </Button>
            <p className="text-xs text-gray-500 mt-2">
              여러 파일을 한 번에 선택할 수 있습니다
            </p>
          </div>

          {uploadedFiles.length > 0 && (
            <div style={{
              border: '1px solid #E5E7EB',
              borderRadius: '0.5rem',
              padding: '1rem',
              marginTop: '0.5rem',
              marginBottom: '0.5rem'
            }}>
              <p style={{ 
                fontWeight: '500',
                marginBottom: '0.5rem'
              }}>
                선택된 파일 ({uploadedFiles.length})
              </p>
              <div style={{
                maxHeight: '8rem',
                overflowY: 'auto',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.25rem'
              }}>
                {uploadedFiles.map((file, index) => (
                  <p 
                    key={index} 
                    style={{
                      fontSize: '0.875rem',
                      color: '#4B5563'
                    }}
                  >
                    {file.name}
                  </p>
                ))}
              </div>
            </div>
          )}

          <Button 
            className="w-full bg-[#CD19FF] hover:bg-[#CD19FF]/90 text-white"
            onClick={handleUploadComplete}
            disabled={uploadedFiles.length === 0}
          >
            {uploadedFiles.length}개 파일 업로드
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
} 