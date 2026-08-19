'use client'

import { Download, Loader2 } from 'lucide-react'
import { useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/app/_components/ui/dropdown-menu'
import type { ExportPdfResult } from '@/app/(protected)/_actions/export-pdf-action'

type ExportMenuProps = {
  selectedCount: number
  onExport: (mode: 'selected' | 'all') => Promise<ExportPdfResult>
}

const downloadBase64Pdf = (base64: string, filename: string) => {
  const byteChars = atob(base64)
  const byteNumbers = new Array(byteChars.length)

  for (let i = 0; i < byteChars.length; i++) {
    byteNumbers[i] = byteChars.charCodeAt(i)
  }

  const blob = new Blob([new Uint8Array(byteNumbers)], {
    type: 'application/pdf',
  })
  const url = URL.createObjectURL(blob)

  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

const ExportMenu = ({ selectedCount, onExport }: ExportMenuProps) => {
  const [isExporting, setIsExporting] = useState(false)

  const handleExport = async (mode: 'selected' | 'all') => {
    setIsExporting(true)
    const result = await onExport(mode)
    setIsExporting(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    downloadBase64Pdf(result.base64, result.filename)
    toast.success('Exportação concluída.')
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant='outline'
          disabled={isExporting}
          className='rounded-none border-[#dfe1e6] text-xs text-[#434654] dark:border-[#1e293b] dark:text-[#94a3b8]'
        >
          {isExporting ? (
            <Loader2 className='size-3.5 animate-spin' />
          ) : (
            <Download className='size-3.5' />
          )}
          Exportar
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {selectedCount > 0 && (
          <DropdownMenuItem onSelect={() => handleExport('selected')}>
            Selecionado ({selectedCount})
          </DropdownMenuItem>
        )}
        <DropdownMenuItem onSelect={() => handleExport('all')}>
          Todos
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem>Cancelar</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

export default ExportMenu
