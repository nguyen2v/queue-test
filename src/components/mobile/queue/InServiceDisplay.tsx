import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import { Stethoscope, MapPin, Building2, DoorOpen, Clock } from "lucide-react";

interface InServiceDisplayProps {
  serviceName: string;
  building?: string;
  room?: string;
  staffName?: string;
  startedAt?: Date;
}

export function InServiceDisplay({
  serviceName,
  building,
  room,
  staffName,
  startedAt,
}: InServiceDisplayProps) {
  // Calculate duration if startedAt provided
  const duration = startedAt
    ? Math.floor((Date.now() - startedAt.getTime()) / 60000)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Status Header */}
      <div className="text-center py-6">
        <motion.div
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200 }}
          className="w-20 h-20 rounded-full gradient-teal mx-auto mb-4 flex items-center justify-center shadow-lg"
        >
          <Stethoscope className="w-10 h-10 text-primary-foreground" />
        </motion.div>
        <h2 className="text-xl font-heading font-bold text-foreground mb-1">
          You're Being Served
        </h2>
        <p className="text-muted-foreground">
          Please follow your healthcare provider's instructions
        </p>
      </div>

      {/* Location Card */}
      <Card className="p-5 rounded-2xl shadow-lg border-0">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
            <MapPin className="w-6 h-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="font-semibold text-foreground mb-2">{serviceName}</p>
            <div className="space-y-1">
              {building && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Building2 className="w-4 h-4" />
                  <span className="text-sm">{building}</span>
                </div>
              )}
              {room && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <DoorOpen className="w-4 h-4" />
                  <span className="text-sm">{room}</span>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Staff info */}
        {staffName && (
          <div className="mt-4 pt-4 border-t border-border">
            <p className="text-sm text-muted-foreground">
              Served by: <span className="text-foreground font-medium">{staffName}</span>
            </p>
          </div>
        )}
      </Card>

      {/* Duration indicator */}
      {startedAt && (
        <Card className="p-4 rounded-2xl bg-secondary/50 border-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span className="text-sm">Session duration</span>
            </div>
            <span className="font-semibold text-foreground">
              {duration} min
            </span>
          </div>
        </Card>
      )}
    </motion.div>
  );
}
