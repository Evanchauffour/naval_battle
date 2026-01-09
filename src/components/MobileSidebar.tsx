'use client'

import { cn } from "@/lib/utils";
import { History, HomeIcon, List, LogOut, Menu, User } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { redirect, usePathname } from "next/navigation";
import { useState } from "react";
import { useUser } from "../store/user.store";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { Separator } from "./ui/separator";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "./ui/sheet";

export default function MobileSidebar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { user } = useUser();

  const handleLogout = async () => {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
      method: 'POST',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
      },
    })
    if (response.ok) {
      setOpen(false);
      redirect('/signin');
    } else {
      console.error('Failed to logout');
    }
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

  const SidebarContent = () => (
    <>
      <SheetHeader className="border-b border-sidebar-border pb-4">
        <div className="flex items-center justify-center">
          <Image src="/logo.png" alt="logo" width={60} height={60} />
        </div>
        <SheetTitle className="sr-only">Navigation</SheetTitle>
      </SheetHeader>
      <nav className="flex-1 px-3 py-4">
        <ul className="flex flex-col gap-1">
          <SidebarItem
            href="/"
            icon={<HomeIcon className="w-5 h-5" />}
            label="Accueil"
            isActive={pathname === '/'}
            onClick={() => setOpen(false)}
          />
          <SidebarItem
            href="/leaderboard"
            icon={<List className="w-5 h-5" />}
            label="Classement"
            isActive={pathname === '/leaderboard'}
            onClick={() => setOpen(false)}
          />
          <SidebarItem
            href="/history"
            icon={<History className="w-5 h-5" />}
            label="Historique"
            isActive={pathname === '/history'}
            onClick={() => setOpen(false)}
          />
          <SidebarItem
            href="/profile"
            icon={<User className="w-5 h-5" />}
            label="Profil"
            isActive={pathname === '/profile'}
            onClick={() => setOpen(false)}
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
    </>
  );

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-[280px] p-0 bg-sidebar border-sidebar-border flex flex-col">
        <SidebarContent />
      </SheetContent>
    </Sheet>
  );
}

const SidebarItem = ({
  href,
  icon,
  label,
  isActive,
  onClick
}: {
  href: string
  icon: React.ReactNode
  label: string
  isActive?: boolean
  onClick?: () => void
}) => {
  return (
    <li>
      <Link
        href={href}
        onClick={onClick}
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

