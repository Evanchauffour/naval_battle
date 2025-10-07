'use client'

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";

export default function Page() {
  const searchParams = useSearchParams()
  const token = searchParams.get('token') as string;
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleVerifyEmail = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token }),
        credentials: 'include',
      });
      if (response.ok) {
        toast.success('Adresse e-mail vérifiée');
      } else {
        toast.error('Adresse e-mail non vérifiée');
        setIsError(true);
      }
    } catch (error) {
      console.log(error);
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    handleVerifyEmail();
  }, []);

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">
      <Loader2 className="animate-spin" />
    </div>;
  }

  return (
    <Card className="max-w-md w-full text-center">
      <CardHeader className="flex flex-col items-center">
          {isError ? (
            <XCircle className="w-10 h-10 text-red-500" />
          ) : (
            <CheckCircle className="w-10 h-10 text-green-500" />
          )}
          <CardTitle className="text-2xl font-bold">{isError ? "Erreur" : "Adresse e-mail vérifiée"}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">{isError ? "Une erreur est survenue lors de la vérification de votre adresse e-mail." : "Votre adresse e-mail a été confirmée avec succès. Vous pouvez maintenant vous connecter."}</p>
      </CardContent>
      <CardFooter className="justify-center">
        <Button asChild size="lg">
          <Link href="/">Accéder au jeu</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}
