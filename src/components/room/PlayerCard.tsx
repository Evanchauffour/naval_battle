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
    return <Card className="flex-1 flex justify-center items-center">
      <CardContent>
        <Loader2 className="w-4 h-4 animate-spin" />
      </CardContent>
    </Card>;
  }

  return (
    <Card className="flex-1 relative overflow-hidden">
      <CardHeader>
        <CardTitle>{player.name}</CardTitle>
      </CardHeader>
      {isCurrentUser && (
        <CardFooter>
          <Button className="w-full" onClick={handleReady}>Prêt !</Button>
        </CardFooter>
      )}
      {isReady && (
        <div className="absolute top-0 left-0 w-full h-full bg-green-50 flex flex-col gap-2 justify-center items-center p-4">
          <CheckCircle className="w-8 h-8 text-green-500" />
          <p className="text-black text-center text-lg font-bold">Ready !</p>
          <Button variant="outline" className="w-full" onClick={handleReady}>Annuler</Button>
        </div>
      )}
    </Card>
  )
}
