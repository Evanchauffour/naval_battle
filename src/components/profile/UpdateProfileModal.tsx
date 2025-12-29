'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import FormInput from '../ui/FormInput'
import { useRouter } from 'next/navigation'
import { useUserActions } from '../../store/user.store'

const updateProfileSchema = z.object({
  username: z.string().min(3, "Le pseudo doit contenir au moins 3 caractères"),
  currentPassword: z.string().min(1, "Le mot de passe actuel est requis"),
  newPassword: z.string().optional().or(z.literal('')),
  confirmPassword: z.string().optional().or(z.literal('')),
}).refine((data) => {
  const hasNewPassword = data.newPassword && data.newPassword.trim() !== ''
  if (hasNewPassword) {
    if (data.newPassword.length < 6) {
      return false
    }
    return data.newPassword === data.confirmPassword
  }
  return true
}, {
  message: "Les mots de passe ne correspondent pas",
  path: ["confirmPassword"],
}).refine((data) => {
  const hasNewPassword = data.newPassword && data.newPassword.trim() !== ''
  if (hasNewPassword) {
    return data.newPassword.length >= 6
  }
  return true
}, {
  message: "Le nouveau mot de passe doit contenir au moins 6 caractères",
  path: ["newPassword"],
})

type UpdateProfileFormData = z.infer<typeof updateProfileSchema>

interface UpdateProfileModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentUsername?: string
}

export default function UpdateProfileModal({
  open,
  onOpenChange,
  currentUsername
}: UpdateProfileModalProps) {
  const router = useRouter()
  const { updateUser } = useUserActions()
  const [isLoading, setIsLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      username: currentUsername || '',
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
    },
  })

  useEffect(() => {
    if (open && currentUsername) {
      reset({
        username: currentUsername,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      })
    }
  }, [open, currentUsername, reset])

  const onSubmit = async (data: UpdateProfileFormData) => {
    setIsLoading(true)
    try {
      const updateData: {
        username?: string
        currentPassword: string
        newPassword?: string
      } = {
        currentPassword: data.currentPassword,
      }

      if (data.username && data.username !== currentUsername) {
        updateData.username = data.username
      }

      if (data.newPassword && data.newPassword.trim() !== '') {
        updateData.newPassword = data.newPassword
      }

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
        method: 'PATCH',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        const updatedUser = await response.json()
        updateUser({
          ...updatedUser,
          name: updatedUser.username, // Pour compatibilité avec l'ancien code
        })
        toast.success('Profil mis à jour avec succès')
        onOpenChange(false)
        reset()
        router.refresh()
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Erreur lors de la mise à jour' }))
        const errorMessage = errorData.message || errorData.error || 'Erreur lors de la mise à jour du profil'
        toast.error(errorMessage)
      }
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Une erreur est survenue')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-2xl">Modifier le profil</DialogTitle>
          <DialogDescription>
            Mettez à jour votre pseudo et/ou votre mot de passe
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput<UpdateProfileFormData>
            register={register}
            errors={errors}
            label="Pseudo"
            placeholder="Pseudo"
            name="username"
          />
          <FormInput<UpdateProfileFormData>
            register={register}
            errors={errors}
            label="Mot de passe actuel"
            placeholder="Mot de passe actuel"
            name="currentPassword"
            type="password"
          />
          <FormInput<UpdateProfileFormData>
            register={register}
            errors={errors}
            label="Nouveau mot de passe (optionnel)"
            placeholder="Laissez vide pour ne pas changer"
            name="newPassword"
            type="password"
          />
          <FormInput<UpdateProfileFormData>
            register={register}
            errors={errors}
            label="Confirmer le nouveau mot de passe"
            placeholder="Confirmer le nouveau mot de passe"
            name="confirmPassword"
            type="password"
          />
          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                reset()
              }}
              className="flex-1"
            >
              Annuler
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="flex-1"
            >
              {isLoading ? 'Mise à jour...' : 'Mettre à jour'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

