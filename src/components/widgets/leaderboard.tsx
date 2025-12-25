"use client";

import { LeaderboardUser } from "@/app/actions/leaderboard";
import { cn } from "@/lib/utils";
import { Trophy } from "lucide-react";

export function LeaderboardWidget({ users }: { users: LeaderboardUser[] }) {
  return (
    <div className="overflow-y-auto hide-scrollbar flex-1 min-h-0">
      {users.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Trophy className="w-16 h-16 text-gray-400 mb-4" />
          <p className="text-gray-700 text-base">
            Aucun joueur dans le leaderboard
          </p>
        </div>
      ) : (
        <ul className="space-y-2">
          {users.map((player) => (
            <li key={player.id}>
              <div
                className={cn(
                  "flex items-center justify-between p-2 rounded-md border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center font-bold text-xs sm:text-sm shrink-0",
                      player.index === 1
                        ? "bg-yellow-400 text-gray-900"
                        : player.index === 2
                        ? "bg-gray-300 text-gray-900"
                        : player.index === 3
                        ? "bg-orange-300 text-gray-900"
                        : "bg-gray-200 text-gray-700"
                    )}
                  >
                    {player.index}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="font-semibold text-sm truncate text-gray-900">
                      {player.name}
                    </div>
                    <div className="font-semibold text-[#e5383b] text-xs">
                      {player.elo} elo
                    </div>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
