import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'

const COLUMN_LABELS = ['Empresa', 'Cargo', 'Período', 'Status']

const ProfileEmploymentHistoryCard = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'>
      <h2 className='text-lg font-semibold text-[#121d22]'>
        Histórico Profissional
      </h2>

      <Table>
        <TableHeader>
          <TableRow className='border-[#dfe1e6] bg-[#f8f9fa] hover:bg-[#f8f9fa]'>
            {COLUMN_LABELS.map((label) => (
              <TableHead
                key={label}
                className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654]'
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          <TableRow className='border-[#dfe1e6] hover:bg-transparent'>
            <TableCell
              colSpan={COLUMN_LABELS.length}
              className='p-8 text-center text-sm text-[#434654]'
            >
              Nenhum vínculo empregatício registrado ainda.
            </TableCell>
          </TableRow>
        </TableBody>
      </Table>
    </div>
  )
}

export default ProfileEmploymentHistoryCard
