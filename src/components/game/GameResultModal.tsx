'use client';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Flame, Target, TrendingDown, TrendingUp, Trophy } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

interface GameResult {
  isWinner: boolean;
  eloChange: number;
  currentElo: number;
  streak: number;
  highestElo: number;
  isForfeit?: boolean;
}

interface GameResultModalProps {
  open: boolean;
  isForfeit?: boolean;
  gameId: string;
}

export default function GameResultModal({ open, gameId, isForfeit = false }: GameResultModalProps) {
  const [gameResult, setGameResult] = useState<GameResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const router = useRouter();

  const fetchGameResult = useCallback(async () => {
    try {
      setLoading(true);
      setError(false);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/game/${gameId}/result`, {
        method: 'GET',
        credentials: 'include'
      });

      console.log(response);

      if (!response.ok) {
        throw new Error('Failed to fetch game result');
      }

      const data = await response.json();
      setGameResult({ ...data, isForfeit });
    } catch (err) {
      console.error('Error fetching game result:', err);
      setError(true);
    } finally {
      setLoading(false);
    }
  }, [isForfeit, gameId]);

  useEffect(() => {
    if (open) {
      fetchGameResult();
    } else {
      setGameResult(null);
      setLoading(true);
      setError(false);
    }
  }, [open, fetchGameResult]);

  if (!open) return null;

  const handleQuit = () => {
    router.push('/');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-[95vw] sm:max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto" showCloseButton={false}>
        <div className="relative">
          <DialogHeader>
            <DialogTitle className="sr-only">Résultats de la partie</DialogTitle>
          </DialogHeader>

          {loading && (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4"></div>
              <p className="text-muted-foreground">Chargement des résultats...</p>
            </div>
          )}

          {error && (
            <div className="flex flex-col items-center justify-center py-12">
              <p className="text-destructive mb-4">Erreur lors du chargement des résultats</p>
              <button
                onClick={fetchGameResult}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90"
              >
                Réessayer
              </button>
            </div>
          )}

          {gameResult && (
            <div className="space-y-6">
              {/* Header */}
              <div className="space-y-4">
                <div className="flex justify-center mb-4">
                  <div className={`rounded-full p-4 ${gameResult.isWinner ? 'bg-green-500/20' : 'bg-red-500/20'}`}>
                    <Trophy className={`w-12 h-12 ${gameResult.isWinner ? 'text-green-500' : 'text-red-500'}`} />
                  </div>
                </div>
                <div>
                  <h2 className="text-center text-xl sm:text-2xl md:text-3xl font-semibold">
                    {gameResult.isForfeit
                      ? (gameResult.isWinner ? '🎉 Victoire par forfait' : '😔 Défaite par forfait')
                      : (gameResult.isWinner ? '🎉 Victoire !' : '😔 Défaite')
                    }
                  </h2>
                </div>
              </div>

              {/* Score Card */}
              <div
                className={`rounded-lg p-6 border-2 ${
                  gameResult.isWinner
                    ? 'bg-green-500/10 border-green-500/30'
                    : 'bg-red-500/10 border-red-500/30'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-base sm:text-lg">
                    Votre Elo
                  </h3>
                  <div className={`text-2xl sm:text-3xl font-bold ${gameResult.isWinner ? 'text-green-500' : 'text-red-500'}`}>
                    {gameResult.currentElo}
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 gap-4">
                {/* Elo Change */}
                <div className="bg-background/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    {gameResult.eloChange > 0 ? (
                      <TrendingUp className="w-5 h-5 text-green-500" />
                    ) : (
                      <TrendingDown className="w-5 h-5 text-red-500" />
                    )}
                    <h4 className="font-semibold">Changement ELO</h4>
                  </div>
                  <p className={`text-xl sm:text-2xl font-bold ${gameResult.eloChange > 0 ? 'text-green-500' : 'text-red-500'}`}>
                    {gameResult.eloChange > 0 ? '+' : ''}{gameResult.eloChange}
                  </p>
                </div>

                {/* Streak */}
                <div className="bg-background/50 rounded-lg p-4 border border-border">
                  <div className="flex items-center gap-2 mb-2">
                    <Flame className="w-5 h-5 text-orange-500" />
                    <h4 className="font-semibold">Série</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-orange-500">
                    {gameResult.streak}
                  </p>
                </div>
              </div>

              {/* Highest Elo */}
              {gameResult.currentElo >= gameResult.highestElo && (
                <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Target className="w-5 h-5 text-yellow-500" />
                    <h4 className="font-semibold text-yellow-500">Record Personnel !</h4>
                  </div>
                  <p className="text-xl sm:text-2xl font-bold text-yellow-500">
                    {gameResult.highestElo}
                  </p>
                </div>
              )}

              {/* Quit Button */}
              <div className="flex justify-center pt-4">
                <button
                  onClick={handleQuit}
                  className="px-4 sm:px-8 py-3 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 font-semibold transition-all cursor-pointer text-sm sm:text-base w-full sm:w-auto"
                >
                  Retour à la recherche
                </button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

