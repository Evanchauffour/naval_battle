"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import FormInput from "../ui/FormInput";

const registerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  username: z.string().min(3, "Le nom d'utilisateur doit contenir au moins 3 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
    console.log('api url:', process.env.NEXT_PUBLIC_API_URL);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        toast.success('Email de vérification envoyé');
      } else {
        toast.error('Inscription échouée');
      }
    } catch (error) {
      console.log(error);
    }

  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <FormInput<RegisterFormData>
        register={register}
        errors={errors}
        label="Prénom"
        placeholder="Prénom"
        name="firstName"
      />
      <FormInput<RegisterFormData>
        register={register}
        errors={errors}
        label="Nom"
        placeholder="Nom"
        name="lastName"
      />
      <FormInput<RegisterFormData>
        register={register}
        errors={errors}
        label="Nom d'utilisateur"
        placeholder="Nom d'utilisateur"
        name="username"
      />
      <FormInput<RegisterFormData>
        register={register}
        errors={errors}
        label="Email"
        placeholder="Email"
        name="email"
      />
      <FormInput<RegisterFormData>
        register={register}
        errors={errors}
        label="Mot de passe"
        placeholder="Mot de passe"
        name="password"
        type="password"
      />
      <Button
        type="submit"
        className="w-full cursor-pointer"
      >
        Inscription
      </Button>
    </form>
  );
}
