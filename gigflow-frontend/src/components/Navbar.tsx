import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/use-auth";
import { useSocketNotifications } from "@/components/SocketProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Briefcase, User, LogOut, Plus, LayoutDashboard, Bell, CheckCircle, DollarSign } from "lucide-react";
import { formatDistanceToNow } from "date-fns";

export function Navbar() {
  const { user, logoutMutation } = useAuth();
  const { notifications, markAsRead, clearNotifications } = useSocketNotifications();
  const [location] = useLocation();

  const unreadCount = notifications.filter(n => !n.read).length;

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const isActive = (path: string) => location === path;

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/20 group-hover:scale-105 transition-transform duration-300">
            <Briefcase className="w-5 h-5" />
          </div>
          <span className="font-display font-bold text-xl tracking-tight">GigFlow</span>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link 
            href="/gigs" 
            className={`text-sm font-medium transition-colors hover:text-primary ${
              isActive('/gigs') ? 'text-primary' : 'text-muted-foreground'
            }`}
          >
            Find Work
          </Link>
          {user && (
            <Link 
              href="/dashboard"
              className={`text-sm font-medium transition-colors hover:text-primary ${
                isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
              }`}
            >
              Dashboard
            </Link>
          )}
        </div>

        <div className="flex items-center gap-4">
          {user ? (
            <div className="flex items-center gap-4">
              <Link href="/post-gig">
                <Button className="hidden sm:flex shadow-md shadow-primary/20">
                  <Plus className="w-4 h-4 mr-2" />
                  Post a Gig
                </Button>
              </Link>

              {/* Notifications */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative">
                    <Bell className="h-5 w-5" />
                    {unreadCount > 0 && (
                      <Badge
                        variant="destructive"
                        className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                      >
                        {unreadCount > 9 ? '9+' : unreadCount}
                      </Badge>
                    )}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80">
                  <div className="flex items-center justify-between p-4 border-b">
                    <h3 className="font-semibold">Notifications</h3>
                    {notifications.length > 0 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={clearNotifications}
                        className="text-xs"
                      >
                        Clear all
                      </Button>
                    )}
                  </div>

                  <div className="max-h-96 overflow-y-auto">
                    {notifications.length === 0 ? (
                      <div className="p-4 text-center text-muted-foreground">
                        <Bell className="h-8 w-8 mx-auto mb-2 opacity-50" />
                        <p className="text-sm">No notifications yet</p>
                      </div>
                    ) : (
                      notifications.map((notification) => (
                        <DropdownMenuItem
                          key={notification.id}
                          className={`p-4 cursor-pointer ${!notification.read ? 'bg-muted/50' : ''}`}
                          onClick={() => markAsRead(notification.id)}
                        >
                          <div className="flex gap-3 w-full">
                            <div className="flex-shrink-0 mt-1">
                              {notification.type === 'hired' && (
                                <CheckCircle className="h-5 w-5 text-green-600" />
                              )}
                              {notification.type === 'bid_received' && (
                                <DollarSign className="h-5 w-5 text-blue-600" />
                              )}
                              {notification.type === 'general' && (
                                <Bell className="h-5 w-5 text-gray-600" />
                              )}
                            </div>
                            <div className="flex-1 space-y-1">
                              <p className="text-sm font-medium leading-none">
                                {notification.title}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {notification.message}
                              </p>
                              <p className="text-xs text-muted-foreground">
                                {formatDistanceToNow(notification.timestamp, { addSuffix: true })}
                              </p>
                            </div>
                            {!notification.read && (
                              <div className="flex-shrink-0 w-2 h-2 bg-primary rounded-full mt-2" />
                            )}
                          </div>
                        </DropdownMenuItem>
                      ))
                    )}
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                    <Avatar className="h-10 w-10 border-2 border-background shadow-sm hover:border-primary/20 transition-colors">
                      <AvatarImage src={`https://api.dicebear.com/7.x/notionists/svg?seed=${user.id}`} />
                      <AvatarFallback className="bg-primary/10 text-primary">{getInitials(user.name || "User")}</AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-56" align="end" forceMount>
                  <div className="flex items-center justify-start gap-2 p-2">
                    <div className="flex flex-col space-y-1 leading-none">
                      <p className="font-medium">{user.name}</p>
                      <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link href="/dashboard" className="cursor-pointer">
                      <LayoutDashboard className="mr-2 h-4 w-4" />
                      <span>Dashboard</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link href="/post-gig" className="cursor-pointer sm:hidden">
                      <Plus className="mr-2 h-4 w-4" />
                      <span>Post a Gig</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem 
                    className="text-destructive focus:text-destructive cursor-pointer"
                    onClick={() => logoutMutation.mutate()}
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <Link href="/auth">
                <Button variant="ghost" className="font-medium">Log in</Button>
              </Link>
              <Link href="/auth?tab=register">
                <Button className="shadow-md shadow-primary/20">Sign up</Button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
