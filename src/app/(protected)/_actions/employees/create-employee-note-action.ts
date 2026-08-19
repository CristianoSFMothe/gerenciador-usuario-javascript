'use server'

import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'
import { z } from 'zod'

import { auth } from '@/app/_lib/auth'
import { prisma } from '@/app/_lib/prisma'

const createEmployeeNoteSchema = z.object({
  employeeId: z.string().min(1),
  type: z.enum(['FEEDBACK', 'PUNCTUALITY', 'COMPLAINT', 'PRAISE']),
  content: z.string().min(1, 'Escreva o conteúdo da nota.'),
})

type CreateEmployeeNoteInput = z.infer<typeof createEmployeeNoteSchema>

type CreateEmployeeNoteResult =
  { success: true; message: string } | { success: false; message: string }

export const createEmployeeNoteAction = async (
  input: CreateEmployeeNoteInput,
): Promise<CreateEmployeeNoteResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const parsed = createEmployeeNoteSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, message: 'Dados inválidos.' }
  }

  await prisma.employeeNote.create({
    data: {
      employeeId: parsed.data.employeeId,
      type: parsed.data.type,
      content: parsed.data.content,
      authorId: session.user.id,
    },
  })

  revalidatePath('/dashboard/profile')

  return { success: true, message: 'Nota adicionada com sucesso.' }
}
