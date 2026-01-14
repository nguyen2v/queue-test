import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TimeSlot {
  hour: string;
  actual?: number;
  predicted?: number;
}

interface VolumeTimelineProps {
  data: TimeSlot[];
  currentHour: number;
  peakHours: string;
  currentPhase: string;
}

export function VolumeTimeline({
  data,
  currentHour,
  peakHours,
  currentPhase,
}: VolumeTimelineProps) {
  const maxValue = Math.max(
    ...data.map((d) => d.actual || d.predicted || 0)
  );

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-base">Today's Patient Volume</CardTitle>
      </CardHeader>
      <CardContent>
        {/* Chart */}
        <div className="relative h-40 mb-4">
          {/* Y-axis labels */}
          <div className="absolute left-0 top-0 bottom-6 w-6 flex flex-col justify-between text-[10px] text-muted-foreground">
            <span>{maxValue}</span>
            <span>{Math.round(maxValue / 2)}</span>
            <span>0</span>
          </div>

          {/* Bars */}
          <div className="ml-8 h-full flex items-end gap-1">
            {data.map((slot, index) => {
              const value = slot.actual ?? slot.predicted ?? 0;
              const height = (value / maxValue) * 100;
              const isPast = slot.actual !== undefined;
              const isCurrent = index === currentHour;

              return (
                <div
                  key={slot.hour}
                  className="flex-1 flex flex-col items-center gap-1"
                >
                  <div className="relative w-full flex-1 flex items-end">
                    <div
                      className={cn(
                        "w-full rounded-t transition-all duration-300",
                        isPast
                          ? "bg-primary"
                          : "bg-primary/30 border-2 border-dashed border-primary/40",
                        isCurrent && "ring-2 ring-primary ring-offset-2 ring-offset-background"
                      )}
                      style={{ height: `${height}%` }}
                    />
                    {isCurrent && (
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 flex flex-col items-center">
                        <span className="text-[10px] font-medium text-primary whitespace-nowrap">
                          NOW
                        </span>
                        <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-primary" />
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          {/* X-axis labels */}
          <div className="ml-8 flex gap-1 mt-2">
            {data.map((slot) => (
              <div
                key={slot.hour}
                className="flex-1 text-center text-[10px] text-muted-foreground"
              >
                {slot.hour}
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between text-xs border-t border-border/50 pt-3">
          <div className="flex items-center gap-1">
            <span className="text-muted-foreground">Peak:</span>
            <span className="font-medium">{peakHours}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Current phase:</span>
            <span className="font-medium text-primary">{currentPhase}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
