'use client'

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { socket } from "../../lib/socket-io";
import { useUser } from "../../store/user.store";
import CurrentPlayerGrid from "./CurrentPlayerGrid";
import OpponentPlayerGrid from "./OpponentPlayerGrid";

export interface GameState {
  gameId: string;
  roomId: string;
  players: PlayerGameState[];
  currentTurn: string;
  status: GameStatus;
}

export type GameStatus = "ORGANIZING_BOATS" | "IN_GAME" | "ENDED";

interface PlayerGameState {
  userId: string;
  ships: BoatInterface[];
  selectedCells: { left: number; top: number }[];
  isReady: boolean;
}

export interface BoatInterface {
  id: number;
  width: number;
  height: number;
  img: string;
  isKilled: boolean;
  coordinates: {
    left: number;
    top: number;
  }[];
}

export default function Game({ gameId }: { gameId: string }) {
  const { user } = useUser();
  const [currentPlayer, setCurrentPlayer] = useState<PlayerGameState | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<PlayerGameState | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("ORGANIZING_BOATS");

  useEffect(() => {
    if (!socket || !user) return;

    socket.emit('get-game', { gameId });

    socket.on('game-data', (data: GameState) => {
      setCurrentPlayer(data.players.find((player) => player.userId === user?.id) || null);
      setOpponentPlayer(data.players.find((player) => player.userId !== user?.id) || null);
      console.log(data.status);
      setGameStatus(data.status);

      if (data.status === "ORGANIZING_BOATS" && data.players.every((player) => player.isReady)) {
        console.log("Starting game");
        socket.emit('start-game', { gameId });
      }
    });

    return () => {
      socket.off('game-data');
    };
  }, [gameId, user]);

  if (!currentPlayer || !opponentPlayer) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  return (
    <div className='flex justify-center items-start gap-14'>
      <CurrentPlayerGrid
        boatsList={currentPlayer?.ships || []}
        gameId={gameId}
        playerId={currentPlayer?.userId || ''}
        selectedCells={opponentPlayer.selectedCells || []}
        gameStatus={gameStatus}
      />
      <OpponentPlayerGrid boatsList={opponentPlayer?.ships || []}
        selectedCells={currentPlayer.selectedCells || []}
        gameId={gameId}
        currentPlayerId={currentPlayer?.userId || ''}
        gameStatus={gameStatus}
      />
    </div>
  )
}
