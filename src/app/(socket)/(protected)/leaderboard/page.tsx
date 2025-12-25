import { Trophy } from "lucide-react";
import { getLeaderboard } from "../../../../app/actions/leaderboard";
import { Leaderboard } from "../../../../components/leaderboard/Leaderboard";
import { Card, CardContent, CardHeader, CardTitle } from "../../../../components/ui/card";
import Pagination from "../../../../components/ui/Pagination";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = parseInt(params.page || "1", 10);
  const limit = 10;

  const leaderboardData = await getLeaderboard(currentPage, limit);

  if (!leaderboardData) {
    return (
      <div className="w-full max-w-6xl mx-auto py-10">
        <div className="text-gray-900 text-center">
          <p>Erreur lors du chargement du leaderboard...</p>
        </div>
      </div>
    );
  }

  const indexOfFirstUser = (currentPage - 1) * limit;
  const indexOfLastUser = indexOfFirstUser + leaderboardData.users.length;

  return (
    <div className="w-full max-w-6xl mx-auto py-10">
      <Card className="bg-white border border-gray-200 shadow-sm mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-gray-900 text-3xl">
            <Trophy className="w-6 h-6" />
            Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Leaderboard users={leaderboardData.users} />
        </CardContent>
      </Card>

      {leaderboardData.meta.totalPages > 1 && (
        <div className="mt-6">
          <Pagination
            indexOfFirstUser={indexOfFirstUser}
            indexOfLastUser={indexOfLastUser}
            totalItems={leaderboardData.meta.total}
            totalPages={leaderboardData.meta.totalPages}
          />
        </div>
      )}
    </div>
  );
}
