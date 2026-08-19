export type EmployeeNoteTypeValue =
  'FEEDBACK' | 'PUNCTUALITY' | 'COMPLAINT' | 'PRAISE'

export const EMPLOYEE_NOTE_TYPE_LABEL: Record<EmployeeNoteTypeValue, string> = {
  FEEDBACK: 'Feedback',
  PUNCTUALITY: 'Pontualidade',
  COMPLAINT: 'Reclamação',
  PRAISE: 'Elogio',
}

export const EMPLOYEE_NOTE_TYPE_BADGE_CLASSNAME: Record<
  EmployeeNoteTypeValue,
  string
> = {
  FEEDBACK: 'bg-[#e0e7ff] text-[#4338ca]',
  PUNCTUALITY: 'bg-[#dbeafe] text-[#1d4ed8]',
  COMPLAINT: 'bg-[#fee2e2] text-[#b91c1c]',
  PRAISE: 'bg-[#e3f5e9] text-[#15803d]',
}
