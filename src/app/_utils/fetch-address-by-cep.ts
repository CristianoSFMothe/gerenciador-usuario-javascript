import { onlyDigits } from './masks'

type Address = {
  cep: string
  street: string
  neighborhood: string
  city: string
  state: string
}

type FetchAddressByCEPResult =
  { success: true; address: Address } | { success: false; error: string }

const GENERIC_ERROR_MESSAGE = 'Não foi possível buscar o CEP. Tente novamente.'

/**
 * Looks up a Brazilian address by its CEP (postal code) through the
 * app's own `/api/address-search` Route Handler.
 *
 * Strips mask characters before sending, and never throws — errors come
 * back as `{ success: false, error }` with a user-facing message, the
 * same result convention used by the app's Server Actions.
 *
 * @param cep - The CEP to look up, masked (`01310-100`) or raw (`01310100`).
 * @returns The address on success, or a user-facing error message.
 *
 * @example
 * const result = await fetchAddressByCEP('01310-100')
 * if (result.success) console.log(result.address.city) // 'São Paulo'
 */
export const fetchAddressByCEP = async (
  cep: string,
): Promise<FetchAddressByCEPResult> => {
  try {
    const response = await fetch(`/api/address-search?cep=${onlyDigits(cep)}`)
    const body = await response.json()

    if (!response.ok) {
      return { success: false, error: body.error ?? GENERIC_ERROR_MESSAGE }
    }

    return { success: true, address: body }
  } catch {
    return { success: false, error: GENERIC_ERROR_MESSAGE }
  }
}
