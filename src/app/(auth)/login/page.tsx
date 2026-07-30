'use client'

import { zodResolver } from '@hookform/resolvers/zod'
import { Eye, EyeOff, Loader2, Quote } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

import { cn } from '@/app/_lib/utils'

const loginSchema = z.object({
  email: z.email('Informe um e-mail válido.').min(1, 'Informe seu e-mail.'),
  password: z.string().min(6, 'Informe sua senha.'),
})

type LoginInput = z.infer<typeof loginSchema>

const Login = () => {
  const [showPassword, setShowPassword] = useState(false)
  const [formError, setFormError] = useState<string | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginInput>({ resolver: zodResolver(loginSchema) })

  const onSubmit = async (data: LoginInput) => {
    setFormError(null)
    // TODO(Fase 3 - Autenticação): substituir por signIn.email do client do Better Auth
    console.log(data)
  }

  return (
    <main className='grid min-h-screen lg:grid-cols-2'>
      <aside className='relative hidden lg:block'>
        <Image
          src='/images/profile1.png'
          alt=''
          fill
          priority
          quality={10}
          className='object-cover'
        />

        <div className='absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent' />

        <div className='absolute inset-x-10 bottom-10 text-white'>
          <Quote className='mb-4 size-8 fill-white text-white' />
          <p className='text-lg leading-relaxed font-medium'>
            Um registro simples, mantido com cuidado, vale mais do que um
            sistema complexo mal cuidado.
          </p>

          <p className='mt-4 text-sm font-semibold'>Pam Hand</p>
          <p className='text-sm text-white/70'>pam.hand@gmail.com</p>
        </div>
      </aside>

      <section className='flex items-center justify-center px-6 py-16 sm:px-10'>
        <div className='w-full max-w-md'>
          <h1 className='text-center text-3xl font-extrabold tracking-tight'>
            Bem-vindo de volta!!
          </h1>
          <p className='mt-2 text-center text-sm text-neutral-500'>
            Entre com sua conta para continuar
          </p>

          <form
            onSubmit={handleSubmit(onSubmit)}
            noValidate
            className='mt-10 space-y-6'
          >
            {formError ? (
              <p
                role='alert'
                className='rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600'
              >
                {formError}
              </p>
            ) : null}

            <div className='space-y-2'>
              <label
                htmlFor='email'
                className='text-sm font-medium text-neutral-800'
              >
                E-mail
              </label>
              <input
                id='email'
                type='email'
                autoComplete='email'
                autoFocus
                placeholder='joao.silva@email.com'
                aria-invalid={!!errors.email}
                className={cn(
                  'h-14 w-full rounded-xl border border-neutral-200 px-6 text-sm',
                  'transition-colors outline-none placeholder:text-neutral-400 focus:border-neutral-900',
                  errors.email && 'border-red-300',
                )}
                {...register('email')}
              />
              {errors.email ? (
                <p className='px-2 text-xs text-red-600'>
                  {errors.email.message}
                </p>
              ) : null}
            </div>

            <div className='space-y-2'>
              <label
                htmlFor='password'
                className='text-sm font-medium text-neutral-800'
              >
                Senha
              </label>
              <div className='relative'>
                <input
                  id='password'
                  type={showPassword ? 'text' : 'password'}
                  autoComplete='current-password'
                  placeholder='••••••••'
                  aria-invalid={!!errors.password}
                  className={cn(
                    'h-14 w-full rounded-xl border border-neutral-200 px-6 pr-14 text-sm',
                    'transition-colors outline-none placeholder:text-neutral-400 focus:border-neutral-900',
                    errors.password && 'border-red-300',
                  )}
                  {...register('password')}
                />
                <button
                  type='button'
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
                  className='absolute inset-y-0 right-5 flex items-center text-neutral-400 hover:text-neutral-700'
                >
                  {showPassword ? (
                    <EyeOff className='size-4' />
                  ) : (
                    <Eye className='size-4' />
                  )}
                </button>
              </div>
              {errors.password ? (
                <p className='px-2 text-xs text-red-600'>
                  {errors.password.message}
                </p>
              ) : null}

              <div className='flex justify-end'>
                <Link
                  href='#'
                  className='text-xs font-semibold text-neutral-800 hover:underline'
                >
                  Esqueceu a senha?
                </Link>
              </div>
            </div>

            <button
              type='submit'
              disabled={isSubmitting}
              className={cn(
                'flex h-14 w-full items-center justify-center gap-2 rounded-full',
                'bg-neutral-950 text-sm font-semibold text-white transition-colors',
                'hover:bg-neutral-800 disabled:opacity-60',
              )}
            >
              {isSubmitting ? (
                <Loader2 className='size-4 animate-spin' />
              ) : null}
              Entrar
            </button>

            <div className='flex items-center gap-3 py-1'>
              <span className='h-px flex-1 bg-neutral-200' />
            </div>

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
        </div>
      </section>
    </main>
  )
}

export default Login
