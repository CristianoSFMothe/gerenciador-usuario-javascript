export type SalaryChangeReasonValue =
  'INITIAL' | 'ANNUAL_ADJUSTMENT' | 'PROMOTION' | 'MARKET_ADJUSTMENT' | 'OTHER'

export const SALARY_REASON_LABEL: Record<SalaryChangeReasonValue, string> = {
  INITIAL: 'Salário inicial',
  ANNUAL_ADJUSTMENT: 'Reajuste anual',
  PROMOTION: 'Promoção',
  MARKET_ADJUSTMENT: 'Ajuste de mercado',
  OTHER: 'Outro',
}
