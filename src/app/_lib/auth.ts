import { betterAuth } from 'better-auth'
import { prismaAdapter } from 'better-auth/adapters/prisma'
import { nextCookies } from 'better-auth/next-js'
import { emailOTP } from 'better-auth/plugins'

import { sendPasswordResetOTP, sendVerificationEmail } from './email'
import { prisma } from './prisma'

const ONE_DAY_IN_SECONDS = 60 * 60 * 24
const ONE_HOUR_IN_SECONDS = 60 * 60

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    // Bloqueia o login até o e-mail ser confirmado; isso também já
    // dispara o envio automático da verificação no cadastro.
    requireEmailVerification: true,
  },
  emailVerification: {
    sendVerificationEmail: async ({ user, url }) => {
      await sendVerificationEmail(user.email, url)
    },
    sendOnSignUp: true,
    autoSignInAfterVerification: true,
    expiresIn: ONE_HOUR_IN_SECONDS,
  },
  session: {
    // Expira em 7 dias e renova a cada login/uso após 1 dia — valores
    // padrão do Better Auth, tornados explícitos para não depender de
    // um default que pode mudar em futuras versões da lib.
    expiresIn: 7 * ONE_DAY_IN_SECONDS,
    updateAge: ONE_DAY_IN_SECONDS,
  },
  rateLimit: {
    // Limite geral já fica ativo por padrão em produção; aqui apertamos
    // especificamente login e cadastro contra força bruta/credential stuffing.
    customRules: {
      '/sign-in/email': { window: 60, max: 5 },
      '/sign-up/email': { window: 60, max: 3 },
      '/send-verification-email': { window: 60, max: 3 },
      '/email-otp/request-password-reset': { window: 60, max: 3 },
      '/email-otp/reset-password': { window: 60, max: 5 },
    },
  },
  plugins: [
    emailOTP({
      // Usado só para recuperação de senha — a verificação de cadastro
      // continua no fluxo de link (emailVerification acima).
      sendVerificationOTP: async ({ email, otp, type }) => {
        if (type === 'forget-password') {
          await sendPasswordResetOTP(email, otp)
        }
      },
    }),
    nextCookies(),
  ],
})
