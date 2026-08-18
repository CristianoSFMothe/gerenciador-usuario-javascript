type EmploymentStatusValue = 'CURRENT' | 'PAST'

export const EMPLOYMENT_STATUS_LABEL: Record<EmploymentStatusValue, string> = {
  CURRENT: 'Atual',
  PAST: 'Anterior',
}

export const EMPLOYMENT_STATUS_BADGE_CLASSNAME: Record<
  EmploymentStatusValue,
  string
> = {
  CURRENT: 'bg-[#e3f5e9] text-[#15803d]',
  PAST: 'bg-[#f1f2f4] text-[#6b7280]',
}
