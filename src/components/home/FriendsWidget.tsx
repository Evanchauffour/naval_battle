import { Users } from "lucide-react";
import Widget from "./Widget";

export default function FriendsWidget({ className }: { className?: string }) {
  return (
    <Widget title="Friends" description="Invite a friend to play" icon={<Users className="w-5 h-5" />} className={className}>
      <ul className="flex flex-col gap-2">
        <li className="border border-card-muted rounded-md p-2 flex justify-between items-center">
          <span>Player 1</span>
          <span>100</span>
        </li>
        <li className="border border-card-muted rounded-md p-2 flex justify-between items-center">
          <span>Player 2</span>
          <span>90</span>
        </li>
        <li className="border border-card-muted rounded-md p-2 flex justify-between items-center">
          <span>Player 3</span>
          <span>80</span>
        </li>
      </ul>
    </Widget>
  )
}
