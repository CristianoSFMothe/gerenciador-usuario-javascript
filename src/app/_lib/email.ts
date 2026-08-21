import { Resend } from 'resend'

const resend = new Resend(process.env.RESEND_API_KEY)

const from =
  process.env.EMAIL_FROM || 'Gerenciador de Usuários <onboarding@resend.dev>'

const verificationEmailHtml = (url: string) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1f2933;">
    <h1 style="color: #003d9b; font-size: 20px;">Confirme seu e-mail</h1>
    <p>Clique no botão abaixo para confirmar seu endereço de e-mail e ativar sua conta.</p>
    <p style="margin: 32px 0;">
      <a
        href="${url}"
        style="background: #003d9b; color: #fff; padding: 12px 24px; border-radius: 999px; text-decoration: none; font-weight: 600; display: inline-block;"
      >
        Confirmar e-mail
      </a>
    </p>
    <p style="color: #6b7280; font-size: 13px;">Se você não criou uma conta, pode ignorar este e-mail.</p>
  </div>
`

const verificationEmailText = (url: string) =>
  `Confirme seu e-mail\n\nAcesse o link abaixo para confirmar seu endereço de e-mail e ativar sua conta:\n${url}\n\nSe você não criou uma conta, pode ignorar este e-mail.`

const passwordResetOtpHtml = (otp: string) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1f2933;">
    <h1 style="color: #003d9b; font-size: 20px;">Redefinição de senha</h1>
    <p>Use o código abaixo para redefinir sua senha. Ele expira em 5 minutos.</p>
    <p style="margin: 32px 0; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center;">
      ${otp}
    </p>
    <p style="color: #6b7280; font-size: 13px;">Se você não pediu a redefinição de senha, pode ignorar este e-mail.</p>
  </div>
`

const passwordResetOtpText = (otp: string) =>
  `Redefinição de senha\n\nUse o código abaixo para redefinir sua senha. Ele expira em 5 minutos.\n\n${otp}\n\nSe você não pediu a redefinição de senha, pode ignorar este e-mail.`

const loginOtpHtml = (otp: string) => `
  <div style="font-family: sans-serif; max-width: 480px; margin: 0 auto; color: #1f2933;">
    <h1 style="color: #003d9b; font-size: 20px;">Confirme seu login</h1>
    <p>Use o código abaixo para concluir seu login. Ele expira em 5 minutos.</p>
    <p style="margin: 32px 0; font-size: 32px; font-weight: 700; letter-spacing: 8px; text-align: center;">
      ${otp}
    </p>
    <p style="color: #6b7280; font-size: 13px;">Se você não tentou entrar na sua conta, recomendamos redefinir sua senha.</p>
  </div>
`

const loginOtpText = (otp: string) =>
  `Confirme seu login\n\nUse o código abaixo para concluir seu login. Ele expira em 5 minutos.\n\n${otp}\n\nSe você não tentou entrar na sua conta, recomendamos redefinir sua senha.`

const sendEmail = async (options: {
  to: string
  subject: string
  html: string
  text: string
}) => {
  const { error } = await resend.emails.send({
    from,
    ...options,
    to: [options.to],
  })

  if (error) {
    throw new Error(error.message)
  }
}

export const sendVerificationEmail = async (to: string, url: string) => {
  await sendEmail({
    to,
    subject: 'Confirme seu e-mail',
    html: verificationEmailHtml(url),
    text: verificationEmailText(url),
  })
}

export const sendPasswordResetOTP = async (to: string, otp: string) => {
  await sendEmail({
    to,
    subject: 'Código para redefinir sua senha',
    html: passwordResetOtpHtml(otp),
    text: passwordResetOtpText(otp),
  })
}

export const sendLoginOTP = async (to: string, otp: string) => {
  await sendEmail({
    to,
    subject: 'Código para confirmar seu login',
    html: loginOtpHtml(otp),
    text: loginOtpText(otp),
  })
}
