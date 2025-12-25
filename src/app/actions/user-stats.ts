"use server"

import { cookies } from "next/headers";

export interface UserStats {
  userId: string;
  elo: number;
  streak: number;
  highestStreak: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  createdAt: Date;
  updatedAt: Date;
  highestElo?: number;
  user?: {
    id: string;
    name: string;
    email: string;
  };
}

export async function getUserStats(): Promise<UserStats | null> {
  const cookieStore = await cookies()
  const accessToken = cookieStore.get('accessToken')?.value

  if (!accessToken) {
    return null
  }

  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user-stats`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    })

    if (!res.ok) {
      console.error('Failed to fetch user stats')
      return null
    }

    const data = await res.json()
    return data
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}
