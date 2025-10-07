import Link from "next/link";
import SignupForm from "../../../components/auth/SignupForm";

export default async function page() {

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <div className="w-[400px] space-y-4">
        <h1 className="text-2xl font-bold">Inscription</h1>
        <SignupForm />
        <p className="text-sm text-muted-foreground text-center">
          Vous avez déjà un compte ?{" "}
          <Link href="/signin" className="text-primary">
            Créer un compte
          </Link>
        </p>
      </div>
    </div>
  );
}
