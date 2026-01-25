import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Users, 
  Bell, 
  Stethoscope, 
  Scan,
  FlaskConical,
  Receipt,
  Pill,
  MapPin
} from "lucide-react";
import { QueueLocation, QUEUE_LOCATIONS } from "@/types/queue";

interface QueueStatusCardProps {
  currentLocation?: QueueLocation;
  status: 'waiting' | 'your-turn' | 'in-service' | 'queue';
  position?: number;
  estimatedWait?: number;
  queueNumber: string;
  building?: string;
  room?: string;
  serviceName?: string;
}

const statusConfig = {
  waiting: {
    title: "Waiting",
    subtitle: "Please wait for your turn",
    bgClass: "bg-primary",
    icon: Users,
  },
  'your-turn': {
    title: "It's Your Turn!",
    subtitle: "Please proceed to your destination",
    bgClass: "bg-accent",
    icon: Bell,
  },
  'in-service': {
    title: "Being Served",
    subtitle: "You're currently being attended to",
    bgClass: "bg-success",
    icon: Stethoscope,
  },
  queue: {
    title: "In Queue",
    subtitle: "Waiting for your turn",
    bgClass: "bg-primary",
    icon: Users,
  },
};

const locationIcons: Record<QueueLocation, typeof Users> = {
  'general-waiting': Users,
  'clinic-suite': Stethoscope,
  'radiology': Scan,
  'laboratory': FlaskConical,
  'billing': Receipt,
  'pharmacy': Pill,
};

export function QueueStatusCard({
  currentLocation = 'general-waiting',
  status,
  position,
  estimatedWait,
  queueNumber,
  building,
  room,
  serviceName,
}: QueueStatusCardProps) {
  const config = statusConfig[status];
  const LocationIcon = currentLocation ? locationIcons[currentLocation] : config.icon;
  const locationInfo = currentLocation ? QUEUE_LOCATIONS[currentLocation] : null;

  return (
    <motion.div
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-2xl p-4 text-primary-foreground shadow-lg",
        status === 'your-turn' && "bg-accent",
        status === 'in-service' && "bg-success",
        (status === 'waiting' || status === 'queue') && "bg-primary"
      )}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
          <LocationIcon className="w-5 h-5" />
        </div>
        <div>
          <p className="font-semibold">{config.title}</p>
          <p className="text-xs text-white/70">{locationInfo?.name || 'General Waiting Room'}</p>
        </div>
      </div>

      {/* Location details */}
      {(building || room) && (
        <div className="flex items-center gap-2 text-sm text-white/80 mb-2">
          <MapPin className="w-4 h-4" />
          <span>
            {building && building}
            {building && room && ", "}
            {room}
          </span>
        </div>
      )}

      {/* Position and wait time for waiting states */}
      {(status === 'waiting' || status === 'queue') && position !== undefined && (
        <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/20">
          <div>
            <p className="text-xs text-white/70">Position</p>
            <p className="font-bold text-lg">{position} in line</p>
          </div>
          {estimatedWait !== undefined && (
            <div className="text-right">
              <p className="text-xs text-white/70">Est. wait</p>
              <p className="font-bold text-lg">~{estimatedWait} min</p>
            </div>
          )}
        </div>
      )}
    </motion.div>
  );
}
