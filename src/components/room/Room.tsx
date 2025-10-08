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
  const router = useRouter();

  const { user } = useUser();

  const handleLeaveRoom = () => {
    if (!socket || !roomId) return;
    socket.emit('leave-room', { roomId, userId: user?.id });
    router.push('/');
  }

  useEffect(() => {
    if (!socket || !room) return;
    socket.on('game-started', (data) => {
      if(room?.creatorId === user?.id) {
        router.push(`/game/${roomId}`);
      } else {
        socket.emit('join-game', { gameId: data.gameId });
      }
      console.log('Game started:', data);
    });
    console.log(room.creatorId, user?.id);

    if(room.creatorId !== user?.id) {
      socket.on('game-joined', (data) => {
        console.log('Game joined:', data);

        router.push(`/game/${data.gameId}`);
      });
    }

    return () => {
      socket.off('game-started');
      socket.off('game-joined');
    };
  }, []);

  useEffect(() => {
    if (!socket || !roomId) return;

    socket.emit('get-room', { roomId });

    socket.on('room-data', (data: Room) => {
      setRoom(data);
      setCurrentPlayer(data.players.find((player) => player.id === user?.id) || null);
      setOpponentPlayer(data.players.find((player) => player.id !== user?.id) || null);
    });

    return () => {
      socket.off('room-data');
    };

  }, [socket, roomId]);

  useEffect(() => {
    if(!room) return;
    if(room.players.every((player) => player.isReady && (room.creatorId === user?.id))) {
      socket.emit('start-game', { roomId });
    }
  }, [room]);

  if (!room) {
    return <div>Chargement...</div>;
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex gap-4">
        <PlayerCard player={currentPlayer} roomId={roomId} isCurrentUser={true} />
        <PlayerCard player={opponentPlayer} roomId={roomId} isCurrentUser={false} />
      </div>
      <Button variant="outline" onClick={handleLeaveRoom}>Quitter la partie</Button>
    </div>
  )
}
