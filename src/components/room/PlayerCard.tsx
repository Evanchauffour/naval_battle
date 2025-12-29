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
    setIsReady(!isReady);
    socket?.emit('set-ready', { roomId, isReady });
  }

  if (!player) {
    return (
      <Card className="flex-1 flex justify-center items-center min-h-[180px] sm:min-h-[200px] border-dashed">
        <CardContent className="flex flex-col items-center gap-3 p-6">
          <Loader2 className="w-5 h-5 sm:w-6 sm:h-6 animate-spin text-muted-foreground" />
          <p className="text-xs sm:text-sm text-muted-foreground text-center">En attente d'un joueur...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex-1 relative overflow-hidden shadow-lg">
      {isReady ? (
        <div className="absolute top-0 left-0 w-full h-full bg-green-500/10 dark:bg-green-500/20 border-2 border-green-500 rounded-xl flex flex-col gap-3 sm:gap-4 justify-center items-center p-4 sm:p-6 z-10">
          <div className="p-3 sm:p-4 rounded-full bg-green-500/20">
            <CheckCircle className="w-8 h-8 sm:w-12 sm:h-12 text-green-600 dark:text-green-400" />
          </div>
          <p className="text-center text-lg sm:text-xl font-bold text-green-700 dark:text-green-400">Prêt !</p>
          {isCurrentUser && (
            <Button variant="outline" className="mt-2 w-full sm:w-auto" onClick={handleReady}>
              Annuler
            </Button>
          )}
        </div>
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
