import { AlertTriangle, AlertCircle, Star, UserX, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

type AlertType = "critical" | "longWait" | "vip" | "noShow";

interface Alert {
  id: string;
  type: AlertType;
  title: string;
  description: string;
  actions: string[];
}

interface ActivityItem {
  id: string;
  text: string;
  time: string;
}

interface AlertsPanelProps {
  alerts: Alert[];
  recentActivity: ActivityItem[];
  onAlertAction?: (alertId: string, action: string) => void;
}

const alertConfig: Record<
  AlertType,
  { icon: typeof AlertCircle; bg: string; iconColor: string; badge: string; badgeColor: string }
> = {
  critical: {
    icon: AlertCircle,
    bg: "bg-destructive/10 border-destructive/30",
    iconColor: "text-destructive",
    badge: "CRITICAL",
    badgeColor: "bg-destructive text-destructive-foreground",
  },
  longWait: {
    icon: Clock,
    bg: "bg-warning/10 border-warning/30",
    iconColor: "text-warning",
    badge: "LONG WAIT",
    badgeColor: "bg-warning text-warning-foreground",
  },
  vip: {
    icon: Star,
    bg: "bg-blue-500/10 border-blue-500/30",
    iconColor: "text-blue-500",
    badge: "VIP PATIENT",
    badgeColor: "bg-blue-500 text-white",
  },
  noShow: {
    icon: UserX,
    bg: "bg-muted border-border",
    iconColor: "text-muted-foreground",
    badge: "NO-SHOW",
    badgeColor: "bg-muted-foreground text-white",
  },
};

function AlertCard({
  alert,
  onAction,
}: {
  alert: Alert;
  onAction?: (action: string) => void;
}) {
  const config = alertConfig[alert.type];
  const Icon = config.icon;

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className={cn(
        "rounded-lg border p-3 space-y-2",
        config.bg
      )}
    >
      {/* Badge */}
      <div className="flex items-center gap-2">
        <Icon className={cn("w-4 h-4", config.iconColor)} />
        <span
          className={cn(
            "text-[10px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wide",
            config.badgeColor
          )}
        >
          {config.badge}
        </span>
      </div>

      {/* Content */}
      <div>
        <p className="font-medium text-sm">{alert.title}</p>
        <p className="text-xs text-muted-foreground">{alert.description}</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        {alert.actions.map((action, index) => (
          <Button
            key={action}
            variant={index === 0 ? "default" : "outline"}
            size="sm"
            className="h-7 text-xs"
            onClick={() => onAction?.(action)}
          >
            {action}
          </Button>
        ))}
      </div>
    </motion.div>
  );
}

export function AlertsPanel({
  alerts,
  recentActivity,
  onAlertAction,
}: AlertsPanelProps) {
  const activeAlerts = alerts.length;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-warning" />
            <CardTitle className="text-base">Alerts</CardTitle>
          </div>
          <span
            className={cn(
              "text-xs font-semibold px-2 py-1 rounded-full",
              activeAlerts > 0
                ? "bg-destructive/10 text-destructive"
                : "bg-success/10 text-success"
            )}
          >
            {activeAlerts} active
          </span>
        </div>
      </CardHeader>
      <CardContent className="flex-1 flex flex-col p-0 overflow-hidden">
        {/* Alerts List */}
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            <AnimatePresence mode="popLayout">
              {alerts.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-12 h-12 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-3">
                    <span className="text-success text-xl">✓</span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    All systems normal
                  </p>
                </motion.div>
              ) : (
                alerts.map((alert) => (
                  <AlertCard
                    key={alert.id}
                    alert={alert}
                    onAction={(action) => onAlertAction?.(alert.id, action)}
                  />
                ))
              )}
            </AnimatePresence>
          </div>
        </ScrollArea>

        {/* Recent Activity */}
        <div className="border-t border-border/50 px-4 py-3 bg-muted/20">
          <p className="text-xs font-medium text-muted-foreground mb-2">
            Recent Activity
          </p>
          <div className="space-y-1.5">
            {recentActivity.slice(0, 3).map((item) => (
              <div
                key={item.id}
                className="flex items-center gap-2 text-xs text-muted-foreground"
              >
                <span className="w-1 h-1 rounded-full bg-muted-foreground" />
                <span className="flex-1 truncate">{item.text}</span>
                <span className="text-[10px]">{item.time}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
