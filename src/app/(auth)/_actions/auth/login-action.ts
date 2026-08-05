import type { LoginInput } from '../../_schema/login-schema'

type LoginActionResult =
  { success: true; message: string } | { success: false; message: string }

export const loginAction = async (
  data: LoginInput,
): Promise<LoginActionResult> => {
  // TODO(Fase 3 - Autenticação): substituir por signIn.email do client do Better Auth
  console.log(data)

  return { success: true, message: 'Login realizado com sucesso.' }
}
