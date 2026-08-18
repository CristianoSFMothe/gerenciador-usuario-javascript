import ThemeToggle from '@/app/_components/theme-toggle'
import { Input } from '@/app/_components/ui/input'

const SystemPreferencesCard = () => {
  return (
    <div className='flex flex-col gap-6 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        Preferências do Sistema
      </h2>

      <div className='grid grid-cols-1 gap-4 sm:grid-cols-2'>
        <div className='flex flex-col gap-1'>
          <span className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
            Idioma da Interface
          </span>
          <Input disabled value='Português (Brasil)' />
        </div>

        <div className='flex flex-col gap-1'>
          <span className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
            Formato de Data
          </span>
          <Input disabled value='DD/MM/AAAA (Brasileiro)' />
        </div>
      </div>

      <div className='flex flex-col gap-2'>
        <span className='text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
          Modo de Exibição
        </span>
        <ThemeToggle />
      </div>
    </div>
  )
}

export default SystemPreferencesCard
