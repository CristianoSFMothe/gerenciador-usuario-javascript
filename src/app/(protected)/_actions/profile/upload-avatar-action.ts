'use server'

import type { UploadApiResponse } from 'cloudinary'
import { revalidatePath } from 'next/cache'
import { headers } from 'next/headers'

import { auth } from '@/app/_lib/auth'
import cloudinary from '@/app/_lib/cloudinary'
import { prisma } from '@/app/_lib/prisma'

const MAX_FILE_SIZE_IN_BYTES = 4 * 1024 * 1024
const ALLOWED_MIME_TYPES = ['image/png', 'image/jpeg', 'image/webp']

type UploadAvatarResult =
  { success: true; imageUrl: string } | { success: false; message: string }

const uploadToCloudinary = (buffer: Buffer, publicId: string) =>
  new Promise<UploadApiResponse>((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'avatars',
        public_id: publicId,
        overwrite: true,
        transformation: [
          { width: 400, height: 400, crop: 'fill', gravity: 'face' },
        ],
      },
      (error, result) => {
        if (error || !result) {
          reject(error ?? new Error('Falha ao enviar a imagem.'))
          return
        }
        resolve(result)
      },
    )

    uploadStream.end(buffer)
  })

export const uploadAvatarAction = async (
  formData: FormData,
): Promise<UploadAvatarResult> => {
  const session = await auth.api.getSession({ headers: await headers() })

  if (!session) {
    return {
      success: false,
      message: 'Sua sessão expirou. Faça login novamente.',
    }
  }

  const file = formData.get('avatar')

  if (!(file instanceof File) || file.size === 0) {
    return { success: false, message: 'Selecione uma imagem para enviar.' }
  }

  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      success: false,
      message: 'Envie uma imagem em PNG, JPEG ou WebP.',
    }
  }

  if (file.size > MAX_FILE_SIZE_IN_BYTES) {
    return { success: false, message: 'A imagem deve ter no máximo 4MB.' }
  }

  const buffer = Buffer.from(await file.arrayBuffer())

  let uploadResult: UploadApiResponse

  try {
    uploadResult = await uploadToCloudinary(buffer, session.user.id)
  } catch {
    return {
      success: false,
      message: 'Não foi possível enviar a imagem. Tente novamente.',
    }
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { image: uploadResult.secure_url },
  })

  revalidatePath('/dashboard/profile')

  return { success: true, imageUrl: uploadResult.secure_url }
}
