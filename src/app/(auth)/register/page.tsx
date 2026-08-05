import AuthenticationCard from '../_components/authentication-card'
import RegisterForm from '../_components/register-form'

const RegisterPage = () => {
  return (
    <AuthenticationCard
      title='Crie sua conta'
      description='Preencha os dados para começar'
      imageSrc='/images/profile2.png'
      quote='Um registro simples, mantido com cuidado, vale mais do que um sistema complexo mal cuidado.'
      quoteAuthor='Pam Hand'
      quoteAuthorEmail='pam.hand@gmail.com'
    >
      <RegisterForm />
    </AuthenticationCard>
  )
}

export default RegisterPage
