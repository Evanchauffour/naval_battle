import { redirect } from "next/navigation";
import { SocketProvider } from "../../hook/useSocket";
import { verifySession } from "../../lib/dal";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect('/signin');
  }

  return (
    <SocketProvider>
      {children}
    </SocketProvider>
  )
}
