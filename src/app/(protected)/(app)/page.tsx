'use client'

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { toast } from "sonner";
import FriendsWidget from "../../../components/home/FriendsWidget";
import GamesWidget from "../../../components/home/GamesWidget";
import LeaderboardWidget from "../../../components/home/LeaderboardWidget";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useSocket } from "../../../hook/useSocket";
import { useUser } from "../../../store/user.store";

export default function Page() {
  const router = useRouter();
  const { socket, connected } = useSocket();
  const { user } = useUser();

  useEffect(() => {
    if (!socket) return;

    socket.on('room-created', (data) => {
      if(!data.id) return;
      toast.success('Partie créée');
      router.push(`/room/${data.id}`);
    });
    return () => {
      socket.off('room-created');
    };

  }, [socket, router]);

  const handleCreateRoom = () => {
    if (!connected || !user) return;

    try {
      socket.emit('create-room', { userId: user.id });
    } catch (error) {
      console.log('Erreur:', error);
    }
  }

  if (!connected) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full flex flex-col gap-4">
      {user && (
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {user.name} !</h1>
        </div>
      )}
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
        <Card>
          <CardContent>
            <div className="w-full flex flex-col gap-2">
              <Button onClick={handleCreateRoom} disabled={!connected || !user}>
                Créer une partie
              </Button>
              <Button variant="outline" disabled={!connected || !user}>
                Rejoindre une partie
              </Button>
            </div>
          </CardContent>
        </Card>
        <FriendsWidget className=""/>
        <LeaderboardWidget className="col-start-2 col-span-1"/>
        <GamesWidget className="col-span-1 row-start-2 col-start-1"/>
      </div>
    </div>
  )
}
