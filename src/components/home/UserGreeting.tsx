'use client'

import { useUser } from "../../store/user.store";

export default function UserGreeting() {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold">Bonjour, {user.name} !</h1>
    </div>
  )
}

