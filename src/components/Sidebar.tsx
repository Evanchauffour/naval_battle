'use client'

import { History, HomeIcon, List, LogOut, User, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { logout } from "../app/actions/auth";
import { Button } from "./ui/button";

export default function Sidebar() {
  const handleLogout = async () => {
    await logout();
  }

  return (
    <aside className="w-[200px] bg-sidebar border-r border-sidebar-border h-full flex flex-col">
      <Image src="/logo.png" alt="logo" width={80} height={80} className="mx-auto my-4"/>
      <nav className="flex-1">
        <ul className="flex flex-col justify-between h-full">
          <div>
            <SidebarItem href="/" icon={<HomeIcon className="w-5 h-5" />} label="Home" />
            <SidebarItem href="/" icon={<List className="w-5 h-5" />} label="Leaderboard" />
            <SidebarItem href="/" icon={<Users className="w-5 h-5" />} label="Friends" />
            <SidebarItem href="/" icon={<History className="w-5 h-5" />} label="History" />
            <SidebarItem href="/" icon={<User className="w-5 h-5" />} label="Profile" />
          </div>
          <div className="w-full p-4">
            <Button onClick={handleLogout} variant="outline" className="w-full"><LogOut className="w-5 h-5" /> Logout</Button>
          </div>
        </ul>
      </nav>
    </aside>
  )
}

const SidebarItem = ({ href, icon, label }: { href: string, icon: React.ReactNode, label: string }) => {
  return (
    <li>
      <Link href={href} className="flex items-center gap-2 px-4 py-4 rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
        {icon}
        <span className="text-base font-medium">{label}</span>
      </Link>
    </li>
  )
}
