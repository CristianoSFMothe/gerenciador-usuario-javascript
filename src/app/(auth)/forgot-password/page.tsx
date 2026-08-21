import AuthenticationCard from '../_components/authentication-card'
import ForgotPasswordForm from '../_components/forgot-password-form'

const ForgotPasswordPage = () => {
  return (
    <AuthenticationCard
      title='Esqueceu a senha?'
      description='Informe seu e-mail para receber um código de redefinição'
      imageSrc='/images/profile1.png'
      quote='Um registro simples, mantido com cuidado, vale mais do que um sistema complexo mal cuidado.'
      quoteAuthor='Pam Hand'
      quoteAuthorEmail='pam.hand@gmail.com'
    >
      <ForgotPasswordForm />
    </AuthenticationCard>
  )
}

export default ForgotPasswordPage
