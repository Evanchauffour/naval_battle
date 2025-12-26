import LoginForm from "@/components/auth/LoginForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default async function page() {

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 bg-gradient-to-br from-background via-background to-muted/20">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="space-y-2 text-center px-4 sm:px-6 pt-6 sm:pt-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Connexion</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Connectez-vous à votre compte pour commencer à jouer
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-6 sm:pb-6">
          <LoginForm />
          <p className="text-xs sm:text-sm text-muted-foreground text-center pt-4 border-t">
            Vous n&apos;avez pas de compte ?{" "}
            <Link href="/signup" className="text-primary font-medium hover:underline">
              Créer un compte
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
