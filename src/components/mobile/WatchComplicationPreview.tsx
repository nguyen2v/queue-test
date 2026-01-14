import { motion } from "framer-motion";
import { Clock, Users, ChevronRight } from "lucide-react";

interface WatchComplicationProps {
  queueNumber: string;
  position: number;
  estimatedWait: number;
  serviceName: string;
}

// Circular Small Complication
export function CircularSmallComplication({ position, estimatedWait }: WatchComplicationProps) {
  const progress = Math.max(0, Math.min(100, ((10 - position) / 10) * 100));
  
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] text-muted-foreground">Circular Small</p>
      <div className="relative w-14 h-14">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="currentColor"
            strokeWidth="3"
            className="text-white/20"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="15"
            fill="none"
            stroke="url(#gradient)"
            strokeWidth="3"
            strokeLinecap="round"
            strokeDasharray={`${progress} 100`}
            initial={{ strokeDasharray: "0 100" }}
            animate={{ strokeDasharray: `${progress} 100` }}
            transition={{ duration: 1 }}
          />
          <defs>
            <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.6)" />
            </linearGradient>
          </defs>
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-white text-lg font-bold leading-none">#{position}</span>
          <span className="text-white/60 text-[8px]">{estimatedWait}m</span>
        </div>
      </div>
    </div>
  );
}

// Circular Large Complication (Infograph style)
export function CircularLargeComplication({ queueNumber, position, estimatedWait }: WatchComplicationProps) {
  const progress = Math.max(0, Math.min(100, ((10 - position) / 10) * 100));
  
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] text-muted-foreground">Circular Large</p>
      <div className="relative w-24 h-24">
        {/* Background ring */}
        <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-white/10"
          />
          <motion.circle
            cx="18"
            cy="18"
            r="16"
            fill="none"
            stroke="hsl(var(--primary))"
            strokeWidth="2"
            strokeLinecap="round"
            strokeDasharray={`${progress} 100`}
            initial={{ strokeDasharray: "0 100" }}
            animate={{ strokeDasharray: `${progress} 100` }}
            transition={{ duration: 1 }}
          />
        </svg>
        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <div className="w-8 h-8 rounded-lg bg-primary/30 flex items-center justify-center mb-1">
            <span className="text-[10px] font-bold text-primary">{queueNumber}</span>
          </div>
          <span className="text-white text-xl font-bold leading-none">#{position}</span>
          <div className="flex items-center gap-0.5 mt-0.5">
            <Clock className="w-2.5 h-2.5 text-primary" />
            <span className="text-white/70 text-[10px]">{estimatedWait} min</span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Rectangular Complication
export function RectangularComplication({ queueNumber, position, estimatedWait, serviceName }: WatchComplicationProps) {
  const progress = Math.max(0, Math.min(100, ((10 - position) / 10) * 100));
  
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] text-muted-foreground">Rectangular</p>
      <div className="bg-black/80 rounded-2xl p-3 w-44 border border-white/10">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded-md bg-primary flex items-center justify-center">
              <Users className="w-3 h-3 text-primary-foreground" />
            </div>
            <span className="text-white text-xs font-medium">Queue</span>
          </div>
          <span className="text-primary text-xs font-bold">{queueNumber}</span>
        </div>
        <div className="flex items-baseline justify-between mb-2">
          <div>
            <span className="text-white text-2xl font-bold">#{position}</span>
            <span className="text-white/50 text-xs ml-1">in line</span>
          </div>
          <div className="text-right">
            <span className="text-white text-lg font-semibold">{estimatedWait}</span>
            <span className="text-white/50 text-xs ml-0.5">min</span>
          </div>
        </div>
        {/* Progress bar */}
        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 1 }}
            className="h-full bg-gradient-to-r from-primary to-primary/60 rounded-full"
          />
        </div>
        <p className="text-white/40 text-[9px] mt-1 truncate">{serviceName}</p>
      </div>
    </div>
  );
}

// Corner Complication (Modular watch face)
export function CornerComplication({ position, estimatedWait }: WatchComplicationProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] text-muted-foreground">Corner</p>
      <div className="flex items-center gap-1 bg-black/60 rounded-full px-2 py-1">
        <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
          <span className="text-[8px] font-bold text-primary-foreground">#{position}</span>
        </div>
        <span className="text-white text-xs font-medium">{estimatedWait}m</span>
      </div>
    </div>
  );
}

// Extra Large Complication (Full watch face widget)
export function ExtraLargeComplication({ queueNumber, position, estimatedWait, serviceName }: WatchComplicationProps) {
  const progress = Math.max(0, Math.min(100, ((10 - position) / 10) * 100));
  
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] text-muted-foreground">Extra Large / Widget</p>
      <div className="bg-black rounded-[28px] p-4 w-48 border border-white/10 shadow-xl">
        {/* Header */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="w-8 h-8 rounded-xl bg-primary flex items-center justify-center"
            >
              <Users className="w-4 h-4 text-primary-foreground" />
            </motion.div>
            <div>
              <p className="text-white text-xs font-semibold">Queue Status</p>
              <p className="text-white/50 text-[9px]">{serviceName}</p>
            </div>
          </div>
          <motion.div
            animate={{ opacity: [1, 0.5, 1] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
            className="w-2 h-2 bg-green-400 rounded-full"
          />
        </div>

        {/* Main stats */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex-1">
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Position</p>
            <p className="text-white text-3xl font-bold">#{position}</p>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex-1 text-right">
            <p className="text-white/50 text-[9px] uppercase tracking-wider">Wait</p>
            <div className="flex items-baseline justify-end gap-0.5">
              <span className="text-white text-3xl font-bold">{estimatedWait}</span>
              <span className="text-white/50 text-xs">m</span>
            </div>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-2">
          <div className="h-2 bg-white/10 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 1, ease: "easeOut" }}
              className="h-full bg-gradient-to-r from-primary via-primary to-primary/50 rounded-full"
            />
          </div>
        </div>

        {/* Queue number badge */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1 px-2 py-1 bg-primary/20 rounded-full">
            <span className="text-primary text-xs font-bold">{queueNumber}</span>
          </div>
          <div className="flex items-center gap-0.5 text-white/40 text-[9px]">
            <span>Tap to view</span>
            <ChevronRight className="w-3 h-3" />
          </div>
        </div>
      </div>
    </div>
  );
}

// Inline Complication (Modular/Infograph watch faces)
export function InlineComplication({ position, estimatedWait }: WatchComplicationProps) {
  return (
    <div className="flex flex-col items-center gap-1">
      <p className="text-[10px] text-muted-foreground">Inline</p>
      <div className="flex items-center gap-2 text-white">
        <Users className="w-3 h-3 text-primary" />
        <span className="text-xs font-medium">Queue #{position}</span>
        <span className="text-white/50 text-xs">•</span>
        <span className="text-xs text-white/70">{estimatedWait}m wait</span>
      </div>
    </div>
  );
}

// Full Watch Face Preview
export function WatchFacePreview({ queueNumber, position, estimatedWait, serviceName }: WatchComplicationProps) {
  const progress = Math.max(0, Math.min(100, ((10 - position) / 10) * 100));
  
  return (
    <div className="flex flex-col items-center gap-2">
      <p className="text-xs text-muted-foreground">Watch Face Preview</p>
      <div className="relative">
        {/* Watch bezel */}
        <div className="w-52 h-52 rounded-full bg-gradient-to-b from-zinc-700 to-zinc-900 p-1 shadow-2xl">
          {/* Watch screen */}
          <div className="w-full h-full rounded-full bg-black overflow-hidden relative">
            {/* Time */}
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-white text-4xl font-light tracking-tight">10:09</span>
            </div>
            
            {/* Top complication - Queue status */}
            <div className="absolute top-6 left-1/2 -translate-x-1/2">
              <div className="flex items-center gap-1.5 bg-white/10 rounded-full px-2 py-0.5">
                <div className="w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-[7px] font-bold text-primary-foreground">#{position}</span>
                </div>
                <span className="text-white text-[10px] font-medium">{estimatedWait}m</span>
              </div>
            </div>

            {/* Bottom large complication */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-32">
              <div className="bg-white/5 rounded-xl p-2 backdrop-blur-sm">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-white/70 text-[8px]">Queue</span>
                  <span className="text-primary text-[8px] font-bold">{queueNumber}</span>
                </div>
                <div className="h-1 bg-white/10 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 1 }}
                    className="h-full bg-primary rounded-full"
                  />
                </div>
              </div>
            </div>

            {/* Left complication */}
            <div className="absolute left-4 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 rounded-full border-2 border-white/20 flex items-center justify-center">
                <Users className="w-4 h-4 text-primary" />
              </div>
            </div>

            {/* Right complication */}
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <div className="w-10 h-10 rounded-full border-2 border-primary/50 flex items-center justify-center relative">
                <svg className="absolute inset-0 -rotate-90" viewBox="0 0 36 36">
                  <circle
                    cx="18"
                    cy="18"
                    r="15"
                    fill="none"
                    stroke="hsl(var(--primary))"
                    strokeWidth="2"
                    strokeDasharray={`${progress} 100`}
                    strokeLinecap="round"
                  />
                </svg>
                <span className="text-white text-xs font-bold">{position}</span>
              </div>
            </div>
          </div>
        </div>
        
        {/* Digital Crown */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1 w-2 h-8 bg-zinc-700 rounded-r-sm" />
        {/* Side button */}
        <div className="absolute right-0 top-[65%] translate-x-1 w-2 h-4 bg-zinc-700 rounded-r-sm" />
      </div>
    </div>
  );
}

// Complete Showcase
export function WatchComplicationShowcase() {
  const mockData: WatchComplicationProps = {
    queueNumber: "A-042",
    position: 3,
    estimatedWait: 12,
    serviceName: "General Consultation",
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-zinc-900 to-zinc-800 p-6 pb-24">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-500 to-pink-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">⌚</span>
          </div>
          <h1 className="text-white text-2xl font-bold">watchOS Complications</h1>
        </div>
        <p className="text-white/60 text-sm">Queue status at a glance on Apple Watch</p>
      </div>

      {/* Watch Face Preview */}
      <div className="flex justify-center mb-10">
        <WatchFacePreview {...mockData} />
      </div>

      {/* Complication Types Grid */}
      <div className="space-y-6">
        <h2 className="text-white/80 text-sm font-semibold uppercase tracking-wider text-center">
          Complication Styles
        </h2>
        
        <div className="grid grid-cols-2 gap-6 justify-items-center">
          <CircularSmallComplication {...mockData} />
          <CornerComplication {...mockData} />
        </div>

        <div className="flex justify-center">
          <CircularLargeComplication {...mockData} />
        </div>

        <div className="flex justify-center">
          <InlineComplication {...mockData} />
        </div>

        <div className="flex justify-center">
          <RectangularComplication {...mockData} />
        </div>

        <div className="flex justify-center">
          <ExtraLargeComplication {...mockData} />
        </div>
      </div>

      {/* Features */}
      <div className="mt-10 bg-white/5 rounded-2xl p-4 border border-white/10">
        <h2 className="text-white font-semibold mb-2">Complication Features</h2>
        <ul className="text-white/70 text-sm space-y-2">
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Glanceable queue position on any watch face</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Progress ring shows how close you are</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Haptic tap when your turn is near</span>
          </li>
          <li className="flex items-start gap-2">
            <div className="w-1.5 h-1.5 rounded-full bg-primary mt-1.5" />
            <span>Tap to open full queue app</span>
          </li>
        </ul>
      </div>
    </div>
  );
}
