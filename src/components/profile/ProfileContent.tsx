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
      <div className="space-y-4 sm:space-y-6">
        <Card className="bg-white border border-gray-200 shadow-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-3xl text-gray-900">
              <BarChart3 className="w-6 h-6" />
              Statistiques
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
              <div className="rounded-lg p-3 sm:p-4 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{userStats.elo}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Target className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  ELO Actuel
                </div>
              </div>
              <div className="rounded-lg p-3 sm:p-4 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{winRate}%</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                  Taux de victoire
                </div>
              </div>
              <div className="rounded-lg p-3 sm:p-4 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{userStats.gamesPlayed}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-yellow-500" />
                  Parties jouées
                </div>
              </div>
              <div className="rounded-lg p-3 sm:p-4 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{userStats.highestElo}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                  <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-purple-500" />
                  Meilleur ELO
                </div>
              </div>
              <div className="rounded-lg p-3 sm:p-4 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{userStats.streak}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-orange-500" />
                  Série actuelle
                </div>
              </div>
              <div className="rounded-lg p-3 sm:p-4 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                <div className="text-2xl sm:text-3xl font-bold text-gray-900 mb-1 sm:mb-2">{userStats.highestStreak ?? 0}</div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-red-500" />
                  Meilleure série
                </div>
              </div>
              <div className="rounded-lg p-3 sm:p-4 text-center bg-gray-50 border border-gray-200 hover:bg-gray-100 transition-all duration-300">
                <div className="text-xl sm:text-2xl font-bold mb-1 sm:mb-2">
                  <span className="text-gray-900">{userStats.wins}</span>
                  <span className="text-gray-500 mx-1 sm:mx-2">/</span>
                  <span className="text-gray-900">{userStats.losses}</span>
                </div>
                <div className="text-xs sm:text-sm text-gray-600 flex items-center justify-center gap-1">
                  <Shield className="w-3 h-3 sm:w-4 sm:h-4 text-blue-500" />
                  Victoires / Défaites
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
