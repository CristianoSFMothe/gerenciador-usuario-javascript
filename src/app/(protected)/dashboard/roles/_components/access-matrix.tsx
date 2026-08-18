'use client'

import { Loader2, Search } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Fragment, useMemo, useState } from 'react'
import { toast } from 'sonner'

import { Button } from '@/app/_components/ui/button'
import { Input } from '@/app/_components/ui/input'
import { Switch } from '@/app/_components/ui/switch'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/app/_components/ui/table'
import { cn } from '@/app/_lib/utils'
import type {
  PermissionItem,
  RoleListItem,
} from '@/app/(protected)/_actions/roles/get-roles'
import { updateRolePermissionsAction } from '@/app/(protected)/_actions/roles/update-role-permissions-action'

type RolePermissionGrant = {
  roleId: string
  permissionId: string
  granted: boolean
}

type AccessMatrixProps = {
  roles: RoleListItem[]
  permissions: PermissionItem[]
  rolePermissions: RolePermissionGrant[]
}

const grantKey = (roleId: string, permissionId: string) =>
  `${roleId}:${permissionId}`

const buildGrantMap = (rolePermissions: RolePermissionGrant[]) => {
  const map = new Map<string, boolean>()

  rolePermissions.forEach((grant) => {
    map.set(grantKey(grant.roleId, grant.permissionId), grant.granted)
  })

  return map
}

const groupByCategory = (permissions: PermissionItem[]) => {
  const groups: { category: string; items: PermissionItem[] }[] = []

  permissions.forEach((permission) => {
    const lastGroup = groups.at(-1)

    if (lastGroup && lastGroup.category === permission.category) {
      lastGroup.items.push(permission)
    } else {
      groups.push({ category: permission.category, items: [permission] })
    }
  })

  return groups
}

const AccessMatrix = ({
  roles,
  permissions,
  rolePermissions,
}: AccessMatrixProps) => {
  const router = useRouter()
  const initialGrants = useMemo(
    () => buildGrantMap(rolePermissions),
    [rolePermissions],
  )
  const [grants, setGrants] = useState(initialGrants)
  const [filterText, setFilterText] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const filteredGroups = useMemo(() => {
    const query = filterText.trim().toLowerCase()

    if (!query) return groupByCategory(permissions)

    const filtered = permissions.filter(
      (permission) =>
        permission.label.toLowerCase().includes(query) ||
        permission.description.toLowerCase().includes(query),
    )

    return groupByCategory(filtered)
  }, [permissions, filterText])

  const toggleGrant = (roleId: string, permissionId: string) => {
    const key = grantKey(roleId, permissionId)

    setGrants((previous) => {
      const next = new Map(previous)
      next.set(key, !(previous.get(key) ?? false))
      return next
    })
  }

  const handleCancel = () => setGrants(initialGrants)

  const handleSave = async () => {
    setIsSaving(true)

    const payload = roles.flatMap((role) =>
      permissions.map((permission) => ({
        roleId: role.id,
        permissionId: permission.id,
        granted: grants.get(grantKey(role.id, permission.id)) ?? false,
      })),
    )

    const result = await updateRolePermissionsAction(payload)

    setIsSaving(false)

    if (!result.success) {
      toast.error(result.message)
      return
    }

    toast.success(result.message)
    router.refresh()
  }

  return (
    <div className='flex flex-col gap-4 rounded-lg border border-[#dfe1e6] bg-white p-6 drop-shadow-[0px_1px_1px_rgba(0,0,0,0.05)] dark:border-[#1e293b] dark:bg-[#0f172a]'>
      <div className='flex flex-wrap items-center justify-between gap-3'>
        <h2 className='text-lg font-semibold text-[#121d22] dark:text-[#f1f5f9]'>
          Matriz de Acesso Detalhada
        </h2>

        <div className='relative w-72'>
          <Search className='absolute top-1/2 left-3 size-3.5 -translate-y-1/2 text-[#6b7280] dark:text-[#94a3b8]' />
          <Input
            value={filterText}
            onChange={(event) => setFilterText(event.target.value)}
            placeholder='Filtrar permissões...'
            className='pl-9 text-sm'
          />
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className='border-[#dfe1e6] bg-[#f8f9fa] hover:bg-[#f8f9fa] dark:border-[#1e293b] dark:bg-[#1e293b] dark:hover:bg-[#1e293b]'>
            <TableHead className='h-auto p-4 text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'>
              Contexto de Permissão
            </TableHead>
            {roles.map((role) => (
              <TableHead
                key={role.id}
                className='h-auto p-4 text-center text-xs font-semibold tracking-[0.6px] text-[#434654] dark:text-[#94a3b8]'
              >
                {role.name}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredGroups.length === 0 ? (
            <TableRow className='border-[#dfe1e6] hover:bg-transparent dark:border-[#1e293b]'>
              <TableCell
                colSpan={roles.length + 1}
                className='p-8 text-center text-sm text-[#434654] dark:text-[#94a3b8]'
              >
                Nenhuma permissão encontrada.
              </TableCell>
            </TableRow>
          ) : (
            filteredGroups.map((group) => (
              <Fragment key={group.category}>
                <TableRow className='border-[#dfe1e6] bg-[#f8f9fa]/60 hover:bg-[#f8f9fa]/60 dark:border-[#1e293b] dark:bg-[#1e293b]/60 dark:hover:bg-[#1e293b]/60'>
                  <TableCell
                    colSpan={roles.length + 1}
                    className='p-3 text-xs font-semibold text-[#434654] dark:text-[#94a3b8]'
                  >
                    {group.category}
                  </TableCell>
                </TableRow>

                {group.items.map((permission) => (
                  <TableRow
                    key={permission.id}
                    className='border-[#dfe1e6] dark:border-[#1e293b]'
                  >
                    <TableCell className='p-4'>
                      <span
                        className={cn(
                          'block text-sm font-semibold',
                          permission.key === 'delete_company'
                            ? 'text-red-600 dark:text-red-400'
                            : 'text-[#121d22] dark:text-[#f1f5f9]',
                        )}
                      >
                        {permission.label}
                      </span>
                      <span className='text-xs text-[#434654] dark:text-[#94a3b8]'>
                        {permission.description}
                      </span>
                    </TableCell>

                    {roles.map((role) => (
                      <TableCell key={role.id} className='p-4 text-center'>
                        <Switch
                          checked={
                            grants.get(grantKey(role.id, permission.id)) ??
                            false
                          }
                          onCheckedChange={() =>
                            toggleGrant(role.id, permission.id)
                          }
                        />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </Fragment>
            ))
          )}
        </TableBody>
      </Table>

      <div className='flex justify-end gap-4 border-t border-[#dfe1e6] pt-6 dark:border-[#1e293b]'>
        <Button
          type='button'
          variant='outline'
          disabled={isSaving}
          onClick={handleCancel}
          className='border-[#003d9b] px-8 text-[#003d9b] hover:bg-[#003d9b]/5 hover:text-[#003d9b] dark:border-[#60a5fa] dark:text-[#60a5fa] dark:hover:bg-[#60a5fa]/10 dark:hover:text-[#60a5fa]'
        >
          Cancelar
        </Button>
        <Button
          type='button'
          disabled={isSaving}
          onClick={handleSave}
          className='bg-[#003d9b] px-8 text-white hover:bg-[#003d9b]/90'
        >
          {isSaving ? <Loader2 className='size-3.5 animate-spin' /> : null}
          Salvar Alterações
        </Button>
      </div>
    </div>
  )
}

export default AccessMatrix
