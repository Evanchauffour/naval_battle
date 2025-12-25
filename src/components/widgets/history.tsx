"use client";

import { Game } from "@/app/(socket)/(protected)/history/page";
import GameListItem from "@/components/history/GameListItem";
import { Card, CardContent } from "@/components/ui/card";
import { History as HistoryIcon } from "lucide-react";

export function History({ games }: { games: Game[] }) {

  return (
    <Card className="p-0">
      <CardContent className="overflow-y-auto hide-scrollbar flex-1 min-h-0 p-0 bg-transparent">
      {games.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <HistoryIcon className="w-16 h-16 text-gray-400 mb-4" />
            <p className="text-gray-700 text-base">
              Aucune partie jouée pour le moment
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Trouvez une partie pour commencer votre historique
            </p>
          </div>
        ) : (
          <ul className="space-y-4">
            {games.map((game) => (
              <li key={game.id}>
                <GameListItem game={game} />
              </li>
            ))}
          </ul>
        )}
      </CardContent>
    </Card>
  );
}

