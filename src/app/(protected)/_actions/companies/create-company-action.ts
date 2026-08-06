'use server'

import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'
import { onlyDigits } from '@/app/_utils/masks'
import { Prisma } from '@/generated/prisma/client'

import {
  type CompanyInput,
  companySchema,
} from '../../dashboard/companies/_schema/company-schema'

type CreateCompanyActionResult =
  { success: true; message: string } | { success: false; message: string }

const CNPJ_ALREADY_EXISTS_MESSAGE =
  'Já existe uma empresa cadastrada com esse CNPJ.'

export const createCompanyAction = async (
  data: CompanyInput,
): Promise<CreateCompanyActionResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const parsed = companySchema.safeParse(data)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  const cnpj = onlyDigits(parsed.data.cnpj)

  const existingCompany = await prisma.company.findUnique({
    where: { cnpj },
    select: { id: true },
  })

  if (existingCompany) {
    return { success: false, message: CNPJ_ALREADY_EXISTS_MESSAGE }
  }

  try {
    await prisma.company.create({
      data: {
        legalName: parsed.data.corporateName,
        tradeName: parsed.data.tradeName,
        cnpj,
        stateRegistration: parsed.data.stateRegistration || null,
        municipalRegistration: parsed.data.municipalRegistration || null,
        foundedAt: new Date(parsed.data.foundationDate),
        website: parsed.data.website || null,
        email: parsed.data.email,
        landlinePhone: onlyDigits(parsed.data.landlinePhone),
        mobilePhone: parsed.data.mobilePhone
          ? onlyDigits(parsed.data.mobilePhone)
          : null,
        sectors: parsed.data.sectors ?? [],
        postalCode: parsed.data.postalCode
          ? onlyDigits(parsed.data.postalCode)
          : null,
        street: parsed.data.street,
        streetNumber: parsed.data.number || null,
        complement: parsed.data.complement || null,
        neighborhood: parsed.data.neighborhood,
        city: parsed.data.city,
        state: parsed.data.state,
      },
    })
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      return { success: false, message: CNPJ_ALREADY_EXISTS_MESSAGE }
    }

    throw error
  }

  return { success: true, message: 'Empresa cadastrada com sucesso.' }
}
