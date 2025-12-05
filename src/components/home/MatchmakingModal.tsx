'use client';

import { Loader2 } from "lucide-react";
import { useSocket } from "../../hook/useSocket";
import { Button } from "../ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "../ui/dialog";

interface MatchmakingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function MatchmakingModal({ open, onOpenChange }: MatchmakingModalProps) {
  const { socket } = useSocket();

  const handleCancel = () => {
    socket?.emit('cancel-matchmaking');
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md" showCloseButton={false}>
        <DialogHeader>
          <DialogTitle className="text-center">Recherche de partie</DialogTitle>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-6 py-8">
          <div className="relative flex items-center justify-center">
            <Loader2 className="h-16 w-16 animate-spin text-primary" />
            <div className="absolute h-full w-full animate-pulse rounded-full bg-primary/20 blur-xl" />
          </div>
          <p className="text-center text-muted-foreground animate-pulse">
            Recherche d&apos;un adversaire digne de ce nom...
          </p>
          <Button
            variant="destructive"
            onClick={handleCancel}
            className="w-full sm:w-auto min-w-[150px]"
          >
            Annuler
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

