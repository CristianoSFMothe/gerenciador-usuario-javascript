'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'

import { forgotPasswordAction } from '../_actions/auth/forgot-password-action'
import { resetPasswordAction } from '../_actions/auth/reset-password-action'
import {
  type ForgotPasswordInput,
  forgotPasswordSchema,
} from '../_schema/forgot-password-schema'
import {
  type ResetPasswordInput,
  resetPasswordSchema,
} from '../_schema/reset-password-schema'
import AuthenticationButton from './authentication-button'
import AuthenticationInput from './authentication-input'

const FormError = ({
  message,
  testId,
}: {
  message: string
  testId: string
}) => (
  <p
    role='alert'
    data-testid={testId}
    className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
  >
    {message}
  </p>
)

type RequestOtpStepProps = {
  formError: string | null
  setFormError: (message: string | null) => void
  onRequested: (email: string, message: string) => void
}

const RequestOtpStep = ({
  formError,
  setFormError,
  onRequested,
}: RequestOtpStepProps) => {
  const form = useForm<ForgotPasswordInput>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  })

  const onSubmit = async (data: ForgotPasswordInput) => {
    setFormError(null)

    const result = await forgotPasswordAction(data.email)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    onRequested(data.email, result.message)
  }

  return (
    <Form {...form}>
      <form
        data-testid='forgot-password-form'
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className='space-y-6'
      >
        {formError ? (
          <FormError
            message={formError}
            testId='forgot-password-error-message'
          />
        ) : null}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <AuthenticationInput
                  data-testid='forgot-password-email-input'
                  type='email'
                  autoComplete='email'
                  autoFocus
                  placeholder='joao.silva@email.com'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AuthenticationButton
          data-testid='forgot-password-submit-button'
          isSubmitting={form.formState.isSubmitting}
        >
          Enviar código
        </AuthenticationButton>

        <p className='pt-2 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
          Lembrou sua senha?{' '}
          <Link
            href='/login'
            data-testid='forgot-password-login-link'
            className='font-semibold text-[#003d9b] hover:underline dark:text-[#60a5fa]'
          >
            Entrar
          </Link>
        </p>
      </form>
    </Form>
  )
}

type ResetPasswordStepProps = {
  email: string
  formError: string | null
  setFormError: (message: string | null) => void
}

const ResetPasswordStep = ({
  email,
  formError,
  setFormError,
}: ResetPasswordStepProps) => {
  const router = useRouter()
  const [isResending, setIsResending] = useState(false)

  const form = useForm<ResetPasswordInput>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { otp: '', password: '', confirmPassword: '' },
  })

  const onSubmit = async (data: ResetPasswordInput) => {
    setFormError(null)

    const result = await resetPasswordAction(email, data)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    toast.success(result.message)
    router.push('/login')
  }

  const handleResend = async () => {
    setIsResending(true)

    const result = await forgotPasswordAction(email)

    toast[result.success ? 'success' : 'error'](result.message)
    setIsResending(false)
  }

  return (
    <Form {...form}>
      <form
        data-testid='reset-password-form'
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className='space-y-6'
      >
        {formError ? (
          <FormError
            message={formError}
            testId='reset-password-error-message'
          />
        ) : null}

        <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
          Enviamos um código para <strong>{email}</strong>. Confira sua caixa de
          entrada e informe o código abaixo junto com a nova senha.
        </p>

        <FormField
          control={form.control}
          name='otp'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <AuthenticationInput
                  data-testid='reset-password-otp-input'
                  type='text'
                  inputMode='numeric'
                  autoComplete='one-time-code'
                  maxLength={6}
                  autoFocus
                  placeholder='000000'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nova senha</FormLabel>
              <FormControl>
                <AuthenticationInput
                  data-testid='reset-password-password-input'
                  isPassword
                  autoComplete='new-password'
                  placeholder='••••••••'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name='confirmPassword'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirmar nova senha</FormLabel>
              <FormControl>
                <AuthenticationInput
                  data-testid='reset-password-confirm-password-input'
                  isPassword
                  autoComplete='new-password'
                  placeholder='••••••••'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <AuthenticationButton
          data-testid='reset-password-submit-button'
          isSubmitting={form.formState.isSubmitting}
        >
          Redefinir senha
        </AuthenticationButton>

        <p className='pt-2 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
          Não recebeu o código?{' '}
          <button
            type='button'
            onClick={handleResend}
            disabled={isResending}
            data-testid='reset-password-resend-button'
            className='font-semibold text-[#003d9b] underline underline-offset-2 disabled:opacity-60 dark:text-[#60a5fa]'
          >
            {isResending ? 'Enviando...' : 'Reenviar código'}
          </button>
        </p>
      </form>
    </Form>
  )
}

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState<string | null>(null)
  const [formError, setFormError] = useState<string | null>(null)

  const handleRequested = (requestedEmail: string, message: string) => {
    setFormError(null)
    toast.success(message)
    setEmail(requestedEmail)
  }

  if (email) {
    return (
      <ResetPasswordStep
        email={email}
        formError={formError}
        setFormError={setFormError}
      />
    )
  }

  return (
    <RequestOtpStep
      formError={formError}
      setFormError={setFormError}
      onRequested={handleRequested}
    />
  )
}

export default ForgotPasswordForm
