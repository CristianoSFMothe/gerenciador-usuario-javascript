import cep from 'cep-promise'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'

import { auth } from '@/app/_lib/auth'
import { onlyDigits } from '@/app/_utils/masks'

const CEP_LOOKUP_TIMEOUT_IN_MS = 5_000

export async function GET(request: Request) {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 401 })
  }

  const cepParam = new URL(request.url).searchParams.get('cep') ?? ''
  const rawCep = onlyDigits(cepParam)

  if (rawCep.length !== 8) {
    return NextResponse.json(
      { error: 'CEP inválido. Informe 8 dígitos.' },
      { status: 400 },
    )
  }

  try {
    const address = await cep(rawCep, { timeout: CEP_LOOKUP_TIMEOUT_IN_MS })

    return NextResponse.json({
      cep: address.cep,
      street: address.street,
      neighborhood: address.neighborhood,
      city: address.city,
      state: address.state,
    })
  } catch {
    return NextResponse.json(
      { error: 'CEP não encontrado. Verifique o número informado.' },
      { status: 404 },
    )
  }
}
