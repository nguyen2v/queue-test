import { Outlet, NavLink, useLocation } from "react-router-dom";
import { Home, ClipboardList, Bell, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueueStore } from "@/store/queueStore";

const navItems = [
  { to: "/mobile", icon: Home, label: "Home", end: true },
  { to: "/mobile/queue", icon: ClipboardList, label: "Queue" },
  { to: "/mobile/notifications", icon: Bell, label: "Alerts" },
  { to: "/mobile/profile", icon: User, label: "Profile" },
];

export function MobileLayout() {
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
      <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-card border-t border-border safe-area-pb">
        <div className="flex items-center justify-around h-16">
          {navItems.map((item) => {
            const isActive = item.end
              ? location.pathname === item.to
              : location.pathname.startsWith(item.to) && location.pathname !== '/mobile';
            const Icon = item.icon;

            return (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 w-16 h-full transition-colors touch-target relative",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.label === "Alerts" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-4 h-4 bg-urgent text-urgent-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </div>
                <span className="text-xs font-medium">{item.label}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>
    </div>
  );
}
