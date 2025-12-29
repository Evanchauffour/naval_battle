'use client'

import { useUser } from "../../store/user.store";

export default function UserGreeting() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const displayName = user.username || user.name || user.firstName || 'Joueur';

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-3">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
            Bonjour, {displayName} !
          </h1>
          <p className="text-muted-foreground mt-1 text-sm sm:text-base">
            Prêt pour une nouvelle bataille navale ?
          </p>
        </div>
      </div>
    </div>
  )
}

