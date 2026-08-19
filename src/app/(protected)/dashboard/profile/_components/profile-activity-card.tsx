import { Activity } from 'lucide-react'

const ProfileActivityCard = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        Atividade Recente
      </h2>

      <div className='flex flex-col items-center gap-2 py-8 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
        <Activity className='size-6 text-[#dfe1e6] dark:text-[#1e293b]' />
        Nenhuma atividade registrada ainda.
      </div>
    </div>
  )
}

export default ProfileActivityCard
