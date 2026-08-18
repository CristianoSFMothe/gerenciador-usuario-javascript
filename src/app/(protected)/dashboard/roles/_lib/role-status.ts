type RoleStatusValue = 'ACTIVE' | 'INACTIVE'

export const ROLE_STATUS_LABEL: Record<RoleStatusValue, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}

export const ROLE_STATUS_BADGE_CLASSNAME: Record<RoleStatusValue, string> = {
  ACTIVE: 'bg-[#e3f5e9] text-[#15803d]',
  INACTIVE: 'bg-[#f1f2f4] text-[#6b7280]',
}
