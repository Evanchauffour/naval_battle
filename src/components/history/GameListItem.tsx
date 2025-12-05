'use client'

import { Game } from '@/app/(socket)/(protected)/history/page'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { Calendar, Gamepad2, Trophy } from 'lucide-react'

export default function GameListItem({ game }: { game: Game }) {

  const gameDate = new Date(game.createdAt).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  return (
    <Card key={game.id} className="bg-gray-100 border border-gray-200 hover:border-gray-300 transition-all duration-300">
      <CardContent className="p-3 sm:p-4 md:p-6">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gray-200 rounded-lg flex items-center justify-center shrink-0 border border-gray-300">
              <Gamepad2 className="w-5 h-5 sm:w-6 sm:h-6 text-gray-400" />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-1 sm:gap-2 mb-1">
                <Calendar className="w-3 h-3 sm:w-4 sm:h-4 text-gray-400 shrink-0" />
                <span className="text-xs sm:text-sm text-gray-400 truncate">{gameDate}</span>
              </div>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="flex items-center gap-1 sm:gap-2">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-red-500 shrink-0" />
                  <span className="text-lg sm:text-xl md:text-2xl font-bold text-gray-400 font-poppins">
                    {game.isWinner ? 'Victoire' : 'Défaite'}
                  </span>
                </div>
              </div>
            </div>
          </div>
          <div className='flex flex-col gap-2'>
            <div className="text-right shrink-0">
              <Badge
                variant={game.isWinner ? "default" : "destructive"}
                className={cn(
                  "text-xs sm:text-sm font-poppins px-3 py-1",
                  game.isWinner
                    ? "bg-green-500 text-white border-0 rounded-md"
                    : "bg-red-500 text-white border-0 rounded-md"
                )}
              >
                {game.isWinner ? "Victoire" : "Défaite"}
              </Badge>
            </div>
            {game.eloChange !== null && game.eloChange !== undefined && (
              <div className="text-right shrink-0">
                <span className={cn(
                  "text-xs sm:text-sm font-semibold font-poppins",
                  game.isWinner ? "text-green-500" : "text-red-500"
                )}>
                  {game.eloChange > 0 ? '+' : ''}{game.eloChange}
                </span>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

