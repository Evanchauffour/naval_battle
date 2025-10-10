'use client'

import { CheckCircle, Loader2, XCircle } from "lucide-react";
import Link from "next/link";
import { useParams } from 'next/navigation';
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "../../../components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../../../components/ui/card";

export default function Page() {
  const params = useParams<{ token: string }>()
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const handleVerifyEmail = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/verify-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token: params.token }),
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
  }, [params.token]);

  useEffect(() => {
    handleVerifyEmail();
  }, [handleVerifyEmail]);

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
