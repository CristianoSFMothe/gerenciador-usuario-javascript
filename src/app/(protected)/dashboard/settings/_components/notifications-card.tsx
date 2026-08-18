import { Checkbox } from '@/app/_components/ui/checkbox'

const NOTIFICATIONS = [
  {
    id: 'new-users',
    label: 'Novos Usuários',
    description:
      'Receber e-mail quando um novo usuário for cadastrado no sistema.',
    checked: true,
  },
  {
    id: 'system-alerts',
    label: 'Alertas de Sistema',
    description: 'Notificações críticas sobre instabilidades ou manutenção.',
    checked: true,
  },
  {
    id: 'weekly-reports',
    label: 'Relatórios Semanais',
    description:
      'Resumo consolidado das atividades da empresa toda segunda-feira.',
    checked: false,
  },
] as const

const NotificationsCard = () => {
  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
        Notificações
      </h2>

      <div className='flex flex-col gap-4'>
        {NOTIFICATIONS.map((item) => (
          <div key={item.id} className='flex items-start gap-3'>
            <Checkbox checked={item.checked} disabled className='mt-0.5' />
            <div className='flex flex-col gap-0.5'>
              <span className='text-sm font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
                {item.label}
              </span>
              <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                {item.description}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default NotificationsCard
