'use client'

import { Camera, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { type ChangeEvent, useRef, useState } from 'react'
import { toast } from 'sonner'

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from '@/app/_components/ui/avatar'
import { getInitials } from '@/app/_utils/get-initials'
import { uploadAvatarAction } from '@/app/(protected)/_actions/profile/upload-avatar-action'

const MAX_FILE_SIZE_IN_BYTES = 4 * 1024 * 1024

type ProfileAvatarUploadProps = {
  name: string
  image?: string | null
}

const ProfileAvatarUpload = ({ name, image }: ProfileAvatarUploadProps) => {
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (file.size > MAX_FILE_SIZE_IN_BYTES) {
      toast.error('A imagem deve ter no máximo 4MB.')
      return
    }

    const objectUrl = URL.createObjectURL(file)
    setPreview(objectUrl)
    setIsUploading(true)

    const formData = new FormData()
    formData.set('avatar', file)

    const result = await uploadAvatarAction(formData)

    setIsUploading(false)
    URL.revokeObjectURL(objectUrl)

    if (!result.success) {
      setPreview(null)
      toast.error(result.message)
      return
    }

    // Shows the uploaded image right away instead of depending on
    // router.refresh() re-fetching the session in time.
    setPreview(result.imageUrl)
    toast.success('Foto de perfil atualizada.')
    router.refresh()
  }

  return (
    <div className='relative flex min-h-48 items-center justify-center bg-[#f3faff] p-6 sm:min-h-full dark:bg-[#1e293b]'>
      <Avatar className='size-32 sm:size-36'>
        <AvatarImage src={preview ?? image ?? undefined} alt={name} />
        <AvatarFallback className='text-3xl'>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>

      <button
        type='button'
        onClick={() => inputRef.current?.click()}
        disabled={isUploading}
        aria-label='Alterar foto de perfil'
        title='Alterar foto de perfil'
        className='absolute right-6 bottom-6 flex size-9 items-center justify-center rounded-full bg-[#003d9b] text-white shadow-md hover:bg-[#003d9b]/90 disabled:opacity-60'
      >
        {isUploading ? (
          <Loader2 className='size-4 animate-spin' />
        ) : (
          <Camera className='size-4' />
        )}
      </button>

      <input
        ref={inputRef}
        type='file'
        accept='image/png,image/jpeg,image/webp'
        onChange={handleFileChange}
        className='sr-only'
      />
    </div>
  )
}

export default ProfileAvatarUpload
