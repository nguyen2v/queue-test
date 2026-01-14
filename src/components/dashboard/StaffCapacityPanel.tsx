import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface StaffStatus {
  available: number;
  busy: number;
  onBreak: number;
  offline: number;
}

interface UpcomingEvent {
  id: string;
  text: string;
  time: string;
}

interface StaffCapacityPanelProps {
  status: StaffStatus;
  waitingCount: number;
  targetRatio: number;
  upcoming: UpcomingEvent[];
  onManage?: () => void;
}

const statusConfig = [
  { key: "available", label: "Available", color: "bg-success" },
  { key: "busy", label: "Busy", color: "bg-primary" },
  { key: "onBreak", label: "On Break", color: "bg-warning" },
  { key: "offline", label: "Offline", color: "bg-muted-foreground/40" },
] as const;

export function StaffCapacityPanel({
  status,
  waitingCount,
  targetRatio,
  upcoming,
  onManage,
}: StaffCapacityPanelProps) {
  const total = status.available + status.busy + status.onBreak + status.offline;
  const activeStaff = status.available + status.busy;
  const ratio = waitingCount > 0 ? (waitingCount / activeStaff).toFixed(1) : "0";
  const isAdequate = parseFloat(ratio) <= targetRatio;

  return (
    <Card className="h-full flex flex-col">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Staff Status</CardTitle>
          <Button variant="ghost" size="sm" onClick={onManage}>
            Manage <ArrowRight className="w-3 h-3 ml-1" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 space-y-4">
        {/* Status Bars */}
        <div className="space-y-2">
          {statusConfig.map(({ key, label, color }) => {
            const count = status[key];
            const width = (count / total) * 100;

            return (
              <div key={key} className="flex items-center gap-3">
                <div className="flex items-center gap-2 w-20">
                  <span
                    className={cn(
                      "w-2 h-2 rounded-full",
                      color,
                      key === "offline" && "opacity-50"
                    )}
                  />
                  <span className="text-xs text-muted-foreground">{label}</span>
                </div>
                <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                  <div
                    className={cn("h-full rounded-full transition-all", color)}
                    style={{ width: `${width}%` }}
                  />
                </div>
                <span className="text-xs font-medium w-6 text-right">{count}</span>
              </div>
            );
          })}
        </div>

        {/* Ratio */}
        <div className="border-t border-border/50 pt-4 space-y-2">
          <p className="text-xs text-muted-foreground">Staff : Queue Ratio</p>
          <div className="flex items-center gap-2">
            <span className="text-lg font-heading font-bold">
              {activeStaff} active : {waitingCount} waiting = 1:{ratio}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span
              className={cn(
                "w-2 h-2 rounded-full",
                isAdequate ? "bg-success" : "bg-warning"
              )}
            />
            <span
              className={cn(
                "text-xs font-medium",
                isAdequate ? "text-success" : "text-warning"
              )}
            >
              {isAdequate ? "Adequate" : "Attention needed"} (target ≤ 1:{targetRatio})
            </span>
          </div>
        </div>

        {/* Upcoming */}
        <div className="border-t border-border/50 pt-4">
          <div className="flex items-center gap-1.5 mb-2">
            <Clock className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">
              Upcoming
            </span>
          </div>
          <div className="space-y-1.5">
            {upcoming.map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between text-xs"
              >
                <span className="text-muted-foreground">• {event.text}</span>
                <span className="text-muted-foreground">{event.time}</span>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
