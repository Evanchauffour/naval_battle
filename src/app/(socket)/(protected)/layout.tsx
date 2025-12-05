import { redirect } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import { verifySession } from "../../../lib/dal";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect('/signin');
  }

  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
