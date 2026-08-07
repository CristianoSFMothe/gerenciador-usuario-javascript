import { Pencil, Trash2 } from 'lucide-react'

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { maskCEP, maskCNPJ, maskPhone } from '@/app/_utils/masks'
import type { CompanyListItem } from '@/app/(protected)/_actions/companies/get-companies'

type CompaniesTableProps = {
  companies: CompanyListItem[]
}

const CompaniesTable = ({ companies }: CompaniesTableProps) => {
  if (companies.length === 0) {
    return (
      <div className='flex w-full items-center justify-center px-4 py-16 text-sm text-[#434654]'>
        Nenhuma empresa encontrada.
      </div>
    )
  }

  return (
    <Table>
      <TableHeader>
        <TableRow className='border-[#dfe1e6] bg-[#f8f9fa] hover:bg-[#f8f9fa]'>
          <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Nome - Razão Social
          </TableHead>
          <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            CNPJ
          </TableHead>
          <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Email
          </TableHead>
          <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Site
          </TableHead>
          <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Telefone Fixo
          </TableHead>
          <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Telefone Celular
          </TableHead>
          <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            CEP
          </TableHead>
          <TableHead className='h-auto p-4 text-right text-xs font-semibold tracking-[0.6px] text-[#434654]'>
            Ações
          </TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {companies.map((company) => (
          <TableRow key={company.id} className='border-[#dfe1e6]'>
            <TableCell className='p-4 text-sm font-semibold text-[#121d22]'>
              {company.tradeName}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {maskCNPJ(company.cnpj)}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#121d22]'>
              {company.email}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#003d9b]'>
              {company.website ?? '-'}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {maskPhone(company.landlinePhone)}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {company.mobilePhone ? maskPhone(company.mobilePhone) : '-'}
            </TableCell>
            <TableCell className='p-4 text-sm text-[#434654]'>
              {company.postalCode ? maskCEP(company.postalCode) : '-'}
            </TableCell>
            <TableCell className='p-4 text-right'>
              <div className='flex items-center justify-end gap-2'>
                <button
                  type='button'
                  disabled
                  title='Editar empresa (em breve)'
                  aria-label='Editar empresa'
                  className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                >
                  <Pencil className='size-3.5' />
                </button>
                <button
                  type='button'
                  disabled
                  title='Excluir empresa (em breve)'
                  aria-label='Excluir empresa'
                  className='cursor-not-allowed p-1 text-[#434654] opacity-50'
                >
                  <Trash2 className='size-3.5' />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

export default CompaniesTable
