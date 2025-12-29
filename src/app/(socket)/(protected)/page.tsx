import CreateGameButtons from "../../../components/home/CreateGameButtons";
import HistoryWidget from "../../../components/home/HistoryWidget";
import LeaderboardWidget from "../../../components/home/LeaderboardWidget";
import UserGreeting from "../../../components/home/UserGreeting";

export default async function Page() {

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col gap-4 sm:gap-6">
      <UserGreeting />
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        <CreateGameButtons />
        <LeaderboardWidget />
        <HistoryWidget className="lg:col-span-2" />
      </div>
    </div>
  )
}

