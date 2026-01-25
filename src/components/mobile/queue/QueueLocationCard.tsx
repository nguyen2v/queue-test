import { Card } from "@/components/ui/card";
import { MapPin, Building2, DoorOpen } from "lucide-react";
import { cn } from "@/lib/utils";

interface QueueLocationCardProps {
  serviceName: string;
  location: string;
  building?: string;
  room?: string;
  status: 'waiting' | 'clinic-suite' | 'in-service';
  className?: string;
}

const statusConfig = {
  waiting: {
    label: "Waiting",
    bgClass: "bg-warning/10",
    textClass: "text-warning",
    dotClass: "bg-warning animate-pulse",
  },
  'clinic-suite': {
    label: "In Clinic Suite",
    bgClass: "bg-secondary",
    textClass: "text-secondary-foreground",
    dotClass: "bg-secondary-foreground",
  },
  'in-service': {
    label: "In Service",
    bgClass: "bg-primary/10",
    textClass: "text-primary",
    dotClass: "bg-primary",
  },
};

export function QueueLocationCard({
  serviceName,
  location,
  building,
  room,
  status,
  className,
}: QueueLocationCardProps) {
  const config = statusConfig[status];

  return (
    <Card className={cn("p-5 rounded-2xl shadow-lg border-0", className)}>
      {/* Status badge */}
      <div className="flex items-center gap-2 mb-4">
        <span className={cn("w-2 h-2 rounded-full", config.dotClass)} />
        <span className={cn("text-xs font-medium uppercase tracking-wide", config.textClass)}>
          {config.label}
        </span>
      </div>

      {/* Service name */}
      <div className="flex items-center gap-2 mb-3">
        <MapPin className="w-4 h-4 text-primary shrink-0" />
        <span className="text-base font-semibold text-foreground">{serviceName}</span>
      </div>

      {/* Location details */}
      <div className="space-y-1.5 ml-6">
        {building && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <Building2 className="w-3.5 h-3.5" />
            <span className="text-sm">{building}</span>
          </div>
        )}
        {room && (
          <div className="flex items-center gap-2 text-muted-foreground">
            <DoorOpen className="w-3.5 h-3.5" />
            <span className="text-sm">{room}</span>
          </div>
        )}
        {!building && !room && (
          <p className="text-sm text-muted-foreground">{location}</p>
        )}
      </div>

      {/* In Service highlight */}
      {status === 'in-service' && (
        <div className="mt-4 p-3 rounded-xl bg-primary/5 border border-primary/10">
          <p className="text-sm text-primary font-medium text-center">
            You are currently being served
          </p>
        </div>
      )}
    </Card>
  );
}
