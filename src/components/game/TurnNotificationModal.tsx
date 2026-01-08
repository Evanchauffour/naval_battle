'use client'

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTitle,
} from "../ui/dialog";

interface TurnNotificationModalProps {
  isYourTurn: boolean;
  show: boolean;
}

export default function TurnNotificationModal({
  isYourTurn,
  show,
}: TurnNotificationModalProps) {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (show) {
      setOpen(true);
      // Fermer automatiquement après 2 secondes
      const timer = setTimeout(() => {
        setOpen(false);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [show]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md border-0 shadow-2xl">
        <DialogTitle className="sr-only">
          {isYourTurn ? 'Notification de tour : C\'est votre tour de jouer' : 'Notification de tour : Tour de l\'adversaire'}
        </DialogTitle>
        <div className="flex items-center justify-center py-8">
          <h2 className={`text-4xl font-bold ${
            isYourTurn ? 'text-green-600' : 'text-orange-600'
          }`}>
            {isYourTurn ? 'Ton tour' : 'Tour adverse'}
          </h2>
        </div>
      </DialogContent>
    </Dialog>
  );
}

