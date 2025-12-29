import { redirect } from "next/navigation";
import Sidebar from "../../../components/Sidebar";
import MobileSidebar from "../../../components/MobileSidebar";
import { verifySession } from "../../../lib/dal";

export default async function layout({ children }: { children: React.ReactNode }) {
  const session = await verifySession();

  if (!session.isAuth) {
    redirect('/signin');
  }

  return (
    <div className="flex w-full h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <Sidebar />
      <div className="flex-1 flex flex-col h-full overflow-hidden">
        <div className="lg:hidden p-4 border-b border-border bg-background">
          <MobileSidebar />
        </div>
        <main className="flex-1 p-4 sm:p-6 md:p-8 overflow-auto">{children}</main>
      </div>
    </div>
  )
}
