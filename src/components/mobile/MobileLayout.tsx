import { Outlet, NavLink, useLocation, useNavigate } from "react-router-dom";
import { Home, ClipboardList, Bell, User, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import { useQueueStore } from "@/store/queueStore";
import { motion, AnimatePresence } from "framer-motion";

const navItems = [
  { to: "/mobile", icon: Home, label: "Home", end: true },
  { to: "/mobile/queue", icon: ClipboardList, label: "Queue" },
  { to: "/mobile/notifications", icon: Bell, label: "Alerts" },
  { to: "/mobile/profile", icon: User, label: "Profile" },
];

export function MobileLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const { notifications, activeQueueEntry, queue } = useQueueStore();
  const unreadCount = notifications.filter((n) => !n.read).length;
  
  // Calculate position in queue
  const position = activeQueueEntry 
    ? queue.filter(q => 
        q.status === 'waiting' && 
        q.checkInTime <= activeQueueEntry.checkInTime
      ).length
    : 0;
  
  // Check if we're already on the queue status page
  const isOnQueueStatus = location.pathname === '/mobile/queue';

  return (
    <div className="flex flex-col min-h-screen max-w-md mx-auto bg-background">
      {/* Floating Queue Indicator */}
      <AnimatePresence>
        {activeQueueEntry && !isOnQueueStatus && (
          <motion.button
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => navigate('/mobile/queue')}
            className="fixed bottom-24 left-4 right-4 max-w-md mx-auto z-50 bg-primary text-primary-foreground rounded-2xl p-4 shadow-lg border border-primary/20"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-xl bg-primary-foreground/20 flex items-center justify-center">
                  <span className="text-lg font-bold">{activeQueueEntry.queueNumber}</span>
                </div>
                <div className="text-left">
                  <p className="text-sm font-medium opacity-90">You're in queue</p>
                  <p className="text-xs opacity-75">
                    Position #{position} • ~{activeQueueEntry.estimatedWaitMinutes} min wait
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="flex -space-x-1">
                  <Users className="w-4 h-4 opacity-75" />
                </div>
                <motion.div
                  animate={{ x: [0, 4, 0] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="text-sm font-medium"
                >
                  View →
                </motion.div>
              </div>
            </div>
            {/* Pulsing indicator */}
            <motion.div
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="absolute top-2 right-2 w-2 h-2 bg-primary-foreground rounded-full"
            />
          </motion.button>
        )}
      </AnimatePresence>

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
