import { getLeaderboard } from "@/app/actions/leaderboard";
import { Trophy } from "lucide-react";
import { LeaderboardWidget as LeaderboardWidgetComponent } from "../widgets/leaderboard";
import Widget from "./Widget";

export default async function LeaderboardWidget({ className }: { className?: string }) {
  let users = [];

  try {
    const leaderboardData = await getLeaderboard(1, 5);
    if (leaderboardData) {
      users = leaderboardData.users || [];
    }
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
  }

  return (
    <Widget title="Leaderboard" description="Top 5 des joueurs" icon={<Trophy className="w-5 h-5" />} className={className}>
      <LeaderboardWidgetComponent users={users} />
    </Widget>
  )
}
