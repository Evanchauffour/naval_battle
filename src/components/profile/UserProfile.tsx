import { Flame, TrendingUp, Trophy } from 'lucide-react';
import { User } from '../../app/actions/user';
import { UserStats } from '../../app/actions/user-stats';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import ProfileContent from './ProfileContent';

interface UserProfileProps {
  user: User;
  userStats: UserStats;
}

export default function UserProfile({ user, userStats }: UserProfileProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      {/* Header Section */}
      <Card className="bg-white/20 border-white/10 mb-6 sm:mb-8">
        <CardContent className="p-4 sm:p-6 md:p-8">
          <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full flex items-center justify-center bg-[#1A1A1A] border border-white/20 overflow-hidden">
              <span className="text-2xl sm:text-3xl font-bold text-white">
                {user?.name?.charAt(0).toUpperCase() || 'U'}
              </span>
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white flex items-center gap-2 sm:gap-3 flex-wrap">
                  <span className="truncate">{user?.name || 'Utilisateur'}</span>
                </h1>
              </div>
              <p className="text-white/70 text-sm sm:text-base md:text-lg truncate">
                {user?.email || "Consultez vos statistiques"}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap gap-2 sm:gap-4">
            <Badge variant="default" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base bg-[#e5383b] text-white border-none">
              <Trophy className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              ELO: {userStats.elo}
            </Badge>
            <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border-white/20 text-white hover:bg-white/10">
              <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Meilleur ELO: {(userStats as any).highestElo || userStats.elo}
            </Badge>
            <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border-white/20 text-white hover:bg-white/10">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Série: {userStats.streak}
            </Badge>
            <Badge variant="outline" className="px-3 sm:px-4 py-1.5 sm:py-2 text-sm sm:text-base border-white/20 text-white hover:bg-white/10">
              <Flame className="w-3 h-3 sm:w-4 sm:h-4 mr-1.5 sm:mr-2" />
              Meilleure série: {userStats.highestStreak ?? 0}
            </Badge>
          </div>
        </CardContent>
      </Card>

      {/* Stats Content */}
      <ProfileContent userStats={userStats} />
    </div>
  );
}
