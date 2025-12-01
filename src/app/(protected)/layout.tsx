import { redirect } from "next/navigation";
import { verifySession } from "../../lib/dal";
import { SocketProvider } from "../../hook/useSocket";

export default async function layout({ children }: { children: React.ReactNode }) {

  const session = await verifySession();

  if (!session.isAuth) {
    redirect('/signin');
  }

  return (
    <SocketProvider>
      <main className="w-full h-screen">{children}</main>
    </SocketProvider>
  )
}
