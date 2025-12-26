'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";
import { Button } from "../ui/button";
import PlayerCard from "./PlayerCard";
import { RoomCanceledModal } from "./RoomCanceledModal";

export interface Player {
  id: string;
  name?: string;
  isReady?: boolean;
}

export interface Room {
  id: string;
  code: string;
  creatorId: string;
  players: Player[];
  createdAt: Date;
  status: 'lobby' | 'in-game' | 'ended';
}

export default function Room({ roomId }: { roomId: string }) {
  const { socket } = useSocket();
  const [room, setRoom] = useState<Room | null>(null);
  const [currentPlayer, setCurrentPlayer] = useState<Player | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<Player | null>(null);
  const [isCreator, setIsCreator] = useState(false);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [showRoomCanceledModal, setShowRoomCanceledModal] = useState(false);
  const [leavingPlayerName, setLeavingPlayerName] = useState<string | undefined>(undefined);
  const router = useRouter();

  const { user } = useUser();

  // Récupérer l'ID utilisateur depuis le backend via API
  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });

        if (response.ok) {
          const currentUser = await response.json();
          if (currentUser?.id) {
            setCurrentUserId(currentUser.id);
          }
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      }
    };
    fetchCurrentUser();
  }, []);

  const handleLeaveRoom = () => {
    if (!socket || !roomId) return;
    socket.emit('leave-room', { roomId });
    router.push('/');
  }

  useEffect(() => {
    if (!socket || !roomId) return;

    // Get room data
    socket.emit('get-room', { roomId });

    // Listen to room updates
    socket.on('room-data', (data: Room | undefined) => {
      console.log('Room data received:', data);
      console.log('Current user id from store:', user?.id);
      console.log('Current userId from API:', currentUserId);

      if (!data) {
        console.error('Room data is null or undefined');
        // Ne pas bloquer l'affichage, essayer de récupérer à nouveau
        setTimeout(() => {
          socket.emit('get-room', { roomId });
        }, 1000);
        return;
      }

      setRoom(data);

      // Utiliser currentUserId si disponible, sinon user?.id
      // Si aucun n'est disponible, on attend encore
      const userId = currentUserId || user?.id;
      console.log('Using userId:', userId);

      if (!userId) {
        console.warn('No userId available yet, waiting...');
        // Réessayer de récupérer l'utilisateur
        fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/profile`, {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        })
          .then(res => res.json())
          .then(currentUser => {
            if (currentUser?.id) {
              setCurrentUserId(currentUser.id);
            }
          })
          .catch(err => console.error('Error fetching user:', err));
        return;
      }

      setIsCreator(data.creatorId === userId);

      // S'assurer que le currentPlayer est toujours à gauche et l'opponentPlayer à droite
      const current = data.players?.find((player) => player.id === userId) || null;
      const opponent = data.players?.find((player) => player.id !== userId) || null;

      console.log('Current player:', current);
      console.log('Opponent player:', opponent);

      setCurrentPlayer(current);
      setOpponentPlayer(opponent);
    });

    // Listen to game created
    socket.on('game-created', (data) => {
      if(data.creatorId === user?.id) {
        // Redirect to game if user is creator
        router.push(`/game/${data}`);
      } else {
        // Join game if user is not creator
        socket.emit('join-game', { gameId: data });
      }
    });

    // Listen to game join confirmation
    socket.on('game-joined', (data) => {
      router.push(`/game/${data}`);
    });

    // Listen to player leaving room
    socket.on('player-left-room', (data: { roomId: string; leavingPlayerName: string; message: string }) => {
      console.log('Player left room:', data);
      // Afficher la modale avec le message
      if (data.roomId === roomId) {
        setLeavingPlayerName(data.leavingPlayerName);
        setShowRoomCanceledModal(true);
      }
    });

    // Listen to room closed
    socket.on('room-closed', (data: { roomId: string }) => {
      console.log('Room closed:', data);
      if (data.roomId === roomId) {
        setShowRoomCanceledModal(true);
      }
    });

    return () => {
      socket.off('room-data');
      socket.off('game-created');
      socket.off('game-joined');
      socket.off('player-left-room');
      socket.off('room-closed');
    };

  }, [socket, roomId, user?.id, currentUserId, router]);

  useEffect(() => {
    if(!room || !socket) return;
    if(room.players.every((player) => player.isReady) && isCreator) {
      socket.emit('create-game', { roomId });
    }
  }, [room, isCreator, socket, roomId]);

  if (!room) {
    return <div>Chargement...</div>;
  }

  console.log('currentPlayer', currentPlayer);
  console.log('opponentPlayer', opponentPlayer);

  return (
    <>
      <RoomCanceledModal
        open={showRoomCanceledModal}
        leavingPlayerName={leavingPlayerName}
      />
      <div className="flex flex-col gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
        <div className="text-center space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold">Salle de jeu</h1>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-2 sm:gap-4 text-muted-foreground">
            <span className="text-xs sm:text-sm">ID: {room.id}</span>
            <span className="hidden sm:inline text-sm">•</span>
            <span className="text-xs sm:text-sm font-mono font-semibold text-foreground">Code: {room.code}</span>
          </div>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
          {/* Joueur actuel toujours à gauche */}
          <PlayerCard player={currentPlayer} roomId={roomId} isCurrentUser={true} />
          {/* Adversaire toujours à droite */}
          <PlayerCard player={opponentPlayer} roomId={roomId} isCurrentUser={false} />
        </div>
        <div className="flex justify-center pt-2 sm:pt-4">
          <Button variant="outline" onClick={handleLeaveRoom} size="lg" className="w-full sm:w-auto">
            Quitter la partie
          </Button>
        </div>
      </div>
    </>
  )
}
