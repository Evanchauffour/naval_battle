'use client'

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";
import { Button } from "../ui/button";
import PlayerCard from "./PlayerCard";

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

    return () => {
      socket.off('room-data');
      socket.off('game-created');
      socket.off('game-joined');
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
    <div className="flex flex-col gap-4">
      <p>Room id: {room.id}</p>
      <p>Code: {room.code}</p>
      <div className="flex gap-4">
        {/* Joueur actuel toujours à gauche */}
        <PlayerCard player={currentPlayer} roomId={roomId} isCurrentUser={true} />
        {/* Adversaire toujours à droite */}
        <PlayerCard player={opponentPlayer} roomId={roomId} isCurrentUser={false} />
      </div>
      <Button variant="outline" onClick={handleLeaveRoom}>Quitter la partie</Button>
    </div>
  )
}
