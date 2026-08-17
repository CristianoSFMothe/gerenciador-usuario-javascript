import { FileText, Plus } from 'lucide-react'

const ProfileDocumentsCard = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'>
      <div className='flex items-center justify-between'>
        <h2 className='text-lg font-semibold text-[#121d22]'>Documentos</h2>
        <button
          type='button'
          disabled
          title='Enviar documento (em breve)'
          aria-label='Enviar documento'
          className='cursor-not-allowed rounded-md p-1 text-[#434654] opacity-50'
        >
          <Plus className='size-4' />
        </button>
      </div>

      <div className='flex flex-col items-center gap-2 py-8 text-center text-sm text-[#434654]'>
        <FileText className='size-6 text-[#dfe1e6]' />
        Nenhum documento enviado ainda.
      </div>
    </div>
  )
}

export default ProfileDocumentsCard
