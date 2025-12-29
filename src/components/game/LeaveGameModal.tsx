'use client';

import { AlertCircle } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { useSocket } from '../../hook/useSocket';

interface LeaveGameModalProps {
  open: boolean;
  gameStatus: string;
  gameId: string;
  onClose: () => void;
}

export function LeaveGameModal({
  open,
  gameStatus,
  gameId,
  onClose,
}: LeaveGameModalProps) {
  const { socket } = useSocket();

  const handleConfirm = () => {
    if (!socket) return;
    socket.emit('leave-game', {
      gameId: gameId,
    });
    onClose();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        if (!isOpen) {
          onClose();
        }
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-destructive" />
            Quitter la partie
          </DialogTitle>
          <DialogDescription asChild>
            <div>
              {gameStatus === 'ORGANIZING_BOATS' ? (
                <>
                  <div className="mb-2">
                    Voulez-vous vraiment quitter la partie ?
                  </div>
                  <div className="text-sm bg-green-500/10 border border-green-500/30 rounded p-2 text-green-500">
                    Aucun Elo ne sera perdu car la partie n&apos;a pas encore
                    commencé.
                  </div>
                </>
              ) : (
                <>
                  <div className="mb-2">
                    Voulez-vous vraiment quitter la partie ?
                  </div>
                  <div className="text-sm bg-destructive/10 border border-destructive/30 rounded p-2 text-destructive">
                    La partie est en cours, vous perdrez de l&apos;Elo par
                    forfait.
                  </div>
                </>
              )}
            </div>
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Annuler
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            className="hover:bg-destructive hover:text-white"
          >
            Quitter la partie
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

