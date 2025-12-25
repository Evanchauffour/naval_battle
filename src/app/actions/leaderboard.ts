"use server"

import { cookies } from "next/headers";

export interface LeaderboardUser {
  id: string;
  name: string;
  email: string;
  elo: number;
  index: number;
  gamesPlayed: number;
  wins: number;
  losses: number;
  streak: number;
  highestStreak: number;
}

export interface LeaderboardResponse {
  users: LeaderboardUser[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export async function getLeaderboard(
  page: number = 1,
  limit: number = 10,
): Promise<LeaderboardResponse | null> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("accessToken")?.value;

  if (!accessToken) {
    return null;
  }

  try {
    const res = await fetch(
      `${process.env.NEXT_PUBLIC_API_URL}/user-stats/leaderboard?page=${page}&limit=${limit}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    if (!res.ok) {
      console.error("Failed to fetch leaderboard");
      return null;
    }

    const data = await res.json();
    return data;
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    return null;
  }
}
