import { Activity } from 'lucide-react'

const ProfileActivityCard = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)]'>
      <h2 className='text-lg font-semibold text-[#121d22]'>
        Atividade Recente
      </h2>

      <div className='flex flex-col items-center gap-2 py-8 text-center text-sm text-[#434654]'>
        <Activity className='size-6 text-[#dfe1e6]' />
        Nenhuma atividade registrada ainda.
      </div>
    </div>
  )
}

export default ProfileActivityCard
