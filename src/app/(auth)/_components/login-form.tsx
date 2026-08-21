// src/app/(auth)/_components/login-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
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

import { loginAction } from '../_actions/auth/login-action'
import { resendVerificationAction } from '../_actions/auth/resend-verification-action'
import { sendLoginOtpAction } from '../_actions/auth/send-login-otp-action'
import { verifyLoginOtpAction } from '../_actions/auth/verify-login-otp-action'
import { type LoginOtpInput, loginOtpSchema } from '../_schema/login-otp-schema'
import { type LoginInput, loginSchema } from '../_schema/login-schema'
import AuthenticationButton from './authentication-button'
import AuthenticationInput from './authentication-input'

const VERIFICATION_ERROR_MESSAGES: Record<string, string> = {
  TOKEN_EXPIRED: 'O link de confirmação expirou. Solicite um novo abaixo.',
  INVALID_TOKEN: 'O link de confirmação é inválido. Solicite um novo abaixo.',
}

type CredentialsStepProps = {
  onTwoFactorRequired: () => void
}

const CredentialsStep = ({ onTwoFactorRequired }: CredentialsStepProps) => {
  const router = useRouter()
  const searchParams = useSearchParams()
  const verificationError = searchParams.get('error')

  const [formError, setFormError] = useState<string | null>(() =>
    verificationError
      ? (VERIFICATION_ERROR_MESSAGES[verificationError] ??
        'Não foi possível confirmar seu e-mail.')
      : null,
  )
  const [showResend, setShowResend] = useState(() => Boolean(verificationError))
  const [isResending, setIsResending] = useState(false)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  useEffect(() => {
    if (!verificationError && searchParams.get('verified') === '1') {
      toast.success('E-mail confirmado! Faça login para continuar.')
    }
  }, [searchParams, verificationError])

  const onSubmit = async (data: LoginInput) => {
    setFormError(null)
    setShowResend(false)

    const result = await loginAction(data)

    if (!result.success) {
      setFormError(result.message)
      setShowResend(result.code === 'EMAIL_NOT_VERIFIED')
      return
    }

    if (result.twoFactorRequired) {
      const otpResult = await sendLoginOtpAction()
      toast[otpResult.success ? 'success' : 'error'](otpResult.message)
      onTwoFactorRequired()
      return
    }

    router.push('/dashboard')
  }

  const handleResend = async () => {
    setIsResending(true)

    const result = await resendVerificationAction(form.getValues('email'))

    toast[result.success ? 'success' : 'error'](result.message)
    setIsResending(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className='space-y-6'
      >
        {formError ? (
          <div
            role='alert'
            className='space-y-2 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
          >
            <p>{formError}</p>

            {showResend ? (
              <button
                type='button'
                onClick={handleResend}
                disabled={isResending}
                className='font-semibold underline underline-offset-2 disabled:opacity-60'
              >
                {isResending ? 'Enviando...' : 'Reenviar e-mail de confirmação'}
              </button>
            ) : null}
          </div>
        ) : null}

        <FormField
          control={form.control}
          name='email'
          render={({ field }) => (
            <FormItem>
              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <AuthenticationInput
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

        <FormField
          control={form.control}
          name='password'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Senha</FormLabel>
              <FormControl>
                <AuthenticationInput
                  isPassword
                  autoComplete='current-password'
                  placeholder='••••••••'
                  {...field}
                />
              </FormControl>
              <FormMessage />

              <div className='flex justify-end'>
                <Link
                  href='/forgot-password'
                  className='text-xs font-semibold text-[#003d9b] hover:underline dark:text-[#60a5fa]'
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </FormItem>
          )}
        />

        <AuthenticationButton isSubmitting={form.formState.isSubmitting}>
          Entrar
        </AuthenticationButton>

        <p className='pt-2 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
          Não tem uma conta?{' '}
          <Link
            href='/register'
            className='font-semibold text-[#003d9b] hover:underline dark:text-[#60a5fa]'
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </Form>
  )
}

type OtpStepProps = {
  onBack: () => void
}

const OtpStep = ({ onBack }: OtpStepProps) => {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)
  const [isResending, setIsResending] = useState(false)

  const form = useForm<LoginOtpInput>({
    resolver: zodResolver(loginOtpSchema),
    defaultValues: { code: '' },
  })

  const onSubmit = async (data: LoginOtpInput) => {
    setFormError(null)

    const result = await verifyLoginOtpAction(data)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    router.push('/dashboard')
  }

  const handleResend = async () => {
    setIsResending(true)

    const result = await sendLoginOtpAction()

    toast[result.success ? 'success' : 'error'](result.message)
    setIsResending(false)
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        noValidate
        className='space-y-6'
      >
        {formError ? (
          <p
            role='alert'
            className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600 dark:border-red-900/50 dark:bg-red-950/40 dark:text-red-400'
          >
            {formError}
          </p>
        ) : null}

        <p className='text-sm text-[#434654] dark:text-[#94a3b8]'>
          Enviamos um código de confirmação para o seu e-mail. Informe-o abaixo
          para concluir o login.
        </p>

        <FormField
          control={form.control}
          name='code'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Código</FormLabel>
              <FormControl>
                <AuthenticationInput
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

        <AuthenticationButton isSubmitting={form.formState.isSubmitting}>
          Confirmar
        </AuthenticationButton>

        <div className='flex items-center justify-between pt-2 text-sm text-[#434654] dark:text-[#94a3b8]'>
          <button
            type='button'
            onClick={onBack}
            className='font-semibold text-[#003d9b] hover:underline dark:text-[#60a5fa]'
          >
            Voltar
          </button>

          <button
            type='button'
            onClick={handleResend}
            disabled={isResending}
            className='font-semibold text-[#003d9b] underline underline-offset-2 disabled:opacity-60 dark:text-[#60a5fa]'
          >
            {isResending ? 'Enviando...' : 'Reenviar código'}
          </button>
        </div>
      </form>
    </Form>
  )
}

const LoginForm = () => {
  const [twoFactorRequired, setTwoFactorRequired] = useState(false)

  if (twoFactorRequired) {
    return <OtpStep onBack={() => setTwoFactorRequired(false)} />
  }

  return (
    <CredentialsStep onTwoFactorRequired={() => setTwoFactorRequired(true)} />
  )
}

export default LoginForm
