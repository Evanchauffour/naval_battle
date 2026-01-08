'use client'

import { CheckCircle, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";
import { Button } from "../ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Player } from "./Room";

export default function PlayerCard({ player, roomId, isCurrentUser }: { player: Player | null, roomId: string, isCurrentUser: boolean }) {
  const { socket } = useSocket();
  const [isReady, setIsReady] = useState(false);
  const { user } = useUser();

  useEffect(() => {
    if (!player) return;
    setIsReady(player.isReady || false);
  }, [player, user]);

  const handleReady = () => {
    if (!player) return;
    const newReadyState = !isReady;
    setIsReady(newReadyState);
    socket?.emit('set-ready', { roomId, isReady: newReadyState });
  }

  if (!player) {
    return (
      <Card className="flex-1 flex justify-center items-center min-h-[180px] sm:min-h-[200px] border-dashed">
        <CardContent className="flex flex-col items-center gap-3 p-6">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-muted-foreground" />
          <p className="text-xs sm:text-sm text-muted-foreground text-center">En attente d&apos;un joueur...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`flex-1 flex flex-col shadow-lg ${isReady ? 'bg-green-500/10 dark:bg-green-500/20 border-2 border-green-500' : ''}`}>
      {isReady ? (
        <>
          <CardContent className="flex flex-col items-center justify-center gap-2 flex-1 p-4 sm:p-6">
            <div className="p-2 sm:p-3 rounded-full bg-green-500/20">
              <CheckCircle className="w-6 h-6 sm:w-10 sm:h-10 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-center text-base sm:text-lg font-bold text-green-700 dark:text-green-400">Prêt !</p>
          </CardContent>
          {isCurrentUser && (
            <CardFooter className="pt-0 pb-3 sm:pb-4 flex justify-center">
              <Button variant="outline" className="w-full sm:w-auto" onClick={handleReady}>
                Annuler
              </Button>
            </CardFooter>
          )}
        </>
      ) : (
        <>
          <CardHeader className="pb-3 sm:pb-4">
            <CardTitle className="text-lg sm:text-xl">{player.name || 'Joueur'}</CardTitle>
          </CardHeader>
          {isCurrentUser && (
            <CardFooter className="pt-3 sm:pt-4">
              <Button className="w-full" size="lg" onClick={handleReady}>
                Prêt !
              </Button>
            </CardFooter>
          )}
          {!isCurrentUser && (
            <CardContent className="pt-3 sm:pt-4">
              <p className="text-xs sm:text-sm text-muted-foreground text-center">
                En attente...
              </p>
            </CardContent>
          )}
        </>
      )}
    </Card>
  )
}
