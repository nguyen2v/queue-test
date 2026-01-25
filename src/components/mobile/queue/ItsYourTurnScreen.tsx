import { motion } from "framer-motion";
import { Bell, ArrowRight, MapPin, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItsYourTurnScreenProps {
  destination: string;
  room?: string;
  building?: string;
  queueNumber?: string;
  onDismiss: () => void;
  onBack?: () => void;
}

export function ItsYourTurnScreen({
  destination,
  room,
  building,
  queueNumber,
  onDismiss,
  onBack,
}: ItsYourTurnScreenProps) {
  return (
    <div className="min-h-screen animate-fade-in">
      {/* Header with coral gradient */}
      <div 
        className="relative px-5 pt-12 pb-16"
        style={{
          background: "linear-gradient(180deg, hsl(24, 95%, 53%) 0%, hsl(24, 90%, 58%) 100%)"
        }}
      >
        <div className="flex items-center justify-between mb-8">
          {onBack && (
            <button 
              onClick={onBack}
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
            >
              <ArrowLeft className="w-5 h-5 text-white" />
            </button>
          )}
          {!onBack && <div className="w-10" />}
          <h1 className="text-white font-semibold">Queue Status</h1>
          <div className="w-10" />
        </div>

        {/* Animated bell icon */}
        <div className="flex justify-center mb-6">
          <motion.div
            initial={{ rotate: -15 }}
            animate={{ rotate: [15, -15, 15, -15, 0] }}
            transition={{ duration: 0.6, delay: 0.2, repeat: Infinity, repeatDelay: 3 }}
            className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <Bell className="w-10 h-10 text-white" />
          </motion.div>
        </div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-center"
        >
          <h2 className="text-3xl font-heading font-bold text-white mb-2">
            It's Your Turn!
          </h2>
          <p className="text-white/80">
            Please proceed to your destination
          </p>
        </motion.div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-6 space-y-4">
        {/* Queue number card */}
        {queueNumber && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-card rounded-2xl p-4 shadow-sm border text-center"
          >
            <p className="text-xs text-muted-foreground mb-1">Your Queue Number</p>
            <p className="text-3xl font-bold font-mono text-primary">
              {queueNumber}
            </p>
          </motion.div>
        )}

        {/* Destination info */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-card rounded-2xl p-5 shadow-sm border"
        >
          <p className="text-sm text-muted-foreground mb-3">Go to</p>
          <div className="flex items-start gap-3">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-6 h-6 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-lg text-foreground">{destination}</p>
              {(building || room) && (
                <p className="text-muted-foreground">
                  {building && `${building}`}
                  {building && room && ", "}
                  {room}
                </p>
              )}
            </div>
          </div>
        </motion.div>

        {/* CTA Button */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="pt-4"
        >
          <Button
            size="lg"
            className="w-full rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground font-semibold h-14"
            onClick={onDismiss}
          >
            I'm on my way
            <ArrowRight className="w-5 h-5 ml-2" />
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
