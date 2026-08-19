/**
 * Formats a Brazilian CPF (individual taxpayer registry) as the user types.
 *
 * Strips every non-digit character, caps the input at 11 digits, and
 * progressively applies the `000.000.000-00` pattern, so it also produces
 * a sensible result for partial (in-progress) input.
 *
 * @param value - Raw input value, digits and/or mask characters.
 * @returns The value formatted as `000.000.000-00` (or a partial prefix of it).
 *
 * @example
 * maskCPF('31451815050') // '314.518.150-50'
 */
export const maskCPF = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 11)
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
}

/**
 * Formats a Brazilian phone number as the user types.
 *
 * Strips every non-digit character and caps the input at 11 digits, then
 * picks the mask based on how many digits are present so far: `(00) 0000-0000`
 * for a landline (10 digits) or `(00) 00000-0000` for a mobile number
 * (11 digits, with the leading 9). Also produces a sensible result for
 * partial (in-progress) input.
 *
 * @param value - Raw input value, digits and/or mask characters.
 * @returns The value formatted as `(00) 0000-0000` or `(00) 00000-0000`
 * (or a partial prefix of one of them).
 *
 * @example
 * maskPhone('1133334444')  // '(11) 3333-4444'
 * maskPhone('11987654321') // '(11) 98765-4321'
 */
export const maskPhone = (value: string) => {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 10) {
    return digits
      .replace(/(\d{2})(\d)/, '($1) $2')
      .replace(/(\d{4})(\d)/, '$1-$2')
  }

  return digits
    .replace(/(\d{2})(\d)/, '($1) $2')
    .replace(/(\d{5})(\d)/, '$1-$2')
}

/**
 * Formats a Brazilian CEP (postal code) as the user types.
 *
 * Strips every non-digit character, caps the input at 8 digits, and
 * progressively applies the `00000-000` pattern, so it also produces a
 * sensible result for partial (in-progress) input.
 *
 * @param value - Raw input value, digits and/or mask characters.
 * @returns The value formatted as `00000-000` (or a partial prefix of it).
 *
 * @example
 * maskCEP('12345678') // '12345-678'
 */
export const maskCEP = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 8)
    .replace(/(\d{5})(\d)/, '$1-$2')
}

/**
 * Formats a Brazilian CNPJ (company taxpayer registry) as the user types.
 *
 * Strips every non-digit character, caps the input at 14 digits, and
 * progressively applies the `00.000.000/0000-00` pattern, so it also
 * produces a sensible result for partial (in-progress) input.
 *
 * @param value - Raw input value, digits and/or mask characters.
 * @returns The value formatted as `00.000.000/0000-00` (or a partial prefix of it).
 *
 * @example
 * maskCNPJ('11222333000181') // '11.222.333/0001-81'
 */
export const maskCNPJ = (value: string) => {
  return value
    .replace(/\D/g, '')
    .slice(0, 14)
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
}

/**
 * Formats a value as Brazilian currency (without the `R$` prefix) as the
 * user types.
 *
 * Strips every non-digit character and treats the digits as cents, so
 * typing progressively builds the amount from the right (e.g. `5`, `50`,
 * `500` become `0,05`, `0,50`, `5,00`).
 *
 * @param value - Raw input value, digits and/or mask characters.
 * @returns The value formatted as `1.234,56` (or a partial prefix of it).
 *
 * @example
 * maskCurrency('500000') // '5.000,00'
 */
export const maskCurrency = (value: string) => {
  const digits = value.replace(/\D/g, '')

  if (!digits) return ''

  const cents = digits.padStart(3, '0')
  const integerPart = cents.slice(0, -2).replace(/^0+(?=\d)/, '')
  const decimalPart = cents.slice(-2)

  return `${integerPart.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.')},${decimalPart}`
}

/**
 * Parses a `maskCurrency`-formatted value (e.g. `1.234,56`) back into a
 * plain number (`1234.56`), suitable for a Prisma `Decimal` field.
 *
 * @param value - A `maskCurrency`-formatted value.
 * @returns The numeric amount, or `0` if `value` is empty.
 *
 * @example
 * parseCurrency('5.000,00') // 5000
 */
export const parseCurrency = (value: string) => {
  const normalized = value.replace(/\./g, '').replace(',', '.')

  return normalized ? Number(normalized) : 0
}

/**
 * Strips every non-digit character from a value.
 *
 * The inverse of the `mask*` helpers in this module — use it to normalize
 * a masked value (e.g. `314.518.150-50`) back to its raw digits
 * (`31451815050`) before persisting it.
 *
 * @param value - A masked or partially masked value.
 * @returns Only the digit characters from `value`, in the original order.
 *
 * @example
 * onlyDigits('314.518.150-50') // '31451815050'
 */
export const onlyDigits = (value: string) => value.replace(/\D/g, '')
