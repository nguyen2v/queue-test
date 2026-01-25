import { motion } from "framer-motion";
import { Clock, Users } from "lucide-react";

interface QueuePositionDisplayProps {
  queueNumber: string;
  position: number;
  estimatedWait: number;
  variant?: 'default' | 'compact';
}

export function QueuePositionDisplay({
  queueNumber,
  position,
  estimatedWait,
  variant = 'default',
}: QueuePositionDisplayProps) {
  if (variant === 'compact') {
    return (
      <div className="flex items-center justify-between p-4 bg-card rounded-2xl shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-full gradient-teal flex items-center justify-center">
            <span className="text-xl font-bold text-primary-foreground">{position}</span>
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Position</p>
            <p className="font-semibold text-foreground">{position} in line</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xs text-muted-foreground">Est. wait</p>
          <p className="font-semibold text-foreground">~{estimatedWait} min</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center py-6">
      {/* Queue Number */}
      <div className="mb-4 px-4 py-1.5 rounded-full bg-card/80 backdrop-blur-sm">
        <p className="text-sm font-mono font-semibold text-primary">{queueNumber}</p>
      </div>

      {/* Position Circle */}
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 200, damping: 15 }}
        className="relative mb-4"
      >
        <div className="w-28 h-28 rounded-full bg-card flex items-center justify-center relative shadow-xl">
          <span className="text-5xl font-bold text-primary">{position}</span>
          <div className="absolute inset-0 rounded-full border-4 border-primary/20 animate-pulse" />
        </div>
      </motion.div>

      <p className="text-muted-foreground text-sm mb-6">in line</p>

      {/* Stats Row */}
      <div className="flex items-center gap-8">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
            <Clock className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">~{estimatedWait}</p>
            <p className="text-xs text-muted-foreground">min wait</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-full bg-card flex items-center justify-center">
            <Users className="w-5 h-5 text-primary" />
          </div>
          <div>
            <p className="text-lg font-bold text-foreground">{position}</p>
            <p className="text-xs text-muted-foreground">ahead</p>
          </div>
        </div>
      </div>
    </div>
  );
}
