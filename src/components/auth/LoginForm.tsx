"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import * as z from "zod";
import { useUserActions } from "../../store/user.store";
import { Button } from "../ui/button";
import FormInput from "../ui/FormInput";

const loginSchema = z.object({
  email: z.string().email("Invalid email"),
  password: z.string().min(1, "Password is required"),
});

type LoginFormData = z.infer<typeof loginSchema>;

export default function LoginForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) });
  const { setUser } = useUserActions();

  const onSubmit = async (data: LoginFormData) => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
        method: 'POST',
        credentials: 'include',
        body: JSON.stringify(data),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        setUser(await response.json());
        toast.success('Connexion réussie');
        router.push('/');
      } else {
        toast.error('Connexion échouée');
      }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 w-full">
      <FormInput<LoginFormData>
        register={register}
        errors={errors}
        label="Email"
        placeholder="Email"
        name="email"
      />
      <FormInput<LoginFormData>
        register={register}
        errors={errors}
        label="Password"
        placeholder="Password"
        name="password"
        type="password"
      />
      <Button
        type="submit"
        className="w-full cursor-pointer"
      >
        Connexion
      </Button>
    </form>
  );
}
