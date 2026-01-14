import { cn } from "@/lib/utils";

interface DailyProgressFooterProps {
  served: number;
  expected: number;
  noShows: number;
  noShowRate: number;
}

export function DailyProgressFooter({
  served,
  expected,
  noShows,
  noShowRate,
}: DailyProgressFooterProps) {
  const progress = Math.min((served / expected) * 100, 100);
  
  // Determine status based on progress vs time of day
  const hour = new Date().getHours();
  const expectedProgress = ((hour - 8) / 10) * 100; // Assuming 8am-6pm
  const diff = progress - expectedProgress;
  
  let status: "ahead" | "onTrack" | "behind" = "onTrack";
  if (diff > 10) status = "ahead";
  else if (diff < -10) status = "behind";

  const statusConfig = {
    ahead: { label: "Ahead", color: "text-blue-500", dot: "bg-blue-500" },
    onTrack: { label: "On Track", color: "text-success", dot: "bg-success" },
    behind: { label: "Behind", color: "text-warning", dot: "bg-warning" },
  };

  const config = statusConfig[status];

  return (
    <div className="bg-card border border-border rounded-xl p-4 shadow-soft">
      <div className="flex items-center gap-2 mb-3">
        <h3 className="text-sm font-medium">Today's Progress</h3>
      </div>

      {/* Progress Bar */}
      <div className="relative h-3 bg-muted rounded-full overflow-hidden mb-3">
        <div
          className="absolute inset-y-0 left-0 bg-primary rounded-full transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
        {/* Progress marker */}
        <div
          className="absolute top-1/2 -translate-y-1/2 w-4 h-4 bg-primary border-2 border-background rounded-full shadow-md transition-all duration-500"
          style={{ left: `calc(${progress}% - 8px)` }}
        />
      </div>

      {/* Stats */}
      <div className="flex items-center justify-between text-sm">
        <div className="flex items-center gap-6">
          <div>
            <span className="text-muted-foreground">Served: </span>
            <span className="font-semibold">{served}</span>
            <span className="text-muted-foreground"> of ~{expected} expected</span>
          </div>
          <div className="text-muted-foreground">│</div>
          <div>
            <span className="text-muted-foreground">No-shows: </span>
            <span className="font-semibold">{noShows}</span>
            <span className="text-muted-foreground"> ({noShowRate}%)</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className={cn("w-2 h-2 rounded-full", config.dot)} />
          <span className={cn("font-medium", config.color)}>
            {config.label}
          </span>
        </div>
      </div>
    </div>
  );
}
