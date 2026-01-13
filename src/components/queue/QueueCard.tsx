import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "./StatusBadge";
import { TimeDisplay } from "./TimeDisplay";
import { QueueEntry } from "@/types/queue";
import { Phone, ArrowRightLeft, MoreHorizontal, User } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface QueueCardProps {
  entry: QueueEntry;
  onCall?: () => void;
  onTransfer?: () => void;
  onSelect?: () => void;
  selected?: boolean;
  compact?: boolean;
}

export function QueueCard({
  entry,
  onCall,
  onTransfer,
  onSelect,
  selected,
  compact = false,
}: QueueCardProps) {
  const waitTime = Math.round(
    (Date.now() - new Date(entry.checkInTime).getTime()) / 60000
  );

  return (
    <Card
      variant="queue"
      className={cn(
        "cursor-pointer",
        selected && "ring-2 ring-primary border-primary",
        entry.priority === 'urgent' && "border-l-4 border-l-urgent",
        entry.priority === 'high' && "border-l-4 border-l-high-priority"
      )}
      onClick={onSelect}
    >
      <div className="space-y-3">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {entry.priority !== 'normal' && (
              <StatusBadge status={entry.priority} />
            )}
            <span className="text-xs font-mono text-muted-foreground">
              {entry.queueNumber}
            </span>
          </div>
          <TimeDisplay minutes={waitTime} />
        </div>

        {/* Patient Info */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-secondary flex items-center justify-center">
            <User className="w-4 h-4 text-secondary-foreground" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-medium text-foreground truncate">
              {entry.patientName}
            </p>
            <p className="text-sm text-muted-foreground truncate">
              {entry.serviceType}
            </p>
          </div>
        </div>

        {/* Actions */}
        {!compact && (
          <div className="flex items-center gap-2 pt-2 border-t border-border/50">
            <Button
              variant="default"
              size="sm"
              className="flex-1"
              onClick={(e) => {
                e.stopPropagation();
                onCall?.();
              }}
            >
              <Phone className="w-3.5 h-3.5" />
              Call
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onTransfer?.();
              }}
            >
              <ArrowRightLeft className="w-3.5 h-3.5" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Mark as No-Show</DropdownMenuItem>
                <DropdownMenuItem>Add Note</DropdownMenuItem>
                <DropdownMenuItem>View History</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
      </div>
    </Card>
  );
}
