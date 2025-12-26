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
      <Card className="h-full shadow-lg">
        <CardContent className="p-4 sm:p-6 h-full">
          <div className="w-full flex flex-col gap-3 h-full">
            <Button
              onClick={handleCreateRoom}
              className="flex-1 h-auto py-5 sm:py-6 text-sm sm:text-base font-semibold hover:bg-primary/90 hover:text-primary-foreground shadow-sm"
              size="lg"
            >
              <Plus className="size-4 sm:size-5 shrink-0"/>
              <span className="text-left">Créer une partie privée</span>
            </Button>
            <Button
              onClick={() => setOpenJoinGameDialog(true)}
              variant="outline"
              className="flex gap-2 items-center flex-1 h-auto py-5 sm:py-6 text-sm sm:text-base font-semibold border-2 hover:bg-blue-50 dark:hover:bg-blue-950/20 hover:border-blue-400 transition-colors"
              size="lg"
            >
              <Search className="size-4 sm:size-5 shrink-0"/>
              <span className="text-left">Rejoindre une partie privée</span>
            </Button>
            <Button
              variant="outline"
              onClick={handleSearchGame}
              className="flex gap-2 sm:gap-3 items-center flex-1 h-auto py-5 sm:py-6 text-sm sm:text-base font-semibold border-2 hover:bg-green-50 dark:hover:bg-green-950/20 hover:border-green-400 transition-colors"
              size="lg"
            >
              <Globe className="size-4 sm:size-5 shrink-0"/>
              <div className="flex flex-col items-start min-w-0">
                <span className="text-left">Rechercher une partie</span>
                <span className="text-xs text-muted-foreground font-normal text-left">Jouer avec un joueur aléatoire</span>
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

