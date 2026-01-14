import { motion } from "framer-motion";
import { Clock, Users, MapPin } from "lucide-react";
import logo from "@/assets/logo.png";

interface LiveActivityPreviewProps {
  queueNumber: string;
  position: number;
  estimatedWait: number;
  serviceName: string;
  locationName?: string;
  variant?: "expanded" | "compact" | "minimal";
}

export function LiveActivityPreview({
  queueNumber,
  position,
  estimatedWait,
  serviceName,
  locationName = "City Medical Center",
  variant = "expanded",
}: LiveActivityPreviewProps) {
  const progress = Math.max(0, Math.min(100, ((10 - position) / 10) * 100));

  if (variant === "minimal") {
    // Dynamic Island minimal view
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-1">Dynamic Island (Minimal)</p>
        <div className="bg-black rounded-full px-4 py-2 flex items-center gap-3 shadow-xl">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary-foreground">
                {queueNumber.slice(-2)}
              </span>
            </div>
            <span className="text-white text-xs font-medium">#{position}</span>
          </div>
          <div className="w-px h-4 bg-white/20" />
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3 text-primary" />
            <span className="text-white text-xs">{estimatedWait}m</span>
          </div>
        </div>
      </div>
    );
  }

  if (variant === "compact") {
    // Dynamic Island compact expanded view
    return (
      <div className="flex flex-col items-center gap-2">
        <p className="text-xs text-muted-foreground mb-1">Dynamic Island (Expanded)</p>
        <div className="bg-black rounded-[22px] p-3 px-4 flex items-center justify-between gap-4 shadow-xl min-w-[280px]">
          <div className="flex items-center gap-3">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-10 h-10 rounded-xl bg-primary flex items-center justify-center"
            >
              <span className="text-sm font-bold text-primary-foreground">{queueNumber}</span>
            </motion.div>
            <div>
              <p className="text-white text-sm font-semibold">Position #{position}</p>
              <p className="text-white/60 text-xs">{serviceName}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white text-lg font-bold">{estimatedWait}</p>
            <p className="text-white/60 text-xs">min wait</p>
          </div>
        </div>
      </div>
    );
  }

  // Lock Screen expanded Live Activity
  return (
    <div className="flex flex-col items-center gap-2 w-full max-w-sm">
      <p className="text-xs text-muted-foreground mb-1">Lock Screen Live Activity</p>
      <div className="w-full bg-black/90 backdrop-blur-xl rounded-[20px] p-4 shadow-2xl border border-white/10">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <img src={logo} alt="QueueCare" className="w-8 h-8 rounded-lg" />
            <div>
              <p className="text-white text-sm font-semibold">Queue Status</p>
              <div className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-white/50" />
                <p className="text-white/50 text-xs">{locationName}</p>
              </div>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full"
          >
            <div className="w-1.5 h-1.5 bg-green-400 rounded-full" />
            <span className="text-green-400 text-[10px] font-medium">LIVE</span>
          </motion.div>
        </div>

        {/* Main Content */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            {/* Queue Number */}
            <motion.div
              animate={{ scale: [1, 1.02, 1] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary/80 flex items-center justify-center shadow-lg shadow-primary/30"
            >
              <span className="text-xl font-bold text-primary-foreground">{queueNumber}</span>
            </motion.div>

            {/* Position Info */}
            <div>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-bold text-white">#{position}</span>
              </div>
              <p className="text-white/60 text-sm">in queue</p>
            </div>
          </div>

          {/* Wait Time */}
          <div className="text-right">
            <div className="flex items-baseline gap-1 justify-end">
              <Clock className="w-4 h-4 text-primary mb-1" />
              <span className="text-3xl font-bold text-white">{estimatedWait}</span>
              <span className="text-white/60 text-sm">min</span>
            </div>
            <p className="text-white/60 text-sm">est. wait</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mb-3">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary to-primary/70 rounded-full"
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-white/40 text-[10px]">Checked in</span>
            <span className="text-white/40 text-[10px]">Your turn</span>
          </div>
        </div>

        {/* Service Info */}
        <div className="flex items-center justify-between pt-3 border-t border-white/10">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-primary" />
            <span className="text-white/80 text-sm">{serviceName}</span>
          </div>
          <div className="flex items-center gap-1 text-white/50 text-xs">
            <Users className="w-3 h-3" />
            <span>{position - 1} ahead of you</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Showcase component to display all variants
export function LiveActivityShowcase() {
  const mockData = {
    queueNumber: "A-042",
    position: 3,
    estimatedWait: 12,
    serviceName: "General Consultation",
    locationName: "City Medical Center",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-slate-800 p-6 pb-24">
      {/* iOS Status Bar Mock */}
      <div className="flex justify-between items-center text-white text-sm mb-8 px-2">
        <span className="font-semibold">9:41</span>
        <div className="flex items-center gap-1">
          <div className="flex gap-0.5">
            <div className="w-1 h-2 bg-white rounded-sm" />
            <div className="w-1 h-3 bg-white rounded-sm" />
            <div className="w-1 h-4 bg-white rounded-sm" />
            <div className="w-1 h-3 bg-white/50 rounded-sm" />
          </div>
          <span className="ml-1">5G</span>
          <div className="ml-2 w-6 h-3 border border-white rounded-sm relative">
            <div className="absolute inset-0.5 right-1 bg-white rounded-sm" />
            <div className="absolute -right-0.5 top-1 w-0.5 h-1 bg-white rounded-r" />
          </div>
        </div>
      </div>

      {/* Title */}
      <div className="text-center mb-8">
        <h1 className="text-white text-2xl font-bold mb-2">iOS Live Activities</h1>
        <p className="text-white/60 text-sm">Queue status on your Lock Screen</p>
      </div>

      {/* Live Activity Variants */}
      <div className="flex flex-col items-center gap-8">
        <LiveActivityPreview {...mockData} variant="expanded" />
        <LiveActivityPreview {...mockData} variant="compact" />
        <LiveActivityPreview {...mockData} variant="minimal" />
      </div>

      {/* Description */}
      <div className="mt-10 bg-white/5 rounded-2xl p-4 border border-white/10">
        <h2 className="text-white font-semibold mb-2">Features</h2>
        <ul className="text-white/70 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Real-time position updates without unlocking</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Estimated wait time countdown</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Dynamic Island integration for quick glances</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Tap to open full queue status</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
