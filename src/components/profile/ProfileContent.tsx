'use client'

import { useState, useEffect } from 'react'
import { BarChart3, Flame, Gamepad2, Shield, Target, TrendingUp, Trophy, Settings, User, Mail } from 'lucide-react';
import { UserStats } from '../../app/actions/user-stats';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import UpdateProfileModal from './UpdateProfileModal';
import { useUser } from '../../store/user.store';

interface ProfileContentProps {
  userStats: UserStats;
  isOwnProfile?: boolean;
  profileUser?: {
    username?: string;
    firstName?: string;
    lastName?: string;
    email?: string;
  };
}

export default function ProfileContent({ userStats, isOwnProfile = false, profileUser }: ProfileContentProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false)
  const { user } = useUser()
  const [currentUsername, setCurrentUsername] = useState<string>('')

  useEffect(() => {
    if (user?.username || user?.name) {
      setCurrentUsername(user.username || user.name || '')
    }
  }, [user])
  const winRate = userStats.gamesPlayed > 0
    ? ((userStats.wins / userStats.gamesPlayed) * 100).toFixed(1)
    : "0.0";

  return (
    <>
      <UpdateProfileModal
        open={isUpdateModalOpen}
        onOpenChange={setIsUpdateModalOpen}
        currentUsername={currentUsername}
      />
      <div className="grid grid-cols-1 gap-4 sm:gap-6">
        {isOwnProfile && user && (
          <Card className="shadow-lg">
            <CardHeader className="pb-3 sm:pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2 sm:gap-3 text-xl sm:text-2xl">
                  <User className="w-5 h-5 sm:w-6 sm:h-6 text-primary shrink-0" />
                  Informations personnelles
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsUpdateModalOpen(true)}
                  className="flex items-center gap-2"
                >
                  <Settings className="w-4 h-4" />
                  Modifier le profil
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-muted-foreground">Pseudo</label>
                  <div className="text-base font-semibold">{user.username || user.name || 'N/A'}</div>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-medium text-muted-foreground">Email</label>
                  <div className="text-base font-semibold flex items-center gap-2">
                    <Mail className="w-4 h-4 text-muted-foreground" />
                    {user.email || 'N/A'}
                  </div>
                </div>
                {profileUser?.firstName && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-muted-foreground">Prénom</label>
                    <div className="text-base font-semibold">{profileUser.firstName}</div>
                  </div>
                )}
                {profileUser?.lastName && (
                  <div className="flex flex-col gap-1">
                    <label className="text-sm font-medium text-muted-foreground">Nom</label>
                    <div className="text-base font-semibold">{profileUser.lastName}</div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}
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
                <Trophy className="w-3 h-3 sm:w-4 sm:h-4 text-foreground shrink-0" />
                <span className="text-center">Taux de victoire</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.gamesPlayed}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Gamepad2 className="w-3 h-3 sm:w-4 sm:h-4 text-foreground shrink-0" />
                <span className="text-center">Parties jouées</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.highestElo}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <TrendingUp className="w-3 h-3 sm:w-4 sm:h-4 text-foreground shrink-0" />
                <span className="text-center">Meilleur ELO</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.streak}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-foreground shrink-0" />
                <span className="text-center">Série actuelle</span>
              </div>
            </div>
            <div className="rounded-xl p-3 sm:p-4 text-center bg-muted/50 border hover:bg-muted transition-all duration-300 hover:shadow-md">
              <div className="text-2xl sm:text-3xl font-bold mb-1 sm:mb-2">{userStats.highestStreak ?? 0}</div>
              <div className="text-xs sm:text-sm text-muted-foreground flex items-center justify-center gap-1 sm:gap-2">
                <Flame className="w-3 h-3 sm:w-4 sm:h-4 text-foreground shrink-0" />
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
    </>
  );
}
