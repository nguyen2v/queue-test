import { Card } from "@/components/ui/card";
import { QueueHistoryEntry, QUEUE_LOCATIONS } from "@/types/queue";
import { Check, ArrowRight, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueHistoryCardProps {
  history: QueueHistoryEntry[];
  className?: string;
}

export function QueueHistoryCard({ history, className }: QueueHistoryCardProps) {
  if (!history || history.length === 0) return null;

  return (
    <Card className={cn("p-4 rounded-2xl shadow-sm", className)}>
      <p className="text-sm font-medium text-foreground mb-3">Your Journey</p>
      <div className="space-y-2">
        {history.map((entry, index) => (
          <div key={index} className="flex items-center gap-3">
            {/* Status icon */}
            <div
              className={cn(
                "w-6 h-6 rounded-full flex items-center justify-center shrink-0",
                entry.status === 'completed' && "bg-success/10",
                entry.status === 'current' && "bg-primary/10",
                entry.status === 'upcoming' && "bg-muted"
              )}
            >
              {entry.status === 'completed' && (
                <Check className="w-3.5 h-3.5 text-success" />
              )}
              {entry.status === 'current' && (
                <ArrowRight className="w-3.5 h-3.5 text-primary" />
              )}
              {entry.status === 'upcoming' && (
                <Clock className="w-3.5 h-3.5 text-muted-foreground" />
              )}
            </div>

            {/* Location info */}
            <div className="flex-1 min-w-0">
              <p
                className={cn(
                  "text-sm truncate",
                  entry.status === 'completed' && "text-muted-foreground line-through",
                  entry.status === 'current' && "text-foreground font-medium",
                  entry.status === 'upcoming' && "text-muted-foreground"
                )}
              >
                {entry.locationName}
              </p>
              {entry.room && entry.status === 'current' && (
                <p className="text-xs text-muted-foreground">
                  {entry.building && `${entry.building}, `}{entry.room}
                </p>
              )}
            </div>

            {/* Connector line */}
            {index < history.length - 1 && (
              <div className="absolute left-[27px] top-8 w-0.5 h-4 bg-border" />
            )}
          </div>
        ))}
      </div>
    </Card>
  );
}
