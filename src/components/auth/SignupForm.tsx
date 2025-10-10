"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { Button } from "../ui/button";
import FormInput from "../ui/FormInput";

const registerSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type RegisterFormData = z.infer<typeof registerSchema>;

export default function SignupForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data: RegisterFormData) => {
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
        label="Name"
        placeholder="Name"
        name="name"
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
        label="Password"
        placeholder="Password"
        name="password"
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
