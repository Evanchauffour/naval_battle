'use client'

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react"; // Ajout de useEffect
import { Room } from "../../components/room/Room";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";

export default function Page() {
  const router = useRouter();
  const { socket, connected } = useSocket();
  const [roomList, setRoomList] = useState<Room[]>([]);
  const { user } = useUser();

  useEffect(() => {
    if (!socket) return;

    socket.on('room-created', (data) => {
      router.push(`/room/${data.id}`);
    });

    socket.emit('get-room-list')
    socket.on('room-list', (data) => {
      console.log('Liste des parties:', data);
      setRoomList(data);
    });

    return () => {
      socket.off('room-created');
      socket.off('room-list');
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

  if (!connected) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    )
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-4">
      {user && (
        <div className="text-center">
          <h1 className="text-2xl font-bold">Bonjour, {user.name} !</h1>
        </div>
      )}
      <div className="w-[500px] flex flex-col gap-2">
        <Button onClick={handleCreateRoom} disabled={!connected || !user}>
          Créer une partie
        </Button>
        <Button variant="outline" disabled={!connected || !user}>
          Rejoindre une partie
        </Button>
        <Card>
          <CardHeader>
            <CardTitle>Liste des parties</CardTitle>
          </CardHeader>
          <CardContent>
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
          </CardContent>
        </Card>
        <Button variant="outline" onClick={handleClearRoomList}>Clear room list</Button>
      </div>
    </div>
  )
}
