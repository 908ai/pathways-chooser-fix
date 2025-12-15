"use client"

import { Link, NavLink, useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/ThemeToggle"
import { useAuth } from "@/hooks/useAuth"
import { supabase } from "@/integrations/supabase/client"
import { useUserRole } from "@/hooks/useUserRole"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LifeBuoy, LogOut, User, HardHat, Shield, LayoutDashboard, Mail, MessageSquare, Users } from "lucide-react"
import { useUnreadFeedback } from "@/hooks/useUnreadFeedback"
import { useUnreadAdminFeedback } from "@/hooks/useUnreadAdminFeedback"
import { useUnreadProjectEvents } from "@/hooks/useUnreadProjectEvents"
import { useUnreadAdminProjectEvents } from "@/hooks/useUnreadAdminProjectEvents"
import { Badge } from "@/components/ui/badge"

export function Header() {
  const { user, session } = useAuth()
  const { isAdmin, isBuilder, isBuildingOfficial, isEnergyAdvisor } = useUserRole()
  const navigate = useNavigate()
  const { unreadCount: unreadFeedbackCount } = useUnreadFeedback()
  const { unreadCount: unreadAdminFeedbackCount } = useUnreadAdminFeedback()
  const { unreadCount: unreadProjectEventsCount } = useUnreadProjectEvents()
  const { unreadCount: unreadAdminProjectEventsCount } = useUnreadAdminProjectEvents()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate("/")
  }

  const getInitials = (email: string | undefined) => {
    if (!email) return "U"
    return email.substring(0, 2).toUpperCase()
  }

  const totalAdminUnread = unreadAdminFeedbackCount + unreadAdminProjectEventsCount
  const totalUserUnread = unreadFeedbackCount + unreadProjectEventsCount

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2">
            <img src="/sol-invictus-logo.svg" alt="Sol Invictus" className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Energy Navigator</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            {session && (
              <>
                <NavLink
                  to="/projects"
                  className={({ isActive }) =>
                    `flex items-center gap-2 transition-colors hover:text-foreground/80 ${
                      isActive ? "text-foreground" : "text-foreground/60"
                    }`
                  }
                >
                  Projects
                  {isAdmin && totalAdminUnread > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">{totalAdminUnread}</Badge>
                  )}
                  {!isAdmin && totalUserUnread > 0 && (
                    <Badge variant="destructive" className="h-5 w-5 flex items-center justify-center p-0">{totalUserUnread}</Badge>
                  )}
                </NavLink>
              </>
            )}
            {isAdmin && (
              <NavLink
                to="/admin"
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`
                }
              >
                Admin
              </NavLink>
            )}
             {(isBuilder || isEnergyAdvisor) && (
              <NavLink
                to="/find-a-provider"
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`
                }
              >
                Find a Provider
              </NavLink>
            )}
            {(isBuildingOfficial) && (
              <NavLink
                to="/municipal-dashboard"
                className={({ isActive }) =>
                  `transition-colors hover:text-foreground/80 ${
                    isActive ? "text-foreground" : "text-foreground/60"
                  }`
                }
              >
                Municipal Dashboard
              </NavLink>
            )}
          </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <nav className="flex items-center">
            {session ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={undefined} alt={user?.email} />
                      <AvatarFallback>{getInitials(user?.email)}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-medium leading-none">My Account</p>
                      <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => navigate("/account")}>
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </DropdownMenuItem>
                  {isBuilder && (
                    <DropdownMenuItem onClick={() => navigate("/my-feedback")}>
                      <MessageSquare className="mr-2 h-4 w-4" />
                      <span>My Feedback</span>
                      {unreadFeedbackCount > 0 && <Badge variant="destructive" className="ml-auto">{unreadFeedbackCount}</Badge>}
                    </DropdownMenuItem>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuLabel>Support</DropdownMenuLabel>
                  <DropdownMenuItem onClick={() => navigate("/resources")}>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>Resources</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/faq")}>
                    <LifeBuoy className="mr-2 h-4 w-4" />
                    <span>FAQ</span>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate("/building-officials")}>
                    <HardHat className="mr-2 h-4 w-4" />
                    <span>Building Officials</span>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={() => navigate("/login")}>Login</Button>
            )}
            <ThemeToggle />
          </nav>
        </div>
      </div>
    </header>
  )
}