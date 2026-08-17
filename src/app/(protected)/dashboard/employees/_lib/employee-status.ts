type EmployeeStatusValue = 'ACTIVE' | 'INACTIVE'

export const EMPLOYEE_STATUS_LABEL: Record<EmployeeStatusValue, string> = {
  ACTIVE: 'Ativo',
  INACTIVE: 'Inativo',
}

export const EMPLOYEE_STATUS_BADGE_CLASSNAME: Record<
  EmployeeStatusValue,
  string
> = {
  ACTIVE: 'bg-[#e3f5e9] text-[#15803d]',
  INACTIVE: 'bg-[#f1f2f4] text-[#6b7280]',
}
