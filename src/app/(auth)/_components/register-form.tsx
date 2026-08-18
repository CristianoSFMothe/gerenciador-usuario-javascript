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

import { registerAction } from '../_actions/auth/register-action'
import { type RegisterInput, registerSchema } from '../_schema/register-schema'
import AuthenticationButton from './authentication-button'
import AuthenticationInput from './authentication-input'

const RegisterForm = () => {
  const router = useRouter()
  const [formError, setFormError] = useState<string | null>(null)

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })

  async function onSubmit(data: RegisterInput) {
    setFormError(null)

    const result = await registerAction(data)

    if (!result.success) {
      setFormError(result.message)
      return
    }

    toast.success(result.message)
    router.push('/login')
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
          name='name'
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nome completo</FormLabel>
              <FormControl>
                <AuthenticationInput
                  type='text'
                  autoComplete='name'
                  placeholder='Seu nome'
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
                  placeholder='voce@empresa.com'
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
              <FormLabel>Confirmar Senha</FormLabel>
              <FormControl>
                <AuthenticationInput
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

        <AuthenticationButton isSubmitting={form.formState.isSubmitting}>
          Cadastrar
        </AuthenticationButton>

        <p className='pt-2 text-center text-sm text-[#434654] dark:text-[#94a3b8]'>
          Já tem uma conta?{' '}
          <Link
            href='/login'
            className='font-semibold text-[#003d9b] hover:underline dark:text-[#60a5fa]'
          >
            Entrar
          </Link>
        </p>
      </form>
    </Form>
  )
}

export default RegisterForm
