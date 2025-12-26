import { BarChart3, Flame, Gamepad2, Shield, Target, TrendingUp, Trophy } from 'lucide-react';
import { UserStats } from '../../app/actions/user-stats';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';

interface ProfileContentProps {
  userStats: UserStats;
}

export default function ProfileContent({ userStats }: ProfileContentProps) {
  const winRate = userStats.gamesPlayed > 0
    ? ((userStats.wins / userStats.gamesPlayed) * 100).toFixed(1)
    : "0.0";

  return (
    <div className="grid grid-cols-1 gap-4 sm:gap-6">
      <Card className="shadow-lg">
        <CardHeader className="pb-3 sm:pb-4">
          <CardTitle className="flex items-center gap-2 sm:gap-3 text-2xl sm:text-3xl">
            <BarChart3 className="w-5 h-5 sm:w-7 sm:h-7 text-primary shrink-0" />
            Statistiques
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.elo}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Target className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span className="text-center">ELO Actuel</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{winRate}%</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-green-600 shrink-0" />
                <span className="text-center">Taux de victoire</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.gamesPlayed}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-600 shrink-0" />
                <span className="text-center">Parties jouées</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.highestElo}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-600 shrink-0" />
                <span className="text-center">Meilleur ELO</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.streak}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-600 shrink-0" />
                <span className="text-center">Série actuelle</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.highestStreak ?? 0}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-red-600 shrink-0" />
                <span className="text-center">Meilleure série</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md md:col-span-3">
              <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                <span>{userStats.wins}</span>
                <span className="text-muted-foreground mx-1 sm:mx-2">/</span>
                <span>{userStats.losses}</span>
              </div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-primary shrink-0" />
                <span className="text-center">Victoires / Défaites</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
