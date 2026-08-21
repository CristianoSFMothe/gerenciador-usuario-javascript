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

export const sendVerificationEmail = async (to: string, url: string) => {
  const { error } = await resend.emails.send({
    from,
    to: [to],
    subject: 'Confirme seu e-mail',
    html: verificationEmailHtml(url),
    text: verificationEmailText(url),
  })

  if (error) {
    throw new Error(error.message)
  }
}
