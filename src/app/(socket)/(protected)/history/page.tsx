import Pagination from "@/components/ui/Pagination";
import { History } from "@/components/widgets/history";
import { cookies } from "next/headers";

export interface Game {
  id: string;
  createdAt: string;
  isWinner: boolean;
  eloChange: number | null;
  currentPlayerScore: number;
  opponentScore: number;
  status: string;
  opponent: {
    id: string;
    username: string;
  };
}

export default async function HistoryPage({ searchParams }: { searchParams: Promise<{ page?: string }> }) {
  const params = await searchParams
  const { page } = params
  const currentPage = Number(page) || 1;
  const limit = 40;
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  let games: Game[] = [];
  let metaData: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  } = {
    page: 1,
    limit,
    total: 0,
    totalPages: 0,
  };

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/games-history?page=${currentPage}&limit=${limit}`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      throw new Error("Failed to fetch games");
    }

    const data = await response.json();
    console.log(data);
    games = data.games;
    metaData = data.meta;
  } catch (error) {
    console.error(error);
  }

  return (
    <div className="relative flex flex-col gap-4 sm:gap-6 w-full max-w-6xl mx-auto">
      <div className="space-y-1 sm:space-y-2">
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold flex items-center gap-2 sm:gap-3">
          Historique des parties
        </h1>
        <p className="text-muted-foreground text-sm sm:text-base">
          Consultez vos performances récentes
        </p>
      </div>

      <div className="flex flex-col gap-4">
        <div className="overflow-x-auto">
          <History games={games}/>
        </div>
        {metaData.totalPages > 1 && (
          <div className="mt-2 sm:mt-4">
            <Pagination indexOfFirstUser={(currentPage - 1) * limit} indexOfLastUser={currentPage * limit} totalItems={metaData.total} totalPages={metaData.totalPages} />
          </div>
        )}
      </div>
    </div>
  );
}

