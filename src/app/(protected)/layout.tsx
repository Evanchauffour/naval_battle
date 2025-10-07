import { redirect } from "next/navigation";
import { verifySession } from "../../lib/dal";

export default async function layout({ children }: { children: React.ReactNode }) {

  const session = await verifySession();

  if (!session.isAuth) {
    redirect('/signin');
  }

  return (
    <>
      <main className="w-full h-screen">{children}</main>
    </>
  )
}
