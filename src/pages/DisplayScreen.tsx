import { useEffect, useState } from 'react';
import { useQueueStore } from '@/store/queueStore';
import { Clock, MapPin, Users, Bell, Monitor, Columns, Maximize } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

type LayoutMode = 'standard' | 'compact' | 'kiosk';

const DisplayScreen = () => {
  const { queue } = useQueueStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [layoutMode, setLayoutMode] = useState<LayoutMode>('standard');
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // Auto-hide controls in kiosk mode
  useEffect(() => {
    if (layoutMode === 'kiosk') {
      const timer = setTimeout(() => setShowControls(false), 3000);
      return () => clearTimeout(timer);
    } else {
      setShowControls(true);
    }
  }, [layoutMode]);

  // Fullscreen toggle
  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        await document.documentElement.requestFullscreen();
        setIsFullscreen(true);
      } else {
        await document.exitFullscreen();
        setIsFullscreen(false);
      }
    } catch (err) {
      console.log('Fullscreen not supported');
    }
  };

  // Listen for fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const inService = queue.filter(p => p.status === 'in-service');
  const waiting = queue.filter(p => p.status === 'waiting');
  const totalWaiting = queue.filter(p => p.status === 'waiting' || p.status === 'checked-in').length;

  return (
    <div 
      className={cn(
        "min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white overflow-hidden relative",
        layoutMode === 'kiosk' && "cursor-none"
      )}
      onMouseMove={() => layoutMode === 'kiosk' && setShowControls(true)}
    >
      {/* Layout Controls */}
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-4 right-4 z-50 flex gap-2"
          >
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayoutMode('compact')}
              className={cn(
                "text-white/70 hover:text-white hover:bg-white/10",
                layoutMode === 'compact' && "bg-white/20 text-white"
              )}
            >
              <Columns className="h-4 w-4 mr-1.5" />
              Compact
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLayoutMode('standard')}
              className={cn(
                "text-white/70 hover:text-white hover:bg-white/10",
                layoutMode === 'standard' && "bg-white/20 text-white"
              )}
            >
              <Monitor className="h-4 w-4 mr-1.5" />
              Standard
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setLayoutMode('kiosk');
                if (!isFullscreen) toggleFullscreen();
              }}
              className={cn(
                "text-white/70 hover:text-white hover:bg-white/10",
                layoutMode === 'kiosk' && "bg-white/20 text-white"
              )}
            >
              <Maximize className="h-4 w-4 mr-1.5" />
              Kiosk
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Header */}
      <header className={cn(
        "flex items-center justify-between",
        layoutMode === 'compact' ? "p-4" : "p-8",
        layoutMode === 'kiosk' && "p-6"
      )}>
        <div className="flex items-center gap-4">
          <div className={cn(
            "rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center",
            layoutMode === 'compact' ? "w-10 h-10" : "w-12 h-12"
          )}>
            <span className={cn("font-bold", layoutMode === 'compact' ? "text-xl" : "text-2xl")}>Q</span>
          </div>
          <div>
            <h1 className={cn(
              "font-display font-bold",
              layoutMode === 'compact' ? "text-2xl" : "text-3xl"
            )}>QueueCare</h1>
            <p className="text-slate-400">City Medical Center</p>
          </div>
        </div>
        <div className="text-right">
          <div className={cn(
            "font-display font-bold tabular-nums",
            layoutMode === 'compact' ? "text-3xl" : layoutMode === 'kiosk' ? "text-5xl" : "text-4xl"
          )}>
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-slate-400">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      {/* Layout Content */}
      {layoutMode === 'compact' ? (
        <CompactLayout 
          inService={inService} 
          waiting={waiting.slice(0, 5)} 
          totalWaiting={totalWaiting} 
        />
      ) : layoutMode === 'kiosk' ? (
        <KioskLayout 
          inService={inService} 
          waiting={waiting.slice(0, 6)} 
          totalWaiting={totalWaiting} 
        />
      ) : (
        <StandardLayout 
          inService={inService} 
          waiting={waiting.slice(0, 5)} 
          totalWaiting={totalWaiting} 
        />
      )}

      {/* Footer */}
      <footer className={cn(
        "absolute bottom-0 left-0 right-0 bg-slate-800/50 border-t border-slate-700/50 backdrop-blur-sm",
        layoutMode === 'compact' ? "p-3" : "p-4"
      )}>
        <div className="flex items-center justify-between text-slate-400">
          <p>Please listen for your queue number to be called</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Queue Updates
          </p>
        </div>
      </footer>
    </div>
  );
};

// Standard Layout - Two Column (Original)
const StandardLayout = ({ 
  inService, 
  waiting, 
  totalWaiting 
}: { 
  inService: any[]; 
  waiting: any[]; 
  totalWaiting: number 
}) => (
  <div className="grid grid-cols-3 gap-8 h-[calc(100vh-12rem)] px-8">
    {/* Now Serving - Main Section */}
    <div className="col-span-2 bg-slate-800/50 rounded-3xl p-8 backdrop-blur-sm border border-slate-700/50">
      <div className="flex items-center gap-3 mb-6">
        <Bell className="w-8 h-8 text-teal-400" />
        <h2 className="text-2xl font-display font-semibold text-slate-200">Now Serving</h2>
      </div>
      
      <div className="grid grid-cols-2 gap-6 h-[calc(100%-4rem)]">
        <AnimatePresence mode="popLayout">
          {inService.length > 0 ? (
            inService.slice(0, 4).map((patient, index) => (
              <NowServingCard key={patient.id} patient={patient} index={index} size="standard" />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 flex items-center justify-center text-slate-500 text-2xl"
            >
              No patients currently being served
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Right Sidebar */}
    <div className="flex flex-col gap-6">
      <StatsCard inServiceCount={inService.length} totalWaiting={totalWaiting} />
      <NextUpList waiting={waiting} />
    </div>
  </div>
);

// Compact Layout - Single Column for smaller screens
const CompactLayout = ({ 
  inService, 
  waiting, 
  totalWaiting 
}: { 
  inService: any[]; 
  waiting: any[]; 
  totalWaiting: number 
}) => (
  <div className="max-w-2xl mx-auto px-4 pb-20 space-y-4">
    {/* Stats Row */}
    <div className="grid grid-cols-2 gap-3">
      <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
        <div className="text-3xl font-display font-bold text-teal-400">{inService.length}</div>
        <div className="text-slate-400 text-sm">Being Served</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-4 text-center border border-slate-700/50">
        <div className="text-3xl font-display font-bold text-coral">{totalWaiting}</div>
        <div className="text-slate-400 text-sm">Waiting</div>
      </div>
    </div>

    {/* Now Serving - Compact */}
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Bell className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-display font-semibold text-slate-200">Now Serving</h2>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {inService.length > 0 ? (
            inService.slice(0, 2).map((patient, index) => (
              <NowServingCard key={patient.id} patient={patient} index={index} size="compact" />
            ))
          ) : (
            <div className="text-center text-slate-500 py-4 text-sm">
              No patients currently being served
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Next Up - Compact List */}
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Clock className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-display font-semibold text-slate-200">Next Up</h2>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {waiting.length > 0 ? (
            waiting.map((patient, index) => (
              <motion.div
                key={patient.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 10 }}
                transition={{ delay: index * 0.05 }}
                className={cn(
                  "flex items-center justify-between p-3 rounded-xl",
                  index === 0 ? "bg-amber-500/20 border border-amber-500/30" : "bg-slate-700/30"
                )}
              >
                <div className="flex items-center gap-3">
                  <span className={cn(
                    "font-mono font-bold text-xl",
                    index === 0 ? "text-amber-400" : "text-slate-300"
                  )}>
                    {patient.queueNumber}
                  </span>
                  <span className="text-slate-200 text-sm truncate max-w-[120px]">
                    {patient.patientName}
                  </span>
                </div>
                <div className="flex items-center gap-1 text-slate-500 text-xs">
                  <MapPin className="h-3 w-3" />
                  {patient.location}
                </div>
              </motion.div>
            ))
          ) : (
            <div className="text-center text-slate-500 py-4 text-sm">
              No patients waiting
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  </div>
);

// Kiosk Layout - Fullscreen optimized with large numbers
const KioskLayout = ({ 
  inService, 
  waiting, 
  totalWaiting 
}: { 
  inService: any[]; 
  waiting: any[]; 
  totalWaiting: number 
}) => (
  <div className="h-[calc(100vh-10rem)] px-10 grid grid-cols-5 gap-8">
    {/* Now Serving - Takes 3 columns with huge numbers */}
    <div className="col-span-3 bg-slate-800/50 rounded-3xl p-8 border border-slate-700/50 flex flex-col">
      <div className="flex items-center gap-4 mb-6">
        <Bell className="w-10 h-10 text-teal-400" />
        <h2 className="text-3xl font-display font-semibold text-slate-200">Now Serving</h2>
      </div>
      
      <div className="flex-1 grid grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {inService.length > 0 ? (
            inService.slice(0, 4).map((patient, index) => (
              <NowServingCard key={patient.id} patient={patient} index={index} size="kiosk" />
            ))
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-2 flex items-center justify-center text-slate-500 text-3xl"
            >
              No patients currently being served
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>

    {/* Right Side - Stats + Next Up */}
    <div className="col-span-2 flex flex-col gap-6">
      {/* Large Stats */}
      <div className="bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-6xl font-display font-bold text-teal-400">{inService.length}</div>
            <div className="text-slate-400 text-lg mt-2">Being Served</div>
          </div>
          <div className="bg-slate-700/50 rounded-2xl p-6 text-center">
            <div className="text-6xl font-display font-bold text-coral">{totalWaiting}</div>
            <div className="text-slate-400 text-lg mt-2">Waiting</div>
          </div>
        </div>
      </div>

      {/* Next Up - Large */}
      <div className="flex-1 bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50 overflow-hidden">
        <div className="flex items-center gap-3 mb-4">
          <Clock className="w-8 h-8 text-amber-400" />
          <h3 className="text-2xl font-display font-semibold text-slate-200">Next Up</h3>
        </div>
        
        <div className="space-y-3">
          <AnimatePresence mode="popLayout">
            {waiting.length > 0 ? (
              waiting.map((patient, index) => (
                <motion.div
                  key={patient.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "flex items-center justify-between p-4 rounded-2xl",
                    index === 0 ? "bg-amber-500/20 border border-amber-500/30" : "bg-slate-700/30"
                  )}
                >
                  <div className="flex items-center gap-4">
                    <span className={cn(
                      "font-mono font-bold text-4xl",
                      index === 0 ? "text-amber-400" : "text-slate-300"
                    )}>
                      {patient.queueNumber}
                    </span>
                    <div>
                      <div className="text-slate-200 text-xl font-medium">{patient.patientName}</div>
                      <div className="text-slate-500">{patient.serviceType}</div>
                    </div>
                  </div>
                  {index === 0 && (
                    <span className="text-amber-400 text-lg font-medium animate-pulse">
                      Next
                    </span>
                  )}
                </motion.div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-8 text-xl">
                No patients waiting
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
);

// Reusable Now Serving Card
const NowServingCard = ({ 
  patient, 
  index, 
  size 
}: { 
  patient: any; 
  index: number; 
  size: 'standard' | 'compact' | 'kiosk' 
}) => {
  const sizeStyles = {
    standard: "rounded-2xl p-6",
    compact: "rounded-xl p-4",
    kiosk: "rounded-3xl p-8"
  };

  const numberStyles = {
    standard: "text-6xl",
    compact: "text-4xl",
    kiosk: "text-8xl"
  };

  const nameStyles = {
    standard: "text-xl",
    compact: "text-base",
    kiosk: "text-2xl"
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className={cn(
        "bg-gradient-to-br from-teal-600/20 to-teal-700/10 border border-teal-500/30 flex flex-col justify-between",
        sizeStyles[size]
      )}
    >
      <div>
        <div className="flex items-center gap-2 mb-2">
          <div className={cn(
            "rounded-full bg-teal-500 animate-pulse",
            size === 'compact' ? "w-2 h-2" : "w-3 h-3"
          )} />
          <span className={cn(
            "text-teal-400 font-medium",
            size === 'compact' ? "text-sm" : "text-base"
          )}>In Service</span>
        </div>
        <div className={cn("font-display font-bold text-white mb-2", numberStyles[size])}>
          {patient.queueNumber}
        </div>
        <div className={cn("text-slate-300 truncate", nameStyles[size])}>
          {patient.patientName}
        </div>
      </div>
      <div className={cn(
        "flex items-center gap-2 text-slate-400 mt-4",
        size === 'compact' && "mt-2"
      )}>
        <MapPin className={size === 'compact' ? "w-4 h-4" : "w-5 h-5"} />
        <span className={size === 'compact' ? "text-sm" : "text-lg"}>{patient.location}</span>
      </div>
    </motion.div>
  );
};

// Stats Card Component
const StatsCard = ({ inServiceCount, totalWaiting }: { inServiceCount: number; totalWaiting: number }) => (
  <div className="bg-slate-800/50 rounded-3xl p-6 backdrop-blur-sm border border-slate-700/50">
    <div className="flex items-center gap-3 mb-4">
      <Users className="w-6 h-6 text-coral" />
      <h3 className="text-xl font-display font-semibold text-slate-200">Queue Status</h3>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-slate-700/50 rounded-xl p-4 text-center">
        <div className="text-4xl font-display font-bold text-teal-400">{inServiceCount}</div>
        <div className="text-slate-400 text-sm">Being Served</div>
      </div>
      <div className="bg-slate-700/50 rounded-xl p-4 text-center">
        <div className="text-4xl font-display font-bold text-coral">{totalWaiting}</div>
        <div className="text-slate-400 text-sm">Waiting</div>
      </div>
    </div>
  </div>
);

// Next Up List Component
const NextUpList = ({ waiting }: { waiting: any[] }) => (
  <div className="bg-slate-800/50 rounded-3xl p-6 backdrop-blur-sm border border-slate-700/50 flex-1">
    <div className="flex items-center gap-3 mb-4">
      <Clock className="w-6 h-6 text-amber-400" />
      <h3 className="text-xl font-display font-semibold text-slate-200">Next Up</h3>
    </div>
    
    <div className="space-y-3">
      <AnimatePresence mode="popLayout">
        {waiting.length > 0 ? (
          waiting.map((patient, index) => (
            <motion.div
              key={patient.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2, delay: index * 0.05 }}
              className={cn(
                "flex items-center justify-between p-4 rounded-xl",
                index === 0 ? "bg-amber-500/20 border border-amber-500/30" : "bg-slate-700/30"
              )}
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "text-3xl font-display font-bold",
                  index === 0 ? "text-amber-400" : "text-slate-300"
                )}>
                  {patient.queueNumber}
                </div>
                <div>
                  <div className="text-slate-200 font-medium">{patient.patientName}</div>
                  <div className="text-slate-500 text-sm">{patient.serviceType}</div>
                </div>
              </div>
              {index === 0 && (
                <span className="text-amber-400 text-sm font-medium animate-pulse">
                  Next
                </span>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-8">
            No patients waiting
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default DisplayScreen;
