import { Download, Plus } from 'lucide-react'

import { Button } from '@/app/_components/ui/button'
import { getRoles } from '@/app/(protected)/_actions/roles/get-roles'

import AccessMatrix from './_components/access-matrix'
import RoleCard from './_components/role-card'
import RoleFormDialog from './_components/role-form-dialog'

const RolesPage = async () => {
  const { roles, permissions, rolePermissions } = await getRoles()

  return (
    <div className='flex flex-col gap-8 p-4 sm:p-8'>
      <div className='flex flex-col justify-between gap-4 sm:flex-row sm:items-start'>
        <div className='flex flex-col gap-2'>
          <h1 className='text-2xl leading-9 font-semibold tracking-[-0.28px] text-[#121d22] sm:text-[28px] dark:text-[#f1f5f9]'>
            Papéis e Permissões
          </h1>
          <p className='max-w-2xl text-sm text-[#434654] dark:text-[#94a3b8]'>
            Gerencie níveis de acesso, definições de papéis e permissões
            granulares em toda a plataforma.
          </p>
        </div>

        <div className='flex shrink-0 gap-3'>
          <Button
            type='button'
            variant='outline'
            disabled
            title='Em breve'
            className='border-[#dfe1e6] text-[#434654] dark:border-[#1e293b] dark:text-[#94a3b8]'
          >
            <Download className='size-3.5' />
            Exportar Matriz
          </Button>

          <RoleFormDialog
            trigger={
              <Button
                type='button'
                className='bg-[#003d9b] text-white hover:bg-[#003d9b]/90'
              >
                <Plus className='size-3.5' />
                Nova Função
              </Button>
            }
          />
        </div>
      </div>

      <div className='flex flex-col gap-4 sm:flex-row'>
        {roles.map((role) => (
          <RoleCard key={role.id} role={role} />
        ))}
      </div>

      <AccessMatrix
        roles={roles}
        permissions={permissions}
        rolePermissions={rolePermissions}
      />
    </div>
  )
}

export default RolesPage
