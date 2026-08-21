'use client'

import { Download } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'

const DashboardExportButton = () => (
  <Button
    variant='outline'
    onClick={() => window.print()}
    className='border-[#dfe1e6] bg-[#e4f0f6] text-xs font-semibold text-[#121d22] hover:bg-[#e4f0f6] dark:border-[#1e293b] dark:bg-[#1e293b] dark:text-[#94a3b8] dark:hover:bg-[#1e293b]'
  >
    <Download className='size-3.5' />
    Exportar Relatório
  </Button>
)

export default DashboardExportButton
