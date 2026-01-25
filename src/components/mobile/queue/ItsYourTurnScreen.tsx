import { motion } from "framer-motion";
import { Bell, ArrowRight, MapPin, Building2, DoorOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

interface ItsYourTurnScreenProps {
  destination: string;
  room?: string;
  building?: string;
  queueNumber?: string;
  onDismiss: () => void;
}

export function ItsYourTurnScreen({
  destination,
  room,
  building,
  queueNumber,
  onDismiss,
}: ItsYourTurnScreenProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-4"
    >
      {/* Main notification card */}
      <Card className="p-6 rounded-2xl border-2 border-accent/30 bg-accent/5 shadow-lg">
        {/* Animated bell icon */}
        <div className="flex justify-center mb-4">
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: [15, -15, 15, -15, 0] }}
            transition={{ duration: 0.6, delay: 0.2, repeat: Infinity, repeatDelay: 3 }}
            className="w-16 h-16 rounded-full bg-accent flex items-center justify-center shadow-lg"
          >
            <Bell className="w-8 h-8 text-accent-foreground" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center mb-4"
        >
          <h2 className="text-2xl font-heading font-bold text-foreground mb-1">
            It's Your Turn!
          </h2>
          <p className="text-muted-foreground text-sm">
            Please proceed to your destination
          </p>
        </motion.div>

        {/* Queue number */}
        {queueNumber && (
          <div className="text-center mb-4 py-3 bg-accent/10 rounded-xl">
            <p className="text-xs text-muted-foreground mb-1">Your Queue Number</p>
            <p className="text-2xl font-bold font-mono text-accent">
              {queueNumber}
            </p>
          </div>
        )}

        {/* Destination info */}
        <div className="bg-card rounded-xl p-4 border">
          <p className="text-xs text-muted-foreground mb-2">Go to</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{destination}</p>
              {(building || room) && (
                <div className="flex flex-col gap-0.5 mt-1">
                  {building && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <Building2 className="w-3.5 h-3.5" />
                      <span>{building}</span>
                    </div>
                  )}
                  {room && (
                    <div className="flex items-center gap-1.5 text-muted-foreground text-sm">
                      <DoorOpen className="w-3.5 h-3.5" />
                      <span>{room}</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-4"
        >
          <Button
            size="lg"
            className="w-full rounded-xl bg-accent hover:bg-accent/90 text-accent-foreground font-semibold h-12"
            onClick={onDismiss}
          >
            I'm on my way
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </Card>
    </motion.div>
  );
}
