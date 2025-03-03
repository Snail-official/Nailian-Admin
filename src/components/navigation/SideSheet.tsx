"use client"

import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import HamburgerIcon from "@/assets/icons/HamburgerIcon.svg"
import { FolderSection } from "@/components/folder/FolderSection"
import { useState } from "react"

export function SideSheet() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="mr-4 text-white w-[28px] h-[28px] cursor-pointer">
          <HamburgerIcon className='w-[28px] h-[28px]' />
          <span className="sr-only">Toggle navigation menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[300px]">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <FolderSection onFolderClick={() => setIsOpen(false)} />
      </SheetContent>
    </Sheet>
  )
} 