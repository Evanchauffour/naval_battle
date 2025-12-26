'use client'

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { useSocket } from "../../hook/useSocket";
import { useUser } from "../../store/user.store";
import CurrentPlayerGrid from "./CurrentPlayerGrid";
import GameChat from "./GameChat";
import GameResultModal from "./GameResultModal";
import { LeaveGameModal } from "./LeaveGameModal";
import OpponentPlayerGrid from "./OpponentPlayerGrid";

export interface GameState {
  gameId: string;
  roomId: string;
  players: PlayerGameState[];
  currentTurn: string;
  status: GameStatus;
  leavingUserId?: string; // ID du joueur qui a quitté (forfait)
  messages?: Message[]; // Messages du chat
}

export interface Message {
  userId: string;
  username: string;
  message: string;
  timestamp: Date;
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
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const [isForfeit, setIsForfeit] = useState(false);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // Récupérer l'ID utilisateur depuis le backend
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

  useEffect(() => {
    if (!socket) return;

    socket?.emit('get-game', { gameId });

    socket?.on('game-data', (data: GameState) => {
      console.log('Game data received:', data);
      console.log('Current user id from store:', user?.id);
      console.log('Current userId from API:', currentUserId);

      // Utiliser currentUserId si disponible, sinon user?.id
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

      const current = data.players.find((player) => player.userId === userId) || null;
      const opponent = data.players.find((player) => player.userId !== userId) || null;

      console.log('Current player:', current);
      console.log('Opponent player:', opponent);

      setCurrentPlayer(current);
      setOpponentPlayer(opponent);
      setGameStatus(data.status);
      setCurrentTurn(data.currentTurn);

      // Gérer le forfait
      if (data.leavingUserId) {
        setIsForfeit(true);
      }

      // Mettre à jour les messages
      if (data.messages) {
        setMessages(data.messages);
      }
    });

    return () => {
      socket?.off('game-data');
    };
  }, [gameId, user, socket, currentUserId]);

  console.log('currentPlayer', currentPlayer);
  console.log('opponentPlayer', opponentPlayer);


  if (!currentPlayer || !opponentPlayer) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="w-10 h-10 animate-spin" /></div>;
  }

  return (
    <>
      <GameResultModal
        open={gameStatus === "ENDED"}
        gameId={gameId}
        isForfeit={isForfeit}
      />
      <LeaveGameModal
        open={showLeaveModal}
        gameStatus={gameStatus}
        gameId={gameId}
        onClose={() => setShowLeaveModal(false)}
      />
      <div className="flex flex-col gap-4 relative">
        {/* Bouton quitter la partie */}
        <div className="absolute top-0 right-0">
          <button
            onClick={() => setShowLeaveModal(true)}
            className="px-4 py-2 bg-destructive text-white rounded-md hover:bg-destructive/90"
          >
            Quitter la partie
          </button>
        </div>

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
          {/* Chat de partie */}
          {socket && (
            <div className="hidden lg:flex w-80 h-full shrink-0">
              <GameChat
                messages={messages}
                currentUserId={currentUserId || user?.id || ''}
                socket={socket}
                gameId={gameId}
              />
            </div>
          )}
        </div>
      </div>
    </>
  )
}
