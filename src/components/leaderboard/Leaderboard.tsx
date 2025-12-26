"use client";

import { LeaderboardUser } from "@/app/actions/leaderboard";
import { cn } from "@/lib/utils";
import { UserIcon } from "lucide-react";
import Link from "next/link";

export function Leaderboard({ users }: { users: LeaderboardUser[] }) {
  return (
    <div className="">
      <div className="overflow-y-auto overflow-x-visible flex-1 min-h-0 p-0">
        <ul className="space-y-3">
          {users.map((player) => (
            <li key={player.id}>
              <div
                className={cn(
                  "flex items-center justify-between p-3 sm:p-4 rounded-lg border border-gray-200 hover:border-gray-300 transition-all duration-300 bg-gray-50"
                )}
              >
                <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
                  <div
                    className={cn(
                      "w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center font-bold text-base sm:text-lg",
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
                  <div className="flex flex-col items-start">
                    <div className="min-w-0 flex-1">
                      <div className="font-semibold text-base sm:text-lg truncate max-w-40 sm:max-w-64 md:max-w-96 text-gray-900">
                        {player.username || player.name}
                      </div>
                    </div>
                    <div className="font-semibold text-[#e5383b] text-base sm:text-lg shrink-0">
                      {player.elo} elo
                    </div>
                  </div>
                </div>
                <Link
                  href={`/profile/${player.username}`}
                  className="flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors duration-300 text-sm"
                >
                  <UserIcon className="w-4 h-4" />
                  Voir le profil
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
