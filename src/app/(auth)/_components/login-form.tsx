// src/app/(auth)/_components/login-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useForm } from 'react-hook-form'

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/app/_components/ui/form'

import { loginAction } from '../_actions/auth/login-action'
import { type LoginInput, loginSchema } from '../_schema/login-schema'
import AuthenticationButton from './authentication-button'
import AuthenticationInput from './authentication-input'

const LoginForm = () => {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data: LoginInput) => {
    setFormError(null)

    const result = await loginAction(data)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    router.push('/dashboard')
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
                  href='#'
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

export default LoginForm
