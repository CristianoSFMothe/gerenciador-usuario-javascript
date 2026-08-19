type AuditLogFieldValue = 'POSITION' | 'DEPARTMENT' | 'SALARY'

export const AUDIT_LOG_FIELD_LABEL: Record<AuditLogFieldValue, string> = {
  POSITION: 'Cargo',
  DEPARTMENT: 'Departamento',
  SALARY: 'Salário',
}
