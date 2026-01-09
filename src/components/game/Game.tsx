'use client'

import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
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

export default function Game({ gameId }: { readonly gameId: string }) {
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
  const [previousTurn, setPreviousTurn] = useState<string | null>(null);
  const [previousOpponentAttacks, setPreviousOpponentAttacks] = useState<number>(0);

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

  // Détecter les changements de tour et afficher un toast
  useEffect(() => {
    if (currentTurn && gameStatus === "IN_GAME" && previousTurn !== null && currentTurn !== previousTurn) {
      const userId = currentUserId || user?.id;
      if (currentTurn === userId) {
        toast.success("C'est votre tour !", {
          duration: 1000,
        });
      } else {
        toast.info("Tour de l'adversaire", {
          duration: 1000,
        });
      }
    }
    if (currentTurn) {
      setPreviousTurn(currentTurn);
    }
  }, [currentTurn, gameStatus, previousTurn, currentUserId, user?.id]);

  // Détecter quand l'adversaire nous attaque
  useEffect(() => {
    if (!opponentPlayer || gameStatus !== "IN_GAME") return;

    const currentAttacks = opponentPlayer.selectedCells?.length || 0;

    if (currentAttacks > previousOpponentAttacks && previousOpponentAttacks > 0) {
      // L'adversaire vient d'attaquer
      const lastAttack = opponentPlayer.selectedCells[currentAttacks - 1];

      // Vérifier si notre bateau a été touché
      const wasHit = currentPlayer?.ships.some(boat =>
        boat.coordinates.some(coord =>
          coord.left === lastAttack.left && coord.top === lastAttack.top
        )
      );

      if (wasHit) {
        // Vérifier si un bateau vient d'être coulé
        const hitBoat = currentPlayer?.ships.find(boat =>
          boat.coordinates.some(coord => coord.left === lastAttack.left && coord.top === lastAttack.top)
        );

        if (hitBoat) {
          const isBoatSunk = hitBoat.coordinates.every(coord =>
            opponentPlayer.selectedCells.some(sel => sel.left === coord.left && sel.top === coord.top)
          );

          if (isBoatSunk) {
            toast.error("💥 Votre bateau a été coulé !", {
              duration: 3000,
            });
          } else {
            toast.warning("🎯 Vous avez été touché !", {
              duration: 2500,
            });
          }
        }
      }
    }

    setPreviousOpponentAttacks(currentAttacks);
  }, [opponentPlayer, currentPlayer, gameStatus, previousOpponentAttacks]);


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
      <div className="flex h-full w-full relative">
        {gameStatus === "IN_GAME" ? (
          <>
            {/* Notre grille compacte en haut à gauche */}
            <div className="absolute top-4 left-4 z-10 group">
              <div className="transition-all duration-300 ease-in-out group-hover:scale-150 group-hover:z-50 group-hover:shadow-2xl origin-top-left">
                <CurrentPlayerGrid
                  boatsList={currentPlayer?.ships || []}
                  gameId={gameId}
                  playerId={currentPlayer?.userId || ''}
                  selectedCells={opponentPlayer.selectedCells || []}
                  gameStatus={gameStatus}
                  isCompact={true}
                />
              </div>
            </div>

            {/* Chat à droite qui prend toute la hauteur */}
            {socket && (
              <div className="absolute top-0 right-0 h-full w-80 z-10">
                <GameChat
                  messages={messages}
                  currentUserId={currentUserId || user?.id || ''}
                  socket={socket}
                  gameId={gameId}
                />
              </div>
            )}

            {/* Bouton quitter collé à gauche du chat */}
            <div className="absolute top-4 right-80 z-20 mr-4">
              <button
                onClick={() => setShowLeaveModal(true)}
                className="px-4 py-2 bg-destructive text-white rounded-lg hover:bg-destructive/90 transition-colors shadow-lg"
              >
                Quitter
              </button>
            </div>

            {/* Grille de l'adversaire au centre */}
            <div className="flex-1 flex items-center justify-center pr-80">
              <OpponentPlayerGrid
                boatsList={opponentPlayer?.ships || []}
                selectedCells={currentPlayer.selectedCells || []}
                gameId={gameId}
                currentPlayerId={currentPlayer?.userId || ''}
                isDisabled={currentTurn !== currentPlayer?.userId || gameStatus !== "IN_GAME"}
                isYourTurn={currentPlayer?.userId === currentTurn}
              />
            </div>
          </>
        ) : (
          <>
            {/* Header pour l'organisation */}
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
              <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-foreground">
                Organisez vos bateaux
              </h1>
            </div>
            {/* Grille complète pour l'organisation des bateaux */}
            <div className="flex-1 flex items-center justify-center">
              <CurrentPlayerGrid
                boatsList={currentPlayer?.ships || []}
                gameId={gameId}
                playerId={currentPlayer?.userId || ''}
                selectedCells={opponentPlayer.selectedCells || []}
                gameStatus={gameStatus}
                isCompact={false}
              />
            </div>
          </>
        )}
      </div>
    </>
  )
}
