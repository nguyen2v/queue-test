import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, Mail, Calendar, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueueStore } from "@/store/queueStore";

const navItems = [
  { to: "/mobile/v2", icon: Home, label: "Trang chủ", end: true },
  { to: "/mobile/v2/messages", icon: Mail, label: "Tin nhắn" },
  { to: "/mobile/v2/appointments", icon: Calendar, label: "Lịch hẹn" },
  { to: "/mobile/v2/profile", icon: User, label: "Tài khoản" },
];

export function MobileV2Layout() {
  const location = useLocation();
  const { notifications } = useQueueStore();
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      {/* Main Content */}
      <main className="flex-1 overflow-auto pb-20">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border safe-area-pb z-50">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && location.pathname !== '/mobile/v2';
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors touch-target relative",
                  isActive ? "text-[hsl(221,83%,53%)]" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  {isActive && item.label === "Trang chủ" && (
                    <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-[hsl(221,83%,53%)]" />
                  )}
                  <Icon className="w-5 h-5" />
                  {item.label === "Tin nhắn" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-[10px] font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
