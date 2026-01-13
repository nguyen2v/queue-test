import { useQueueStore } from "@/store/queueStore";
import { Card } from "@/components/ui/card";
import { Bell, Check, Calendar, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  urgent: AlertTriangle,
  success: Check,
  warning: AlertTriangle,
  info: Bell,
};

const colorMap = {
  urgent: 'text-urgent bg-urgent/10',
  success: 'text-success bg-success/10',
  warning: 'text-warning bg-warning/10',
  info: 'text-primary bg-primary/10',
};

export function MobileNotifications() {
  const { notifications, markNotificationRead } = useQueueStore();

  const today = notifications.filter(
    (n) => new Date(n.timestamp).toDateString() === new Date().toDateString()
  );
  const earlier = notifications.filter(
    (n) => new Date(n.timestamp).toDateString() !== new Date().toDateString()
  );

  const formatTime = (date: Date) => {
    const diff = Date.now() - new Date(date).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 60) return `${minutes} min ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours} hours ago`;
    return 'Yesterday';
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <h1 className="text-2xl font-heading font-bold">Notifications</h1>

      {/* Today */}
      {today.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Today
          </h2>
          {today.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <Card
                key={notification.id}
                variant="queue"
                className={cn(
                  "p-4 cursor-pointer",
                  !notification.read && "bg-primary/5 border-primary/20"
                )}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", colorMap[notification.type])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className="font-medium truncate">{notification.title}</p>
                      {!notification.read && (
                        <span className="w-2 h-2 rounded-full bg-primary flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Earlier */}
      {earlier.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
            Earlier
          </h2>
          {earlier.map((notification) => {
            const Icon = iconMap[notification.type];
            return (
              <Card
                key={notification.id}
                variant="queue"
                className="p-4"
              >
                <div className="flex items-start gap-3">
                  <div className={cn("p-2 rounded-lg", colorMap[notification.type])}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate">{notification.title}</p>
                    <p className="text-sm text-muted-foreground mt-0.5">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {formatTime(notification.timestamp)}
                    </p>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* Empty State */}
      {notifications.length === 0 && (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
            <Bell className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="font-medium">No notifications</p>
          <p className="text-sm text-muted-foreground mt-1">
            You're all caught up!
          </p>
        </div>
      )}
    </div>
  );
}
