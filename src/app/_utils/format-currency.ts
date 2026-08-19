/**
 * Formats a number as Brazilian currency for display (e.g. `R$ 5.000,00`).
 *
 * @param amount - The numeric amount.
 * @returns The amount formatted with the `pt-BR` currency convention.
 *
 * @example
 * formatCurrencyBRL(5000) // 'R$ 5.000,00'
 */
export const formatCurrencyBRL = (amount: number) =>
  new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(amount)
