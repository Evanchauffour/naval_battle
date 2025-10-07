import LoginForm from "@/components/auth/LoginForm";
import Link from "next/link";

export default async function page() {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <LoginForm />
        <p className="text-sm text-muted-foreground text-center">
          Vous n&apos;avez pas de compte ?{" "}
          <Link href="/signup" className="text-primary">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
