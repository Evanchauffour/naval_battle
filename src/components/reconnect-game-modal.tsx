'use client';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function ReconnectGameModal() {
  const [gameId, setGameId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const checkInProgressGame = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/game/get-inprogress-game`,
        {
          method: 'GET',
          credentials: 'include',
        },
      );

      if (!response.ok) {
        setGameId(null);
        setIsOpen(false);
        return;
      }

      const data = await response.json();

      // Ne s'afficher que si la game existe et n'est pas terminée
      if (data.gameId === null || data.status === 'ENDED') {
        setGameId(null);
        setIsOpen(false);
        return;
      } else {
        setGameId(data.gameId);
        setIsOpen(true);
      }
    } catch (error) {
      console.error('Error checking in-progress game:', error);
      setGameId(null);
      setIsOpen(false);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkInProgressGame();
  }, []);

  const handleReconnect = () => {
    if (gameId) {
      setIsOpen(false); // Fermer la modale
      router.push(`/game/${gameId}`);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    setGameId(null);
  };

  if (loading || !gameId || !isOpen) {
    return null;
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleDismiss}>
      <DialogContent className="max-w-md mx-4">
        <DialogHeader className="space-y-2 sm:space-y-3">
          <DialogTitle className="flex items-center gap-2 sm:gap-3 text-center w-full justify-center text-xl sm:text-2xl">
            <div className="p-2 rounded-full bg-yellow-500/10 shrink-0">
              <AlertCircle className="w-5 h-5 sm:w-6 sm:h-6 text-yellow-600" />
            </div>
            Partie en cours
          </DialogTitle>
          <DialogDescription className="text-center text-sm sm:text-base">
            Une partie est en cours. Voulez-vous vous reconnecter ?
          </DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3 mt-4 sm:mt-6">
          <Button onClick={handleReconnect} className="w-full" size="lg">
            Me reconnecter à la partie
          </Button>
          <Button variant="outline" onClick={handleDismiss} className="w-full" size="lg">
            Ignorer
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

