import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueueStore } from "@/store/queueStore";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { CheckCircle2, HeartPulse, Stethoscope } from "lucide-react";

function hasVitals(entry: { vitals?: { heightCm?: number; weightKg?: number } }) {
  return Boolean(entry.vitals?.heightCm && entry.vitals?.weightKg);
}

export function DoctorView() {
  const navigate = useNavigate();
  const { queue } = useQueueStore();

  const [activeRoom, setActiveRoom] = useState<string>("Room 101");

  const roomOptions = useMemo(() => {
    const fromQueue = Array.from(
      new Set(queue.map((q) => q.room).filter(Boolean) as string[])
    );
    const fallback = ["Room 101", "Room 102", "Room 103", "Room 201"];
    const merged = Array.from(new Set([activeRoom, ...fromQueue, ...fallback]));
    return merged.sort();
  }, [queue, activeRoom]);

  const clinicSuite = queue.filter((q) => q.status === "clinic-suite");
  const inService = queue.filter((q) => q.status === "in-service");
  const cancelled = queue.filter((q) => q.status === "cancelled" || q.status === "no-show");

  const Column = ({
    title,
    count,
    items,
  }: {
    title: string;
    count: number;
    items: typeof queue;
  }) => (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-heading font-semibold text-foreground">{title}</h2>
        <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
          {count}
        </span>
      </div>

      <div className="space-y-2">
        {items.map((entry) => (
          <Card
            key={entry.id}
            className={cn(
              "p-3 cursor-pointer hover:bg-muted/30 transition-colors",
              entry.callStatus === "called" && "border-success/40"
            )}
            onClick={() => navigate(`/admin/doctor/${entry.id}`, { state: { activeRoom } })}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-foreground">
                    {entry.queueNumber}
                  </span>
                  {hasVitals(entry) && (
                    <Badge variant="secondary" className="gap-1">
                      <HeartPulse className="w-3.5 h-3.5" />
                      Vitals
                    </Badge>
                  )}
                </div>
                <p className="font-medium text-foreground truncate">{entry.patientName}</p>
                <p className="text-sm text-muted-foreground truncate">{entry.serviceType}</p>
                {entry.room && (
                  <p className="text-xs text-muted-foreground mt-1">{entry.room}</p>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {entry.callStatus === "calling" && (
                  <Badge variant="warning">Calling</Badge>
                )}
                {entry.callStatus === "called" && (
                  <Badge variant="success" className="gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Called
                  </Badge>
                )}
              </div>
            </div>
          </Card>
        ))}

        {items.length === 0 && (
          <div className="text-sm text-muted-foreground bg-muted/30 rounded-lg p-6 text-center">
            No patients
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-2xl font-heading font-bold text-foreground flex items-center gap-2">
            <Stethoscope className="w-6 h-6 text-primary" />
            Doctor View
          </h1>
          <p className="text-sm text-muted-foreground">
            Manage Clinic Suite calls, start service, and handle cancellations.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-sm text-muted-foreground">Active room</div>
          <Select value={activeRoom} onValueChange={setActiveRoom}>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select room" />
            </SelectTrigger>
            <SelectContent>
              {roomOptions.map((room) => (
                <SelectItem key={room} value={room}>
                  {room}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button variant="outline" onClick={() => setActiveRoom((r) => r)}>
            Refresh
          </Button>
        </div>
      </header>

      <main className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Column title="In Clinic Suite" count={clinicSuite.length} items={clinicSuite} />
        <Column title="In Service" count={inService.length} items={inService} />
        <Column title="Cancelled / No Show" count={cancelled.length} items={cancelled} />
      </main>
    </div>
  );
}
