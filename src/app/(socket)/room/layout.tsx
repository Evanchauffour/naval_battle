export default async function layout({ children }: { children: React.ReactNode }) {

  return (
    <main className="w-full h-screen">{children}</main>
  )
}

