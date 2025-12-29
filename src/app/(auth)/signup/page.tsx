import Link from "next/link";
import SignupForm from "../../../components/auth/SignupForm";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default async function page() {

  return (
    <div className="flex flex-col items-center justify-center h-full p-4 sm:p-6 bg-gradient-to-br from-background via-background to-muted/20 overflow-y-auto">
      <Card className="w-full max-w-md shadow-xl my-auto">
        <CardHeader className="space-y-2 text-center px-4 sm:px-6 pt-6 sm:pt-6">
          <CardTitle className="text-2xl sm:text-3xl font-bold">Inscription</CardTitle>
          <CardDescription className="text-sm sm:text-base">
            Créez votre compte pour rejoindre la bataille navale
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 px-4 sm:px-6 pb-6 sm:pb-6">
          <SignupForm />
          <p className="text-xs sm:text-sm text-muted-foreground text-center pt-4 border-t">
            Vous avez déjà un compte ?{" "}
            <Link href="/signin" className="text-primary font-medium hover:underline">
              Se connecter
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
