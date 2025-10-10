import React from 'react'
import Sidebar from '../../../components/Sidebar'

export default async function layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex w-full h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-auto">{children}</main>
    </div>
  )
}
