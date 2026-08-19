import { FileText, Plus } from 'lucide-react'

const ProfileDocumentsCard = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
          Documentos
        </h2>
        <button
          type='button'
          disabled
          title='Enviar documento (em breve)'
          aria-label='Enviar documento'
          className='cursor-not-allowed rounded-md p-1 text-[#434654] opacity-50 dark:text-[#94a3b8]'
        >
          <Plus className='size-4' />
        </button>
      </div>

      <div className='flex flex-col items-center gap-2 py-8 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
        <FileText className='size-6 text-[#dfe1e6] dark:text-[#1e293b]' />
        Nenhum documento enviado ainda.
      </div>
    </div>
  )
}

export default ProfileDocumentsCard
