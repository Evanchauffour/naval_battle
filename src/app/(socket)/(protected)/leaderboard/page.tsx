import { Trophy } from "lucide-react";
import { getLeaderboard } from "../../../../app/actions/leaderboard";
import { Leaderboard } from "../../../../components/leaderboard/Leaderboard";
import Pagination from "../../../../components/ui/Pagination";

export default async function LeaderboardPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Number.parseInt(params.page || "1", 10);
  const limit = 10;

  const leaderboardData = await getLeaderboard(currentPage, limit);

  if (!leaderboardData) {
    return (
      <div className="relative flex flex-col gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
        <div className="text-center">
          <p className="text-muted-foreground">Erreur lors du chargement du leaderboard...</p>
        </div>
      </div>
    );
  }

  const indexOfFirstUser = (currentPage - 1) * limit;
  const indexOfLastUser = indexOfFirstUser + leaderboardData.users.length;

  return (
    <div className="relative flex flex-col gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 sm:gap-3">
          <Trophy className="w-5 h-5 sm:w-6 sm:h-7 text-primary shrink-0" />
          Classement
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Consultez le classement des meilleurs joueurs
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto">
          <Leaderboard users={leaderboardData.users} />
        </div>
        {leaderboardData.meta.totalPages > 1 && (
          <div className="mt-2 sm:mt-4">
            <Pagination
              indexOfFirstUser={indexOfFirstUser}
              indexOfLastUser={indexOfLastUser}
              totalItems={leaderboardData.meta.total}
              totalPages={leaderboardData.meta.totalPages}
            />
          </div>
        )}
      </div>
    </div>
  );
}
