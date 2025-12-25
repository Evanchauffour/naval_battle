'use client'

import { Globe, Plus, Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import JoinGameDialog from "./JoinGameDialog";
import MatchmakingModal from "./MatchmakingModal";

export default function CreateGameButtons() {
  const router = useRouter();
  const { socket } = useSocket();
  const { user } = useUser();
  const [openJoinGameDialog, setOpenJoinGameDialog] = useState(false);
  const [isMatchmaking, setIsMatchmaking] = useState(false);

  useEffect(() => {
    if (!socket) return;

    socket.on('room-created', (data) => {
      if(!data.id) return;
      toast.success('Partie créée');
      router.push(`/room/${data.id}`);
    });

    socket.on('match-found', (data) => {
      console.log('data', data);
      setIsMatchmaking(false);

      if(!data.id) return;
      toast.success('Partie trouvée');
      router.push(`/room/${data.id}`);
    });

    return () => {
      socket.off('room-created');
      socket.off('match-found');
    };

  }, [socket, router]);

  const handleCreateRoom = () => {
    if (!user || !socket) return;

    try {
      socket.emit('create-room');
    } catch (error) {
      console.log('Erreur:', error);
    }
  }

  const handleSearchGame = () => {
    console.log('handleSearchGame');

    console.log('user', user);


    if (!user || !socket) return;

    try {
      setIsMatchmaking(true);
      socket.emit('start-matchmaking');
    } catch (error) {
      console.log('Erreur:', error);
      setIsMatchmaking(false);
    }
  }

  return (
    <>
      <Card>
        <CardContent className="h-full">
          <div className="w-full flex flex-col gap-2 h-full">
            <Button onClick={handleCreateRoom} className="flex-1 hover:bg-primary/90 hover:text-primary-foreground">
              <Plus className="size-5"/>
              <span className="text-left">Créer une partie privée</span>
            </Button>
            <Button onClick={() => setOpenJoinGameDialog(true)} className="flex gap-2 items-center flex-1 bg-blue-200 text-blue-500 border border-blue-500 hover:bg-blue-200/80 hover:text-blue-500">
              <Search className="size-5"/>
              <span className="text-left">Rejoindre une partie privée</span>
            </Button>
            <Button variant="outline" onClick={handleSearchGame}  className="flex gap-4 items-center flex-1 bg-green-200 hover:bg-green-200/80 hover:text-green-500 text-green-500 border border-green-500">
              <Globe className="size-5"/>
              <div className="flex flex-col">
                <span className="text-left">Rechercher une partie</span>
                <span className="text-xs text-black/50 text-left">Jouer avec un joueur aléatoire</span>
              </div>
            </Button>
          </div>
        </CardContent>
      </Card>
      <JoinGameDialog open={openJoinGameDialog} setOpen={setOpenJoinGameDialog} userId={user?.id || ''} />
      <MatchmakingModal open={isMatchmaking} onOpenChange={setIsMatchmaking} />
    </>
  )
}

