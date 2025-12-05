import { Game } from "@/app/(socket)/(protected)/history/page";
import { History } from "@/components/widgets/history";
import { Gamepad2 } from "lucide-react";
import { cookies } from "next/headers";
import Widget from "./Widget";

export default async function HistoryWidget({ className }: { className?: string }) {
  const cookiesStore = await cookies();
  const accessToken = cookiesStore.get("accessToken")?.value;

  let games: Game[] = [];

  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/users/games-history?page=1&limit=10`, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      },
      cache: 'no-store'
    });

    if (response.ok) {
      const data = await response.json();
      games = data.games || [];
      console.log('games', games);
    }
  } catch (error) {
    console.error(error);
  }

  return (
    <Widget title="Historique" description="Historique de mes parties récentes" icon={<Gamepad2 className="w-5 h-5" />} className={className}>
      <History games={games} />
    </Widget>
  )
}

