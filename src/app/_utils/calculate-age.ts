/**
 * Calculates a person's current age in full years from their birth date.
 *
 * Subtracts the birth year from the current year, then corrects for the
 * case where this year's birthday hasn't happened yet (i.e. the current
 * month/day is still before the birth month/day), which would otherwise
 * overcount the age by one year.
 *
 * @param birthDate - Birth date as an ISO-like date string (e.g. `yyyy-mm-dd`),
 * as produced by a `<input type="date">` field.
 * @returns The age in full years, or `null` if `birthDate` is empty.
 *
 * @example
 * // today is 2024-06-01
 * calculateAge('2000-12-25') // 23 (birthday hasn't happened yet this year)
 * calculateAge('2000-01-10') // 24 (birthday already happened this year)
 */
export const calculateAge = (birthDate: string) => {
  if (!birthDate) return null

  const today = new Date()
  const birth = new Date(birthDate)
  let age = today.getFullYear() - birth.getFullYear()
  const hasHadBirthdayThisYear =
    today.getMonth() > birth.getMonth() ||
    (today.getMonth() === birth.getMonth() &&
      today.getDate() >= birth.getDate())

  if (!hasHadBirthdayThisYear) age -= 1

  return age
}
