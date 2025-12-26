'use client';

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { useRouter } from 'next/navigation';

interface RoomCanceledModalProps {
  open: boolean;
  leavingPlayerName?: string;
}

export function RoomCanceledModal({
  open,
  leavingPlayerName,
}: RoomCanceledModalProps) {
  const router = useRouter();

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-center w-full justify-center">
            <AlertCircle className="w-6 h-6 text-amber-500" />
            Partie annulée
          </DialogTitle>
        </DialogHeader>
        <div className="py-4 space-y-4">
          <p className="text-center text-muted-foreground">
            {leavingPlayerName
              ? `${leavingPlayerName} a quitté la partie.`
              : 'La partie a été annulée par votre adversaire.'}
          </p>
          <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-4">
            <p className="text-sm text-center font-medium text-amber-500">
              Aucun Elo ne sera perdu.
            </p>
          </div>
        </div>
        <DialogFooter>
          <Button
            className="w-full"
            onClick={() => {
              router.push('/');
            }}
          >
            Retour à la recherche
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

