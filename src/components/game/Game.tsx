'use client'

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";
import CurrentPlayerGrid from "./CurrentPlayerGrid";
import GameResultModal from "./GameResultModal";
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
  imgHorizontal: string;
  imgVertical: string;
  isKilled: boolean;
  coordinates: {
    left: number;
    top: number;
  }[];
}

export default function Game({ gameId }: { gameId: string }) {
  const { user } = useUser();
  const { socket } = useSocket();
  const [currentPlayer, setCurrentPlayer] = useState<PlayerGameState | null>(null);
  const [opponentPlayer, setOpponentPlayer] = useState<PlayerGameState | null>(null);
  const [gameStatus, setGameStatus] = useState<GameStatus>("ORGANIZING_BOATS");
  const [currentTurn, setCurrentTurn] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !user) return;

    socket?.emit('get-game', { gameId });

    socket?.on('game-data', (data: GameState) => {
      setCurrentPlayer(data.players.find((player) => player.userId === user?.id) || null);
      setOpponentPlayer(data.players.find((player) => player.userId !== user?.id) || null);
      setGameStatus(data.status);
      setCurrentTurn(data.currentTurn);
    });

    return () => {
      socket?.off('game-data');
    };
  }, [gameId, user, socket]);

  if (!currentPlayer || !opponentPlayer) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  return (
    <>
      <GameResultModal
        open={gameStatus === "ENDED"}
        gameId={gameId}
      />
      <div className="flex flex-col gap-4">
        {gameStatus === "IN_GAME" && (
          <div className="flex justify-center items-center">
            <h1 className="text-4xl font-bold text-white">{currentPlayer.userId === currentTurn ? "Votre tour" : "Au tour de votre adversaire"}</h1>
          </div>
        )}
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
            isDisabled={currentTurn !== currentPlayer?.userId || gameStatus !== "IN_GAME"}
          />
        </div>
      </div>
    </>
  )
}
