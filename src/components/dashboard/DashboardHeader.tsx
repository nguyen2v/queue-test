import { useState, useEffect } from "react";
import { MapPin, ChevronDown } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const locations = [
  { id: "main", name: "City Medical Center" },
  { id: "north", name: "North Campus Clinic" },
  { id: "south", name: "South Wing" },
];

export function DashboardHeader() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [selectedLocation, setSelectedLocation] = useState("main");

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    });
  };

  return (
    <div className="flex items-center justify-between bg-card border border-border rounded-xl px-4 py-3 shadow-soft">
      {/* Logo */}
      <div className="flex items-center gap-2">
        <div className="w-8 h-8 rounded-lg gradient-teal flex items-center justify-center">
          <span className="text-white font-heading font-bold text-sm">Q</span>
        </div>
        <span className="font-heading font-bold text-lg text-foreground">
          QueueCare
        </span>
      </div>

      {/* Location Selector */}
      <div className="flex items-center gap-6">
        <Select value={selectedLocation} onValueChange={setSelectedLocation}>
          <SelectTrigger className="w-[200px] border-0 bg-muted/50 h-9">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-muted-foreground" />
              <SelectValue />
            </div>
          </SelectTrigger>
          <SelectContent>
            {locations.map((loc) => (
              <SelectItem key={loc.id} value={loc.id}>
                {loc.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Live Indicator */}
        <div className="flex items-center gap-2">
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-success opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-success"></span>
          </span>
          <span className="text-sm font-medium text-success">Live</span>
        </div>

        {/* Current Time */}
        <div className="text-sm font-medium text-muted-foreground tabular-nums">
          {formatTime(currentTime)}
        </div>
      </div>
    </div>
  );
}
