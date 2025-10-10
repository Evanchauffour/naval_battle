'use client'

import { Globe, Loader2, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import FriendsWidget from "../../../components/home/FriendsWidget";
import HistoryWidget from "../../../components/home/HistoryWidget";
import JoinGameDialog from "../../../components/home/JoinGameDialog";
import LeaderboardWidget from "../../../components/home/LeaderboardWidget";
import { Button } from "../../../components/ui/button";
import { Card, CardContent } from "../../../components/ui/card";
import { useSocket } from "../../../hook/useSocket";
import { useUser } from "../../../store/user.store";

export default function Page() {
  const router = useRouter();
  const { socket, connected } = useSocket();
  const { user } = useUser();
  const [openJoinGameDialog, setOpenJoinGameDialog] = useState(false);

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
    <>
    <div className="w-full flex flex-col gap-4">
      {user && (
        <div>
          <h1 className="text-2xl font-bold">Bonjour, {user.name} !</h1>
        </div>
      )}
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
        <Card>
          <CardContent className="h-full">
            <div className="w-full flex flex-col gap-2 h-full">
              <Button onClick={handleCreateRoom} disabled={!connected || !user} className="flex-1 hover:bg-primary/90 hover:text-primary-foreground">
                <Plus className="size-5"/>
                <span className="text-left">Créer une partie</span>
              </Button>
              <Button onClick={() => setOpenJoinGameDialog(true)} disabled={!connected || !user} className="flex gap-2 items-center flex-1 bg-blue-200 text-blue-500 border border-blue-500 hover:bg-blue-200/80 hover:text-blue-500">
                <Search className="size-5"/>
                <span className="text-left">Rejoindre une partie privée</span>
              </Button>
              <Button variant="outline" disabled={!connected || !user} className="flex gap-4 items-center flex-1 bg-green-200 hover:bg-green-200/80 hover:text-green-500 text-green-500 border border-green-500">
                <Globe className="size-5"/>
                <div className="flex flex-col">
                  <span className="text-left">Rechercher une partie</span>
                  <span className="text-xs text-black/50 text-left">Jouer avec un joueur aléatoire</span>
                </div>
              </Button>
            </div>
          </CardContent>
        </Card>
        <FriendsWidget className=""/>
        <LeaderboardWidget className="col-start-2 col-span-1"/>
        <HistoryWidget className="col-span-1 row-start-2 col-start-1"/>
      </div>
    </div>
    <JoinGameDialog open={openJoinGameDialog} setOpen={setOpenJoinGameDialog} userId={user?.id || ''} />
    </>
  )
}
