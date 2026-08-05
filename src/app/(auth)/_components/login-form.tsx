// src/app/(auth)/_components/login-form.tsx
'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import Link from 'next/link'
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
    }
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
            className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'
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
                  className='text-xs font-semibold text-neutral-800 hover:underline'
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

        <p className='pt-2 text-center text-sm text-neutral-500'>
          Não tem uma conta?{' '}
          <Link
            href='/register'
            className='font-semibold text-neutral-900 hover:underline'
          >
            Cadastre-se
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default LoginForm
