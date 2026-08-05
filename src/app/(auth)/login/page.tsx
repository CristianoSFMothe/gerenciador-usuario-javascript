import AuthenticationCard from '../_components/authentication-card'
import LoginForm from '../_components/login-form'

const LoginPage = () => {
  return (
    <AuthenticationCard
      title='Bem-vindo de volta!!'
      description='Entre com sua conta para continuar'
      imageSrc='/images/profile1.png'
      quote='Um registro simples, mantido com cuidado, vale mais do que um sistema complexo mal cuidado.'
      quoteAuthor='Pam Hand'
      quoteAuthorEmail='pam.hand@gmail.com'
    >
      <LoginForm />
    </AuthenticationCard>
  )
}

export default LoginPage
