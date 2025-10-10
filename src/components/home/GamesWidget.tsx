'use client'


import { Gamepad2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";
import { Room } from "../room/Room";
import { Button } from "../ui/button";
import Widget from "./Widget";

export default function GamesWidget({ className }: { className?: string }) {
  const router = useRouter();
  const { socket, connected } = useSocket();
  const [roomList, setRoomList] = useState<Room[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!socket) return;

    socket.emit('get-room-list')
    socket.on('room-list', (data) => {
      setRoomList(data);
    });

    return () => {
      socket.off('room-list');
    };

  }, [socket, router]);

  const handleJoinRoom = (roomId: string, isFull: boolean) => {
    if (!connected || !user || isFull) return;

    try {
      socket.emit('join-room', { roomId, userId: user.id });
      router.push(`/room/${roomId}`);
    } catch (error) {
      console.log('Erreur:', error);
    }
  }

  const handleClearRoomList = () => {
    socket.emit('clear-room-list');
  }

  return (
    <Widget title="Games" description="Join a public game" icon={<Gamepad2 className="w-5 h-5" />} className={className}>
      <ul className="flex flex-col gap-2 w-full">
        {roomList.map((room) => (
          <li key={room.id} className="border border-card-muted rounded-md p-2 flex justify-between items-center">
            <span>Joueurs: {room.players.length} / 2</span>
            <Button variant="outline" disabled={room.players.length >= 2} onClick={() => handleJoinRoom(room.id, room.players.length >= 2)}>
              Rejoindre
            </Button>
          </li>
        ))}
      </ul>
      <Button variant="outline" className="w-full mt-4" onClick={handleClearRoomList}>Clear room list</Button>
    </Widget>
  )
}

