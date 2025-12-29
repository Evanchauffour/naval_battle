'use client'

import { cn } from "@/lib/utils";
import { History, HomeIcon, List, LogOut, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { logout } from "../app/actions/auth";
import { useUser } from "../store/user.store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";

export default function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();

  const handleLogout = async () => {
    await logout();
  }

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    }
    if (user?.username) {
      return user.username.slice(0, 2).toUpperCase();
    }
    if (user?.name) {
      return user.name.slice(0, 2).toUpperCase();
    }
    return "U";
  };

  const getUserName = () => {
    return user?.username || user?.name || user?.firstName || "Utilisateur";
  };

  return (
    <aside className="hidden lg:flex w-64 bg-sidebar border-r border-sidebar-border h-full flex-col shadow-sm">
      <div className="p-6 border-b border-sidebar-border">
        <Image src="/logo.png" alt="logo" width={80} height={80} className="mx-auto"/>
      </div>
      <nav className="flex-1 px-3 py-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          <SidebarItem
            href="/"
            icon={<HomeIcon className="w-5 h-5" />}
            label="Accueil"
            isActive={pathname === '/'}
          />
          <SidebarItem
            href="/leaderboard"
            icon={<List className="w-5 h-5" />}
            label="Classement"
            isActive={pathname === '/leaderboard'}
          />
          <SidebarItem
            href="/history"
            icon={<History className="w-5 h-5" />}
            label="Historique"
            isActive={pathname === '/history'}
          />
          <SidebarItem
            href="/profile"
            icon={<User className="w-5 h-5" />}
            label="Profil"
            isActive={pathname === '/profile'}
          />
        </ul>
      </nav>
      <div className="p-4 border-t border-sidebar-border space-y-3">
        {user && (
          <div className="flex items-center gap-3 px-3 py-2 rounded-lg">
            <Avatar className="h-8 w-8">
              {user.avatar && (
                <AvatarImage src={user.avatar} alt={getUserName()} />
              )}
              <AvatarFallback className="bg-primary/10 text-primary text-xs font-medium">
                {getUserInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                {getUserName()}
              </p>
              {user.email && (
                <p className="text-xs text-sidebar-foreground/60 truncate">
                  {user.email}
                </p>
              )}
            </div>
          </div>
        )}
        <Separator />
        <Button
          onClick={handleLogout}
          variant="ghost"
          className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Déconnexion
        </Button>
      </div>
    </aside>
  )
}

const SidebarItem = ({
  href,
  icon,
  label,
  isActive
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
}) => {
  return (
    <li>
      <Link
        href={href}
        className={cn(
          "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
          isActive
            ? "bg-sidebar-accent text-sidebar-accent-foreground shadow-sm"
            : "text-sidebar-foreground/70 hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground"
        )}
      >
        <span className={cn(isActive ? "text-sidebar-accent-foreground" : "")}>
          {icon}
        </span>
        <span>{label}</span>
      </Link>
    </li>
  )
}
