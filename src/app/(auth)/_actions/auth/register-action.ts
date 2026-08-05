import type { RegisterInput } from '../../_schema/register-schema'

type RegisterActionResult =
  { success: true; message: string } | { success: false; message: string }

export const registerAction = async (
  data: RegisterInput,
): Promise<RegisterActionResult> => {
  // TODO(Fase 3 - Autenticação): substituir por signUp.email do client do Better Auth
  console.log(data)

  return { success: true, message: 'Conta criada com sucesso.' }
}
