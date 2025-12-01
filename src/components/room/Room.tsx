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
  const router = useRouter();

  const { user } = useUser();

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
    socket.on('room-data', (data: Room) => {
      console.log(data);
      setRoom(data);
      setIsCreator(data.creatorId === user?.id);
      setCurrentPlayer(data.players.find((player) => player.id === user?.id) || null);
      setOpponentPlayer(data.players.find((player) => player.id !== user?.id) || null);
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

  }, [socket, roomId, user?.id, router]);

  useEffect(() => {
    if(!room || !socket) return;
    if(room.players.every((player) => player.isReady) && isCreator) {
      socket.emit('create-game', { roomId });
    }
  }, [room, isCreator, socket, roomId]);

  if (!room) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <p>Code: {room.code}</p>
      <div className="flex gap-4">
        <PlayerCard player={currentPlayer} roomId={roomId} isCurrentUser={true} />
        <PlayerCard player={opponentPlayer} roomId={roomId} isCurrentUser={false} />
      </div>
      <Button variant="outline" onClick={handleLeaveRoom}>Quitter la partie</Button>
    </div>
  )
}
