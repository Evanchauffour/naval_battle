import CreateGameButtons from "../../../components/home/CreateGameButtons";
import FriendsWidget from "../../../components/home/FriendsWidget";
import HistoryWidget from "../../../components/home/HistoryWidget";
import LeaderboardWidget from "../../../components/home/LeaderboardWidget";
import UserGreeting from "../../../components/home/UserGreeting";

export default async function Page() {

  return (
    <div className="w-full flex flex-col gap-4">
      <UserGreeting />
      <div className="w-full h-full grid grid-cols-2 grid-rows-2 gap-4">
        <CreateGameButtons />
        <FriendsWidget className=""/>
        <LeaderboardWidget className="col-start-2 col-span-1"/>
        <HistoryWidget className="col-span-1 row-start-2 col-start-1"/>
      </div>
    </div>
  )
}

