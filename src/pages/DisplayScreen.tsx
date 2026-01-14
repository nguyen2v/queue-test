import { useEffect, useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQueueStore } from '@/store/queueStore';
import { Clock, MapPin, Users, Bell, Monitor, Columns, Maximize, Layers, User, PauseCircle, XCircle, Building2, ChevronDown, Focus } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import { Lane, QueueEntry } from '@/types/queue';
import logo from "@/assets/logo.png";

type LayoutMode = 'standard' | 'compact' | 'kiosk';

const DisplayScreen = () => {
  const [searchParams] = useSearchParams();
  const { queue, lanes } = useQueueStore();
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showControls, setShowControls] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedLaneId, setSelectedLaneId] = useState<string>('all');

  // URL Parameters
  const locationFilter = searchParams.get('location');
  const modeParam = searchParams.get('mode') as LayoutMode | null;
  const [layoutMode, setLayoutMode] = useState<LayoutMode>(
    modeParam && ['standard', 'compact', 'kiosk'].includes(modeParam) ? modeParam : 'standard'
  );

  // Filter lanes and queue by location
  const filteredLanes = useMemo(() => {
    if (!locationFilter) return lanes;
    return lanes.filter(lane => 
      lane.location?.toLowerCase().includes(locationFilter.toLowerCase())
    );
  }, [lanes, locationFilter]);

  const filteredQueue = useMemo(() => {
    if (!locationFilter) return queue;
    const locationLaneNames = filteredLanes.map(l => l.name);
    return queue.filter(entry => 
      !entry.lane || locationLaneNames.includes(entry.lane)
    );
  }, [queue, filteredLanes, locationFilter]);

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

  const inService = filteredQueue.filter(p => p.status === 'in-service');
  const waiting = filteredQueue.filter(p => p.status === 'waiting');
  const totalWaiting = filteredQueue.filter(p => p.status === 'waiting' || p.status === 'checked-in').length;
  const openLanes = filteredLanes.filter(l => l.status === 'open').length;

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
            className="absolute top-4 right-4 z-50 flex gap-2 items-center"
          >
            {/* Lane Filter */}
            <Select value={selectedLaneId} onValueChange={setSelectedLaneId}>
              <SelectTrigger className="w-[180px] bg-slate-800/80 border-slate-600 text-white hover:bg-slate-700/80">
                <SelectValue placeholder="Select Lane" />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-600">
                <SelectItem value="all" className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4" />
                    All Lanes
                  </div>
                </SelectItem>
                {filteredLanes.map(lane => (
                  <SelectItem 
                    key={lane.id} 
                    value={lane.id}
                    className="text-white hover:bg-slate-700 focus:bg-slate-700 focus:text-white"
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn(
                        "w-2 h-2 rounded-full",
                        lane.status === 'open' && "bg-emerald-500",
                        lane.status === 'break' && "bg-amber-500",
                        lane.status === 'closed' && "bg-slate-500"
                      )} />
                      {lane.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="h-6 w-px bg-slate-600" />

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
          <img 
            src={logo} 
            alt="QueueCare" 
            className={cn(
              "rounded-xl",
              layoutMode === 'compact' ? "w-10 h-10" : "w-12 h-12"
            )}
          />
          <div>
            <h1 className={cn(
              "font-display font-bold",
              layoutMode === 'compact' ? "text-2xl" : "text-3xl"
            )}>QueueCare</h1>
            <div className="flex items-center gap-2 text-slate-400">
              <span>City Medical Center</span>
              {locationFilter && (
                <span className="flex items-center gap-1 text-teal-400 bg-teal-400/10 px-2 py-0.5 rounded-full text-sm">
                  <Building2 className="w-3 h-3" />
                  {locationFilter}
                </span>
              )}
            </div>
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
      {selectedLaneId !== 'all' ? (
        <FocusedLaneLayout 
          lane={filteredLanes.find(l => l.id === selectedLaneId)}
          patient={inService.find(p => p.lane === filteredLanes.find(l => l.id === selectedLaneId)?.name)}
          waiting={waiting.slice(0, 3)}
          totalWaiting={totalWaiting}
        />
      ) : layoutMode === 'compact' ? (
        <CompactLayout 
          inService={inService} 
          waiting={waiting.slice(0, 5)} 
          totalWaiting={totalWaiting}
          lanes={filteredLanes}
          openLanes={openLanes}
        />
      ) : layoutMode === 'kiosk' ? (
        <KioskLayout 
          inService={inService} 
          waiting={waiting.slice(0, 6)} 
          totalWaiting={totalWaiting}
          lanes={filteredLanes}
          openLanes={openLanes}
        />
      ) : (
        <StandardLayout 
          inService={inService} 
          waiting={waiting.slice(0, 5)} 
          totalWaiting={totalWaiting}
          lanes={filteredLanes}
          openLanes={openLanes}
        />
      )}

      {/* Footer */}
      <footer className={cn(
        "absolute bottom-0 left-0 right-0 bg-slate-800/50 border-t border-slate-700/50 backdrop-blur-sm",
        layoutMode === 'compact' ? "p-3" : "p-4"
      )}>
        <div className="flex items-center justify-between text-slate-400">
          <p>Please listen for your queue number and proceed to the indicated lane</p>
          <p className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live Queue Updates
          </p>
        </div>
      </footer>
    </div>
  );
};

// Standard Layout - Multi-Lane Display
const StandardLayout = ({ 
  inService, 
  waiting, 
  totalWaiting,
  lanes,
  openLanes
}: { 
  inService: QueueEntry[]; 
  waiting: QueueEntry[]; 
  totalWaiting: number;
  lanes: Lane[];
  openLanes: number;
}) => (
  <div className="grid grid-cols-4 gap-6 h-[calc(100vh-12rem)] px-8">
    {/* Lane Status Grid - Takes 3 columns */}
    <div className="col-span-3 bg-slate-800/50 rounded-3xl p-6 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <Layers className="w-7 h-7 text-teal-400" />
          <h2 className="text-2xl font-display font-semibold text-slate-200">Now Serving by Lane</h2>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-500"></span>
            Open ({openLanes})
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-amber-500"></span>
            Break
          </span>
          <span className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-slate-500"></span>
            Closed
          </span>
        </div>
      </div>
      
      <div className="grid grid-cols-3 gap-4 h-[calc(100%-3rem)]">
        <AnimatePresence mode="popLayout">
          {lanes.map((lane, index) => {
            const currentPatient = inService.find(p => p.lane === lane.name);
            return (
              <LaneCard 
                key={lane.id} 
                lane={lane} 
                patient={currentPatient} 
                index={index}
                size="standard"
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>

    {/* Right Sidebar - Stats + Next Up */}
    <div className="flex flex-col gap-4">
      <StatsCard 
        inServiceCount={inService.length} 
        totalWaiting={totalWaiting}
        openLanes={openLanes}
        totalLanes={lanes.length}
      />
      <NextUpList waiting={waiting} size="compact" />
    </div>
  </div>
);

// Compact Layout - Single Column for smaller screens
const CompactLayout = ({ 
  inService, 
  waiting, 
  totalWaiting,
  lanes,
  openLanes
}: { 
  inService: QueueEntry[]; 
  waiting: QueueEntry[]; 
  totalWaiting: number;
  lanes: Lane[];
  openLanes: number;
}) => (
  <div className="max-w-2xl mx-auto px-4 pb-20 space-y-4">
    {/* Stats Row */}
    <div className="grid grid-cols-3 gap-2">
      <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
        <div className="text-2xl font-display font-bold text-teal-400">{inService.length}</div>
        <div className="text-slate-400 text-xs">Serving</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
        <div className="text-2xl font-display font-bold text-coral">{totalWaiting}</div>
        <div className="text-slate-400 text-xs">Waiting</div>
      </div>
      <div className="bg-slate-800/50 rounded-xl p-3 text-center border border-slate-700/50">
        <div className="text-2xl font-display font-bold text-emerald-400">{openLanes}</div>
        <div className="text-slate-400 text-xs">Lanes Open</div>
      </div>
    </div>

    {/* Active Lanes - Compact */}
    <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
      <div className="flex items-center gap-2 mb-3">
        <Layers className="w-5 h-5 text-teal-400" />
        <h2 className="text-lg font-display font-semibold text-slate-200">Active Lanes</h2>
      </div>
      <div className="space-y-2">
        <AnimatePresence mode="popLayout">
          {lanes.filter(l => l.status === 'open').slice(0, 4).map((lane, index) => {
            const currentPatient = inService.find(p => p.lane === lane.name);
            return (
              <LaneCard 
                key={lane.id} 
                lane={lane} 
                patient={currentPatient} 
                index={index}
                size="compact"
              />
            );
          })}
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
                  <div>
                    <span className="text-slate-200 text-sm">{patient.patientName}</span>
                    <div className="text-slate-500 text-xs">{patient.serviceType}</div>
                  </div>
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

// Kiosk Layout - Fullscreen optimized with lane-based display
const KioskLayout = ({ 
  inService, 
  waiting, 
  totalWaiting,
  lanes,
  openLanes
}: { 
  inService: QueueEntry[]; 
  waiting: QueueEntry[]; 
  totalWaiting: number;
  lanes: Lane[];
  openLanes: number;
}) => (
  <div className="h-[calc(100vh-10rem)] px-8 grid grid-cols-5 gap-6">
    {/* Lane Grid - Takes 4 columns */}
    <div className="col-span-4 bg-slate-800/50 rounded-3xl p-6 border border-slate-700/50 flex flex-col overflow-hidden">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <Layers className="w-10 h-10 text-teal-400" />
          <h2 className="text-3xl font-display font-semibold text-slate-200">Now Serving</h2>
        </div>
        <div className="flex items-center gap-6 text-lg">
          <span className="flex items-center gap-2">
            <span className="w-4 h-4 rounded-full bg-emerald-500 animate-pulse"></span>
            {openLanes} Lanes Open
          </span>
          <span className="flex items-center gap-2 text-slate-400">
            <Users className="w-5 h-5" />
            {totalWaiting} Waiting
          </span>
        </div>
      </div>
      
      <div className="flex-1 grid grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {lanes.map((lane, index) => {
            const currentPatient = inService.find(p => p.lane === lane.name);
            return (
              <LaneCard 
                key={lane.id} 
                lane={lane} 
                patient={currentPatient} 
                index={index}
                size="kiosk"
              />
            );
          })}
        </AnimatePresence>
      </div>
    </div>

    {/* Right Side - Next Up */}
    <div className="flex flex-col gap-4">
      {/* Quick Stats */}
      <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-4xl font-display font-bold text-teal-400">{inService.length}</div>
            <div className="text-slate-400 text-sm">Serving</div>
          </div>
          <div className="bg-slate-700/50 rounded-xl p-4 text-center">
            <div className="text-4xl font-display font-bold text-coral">{totalWaiting}</div>
            <div className="text-slate-400 text-sm">Waiting</div>
          </div>
        </div>
      </div>

      {/* Next Up List */}
      <div className="flex-1 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 overflow-hidden">
        <div className="flex items-center gap-2 mb-4">
          <Clock className="w-6 h-6 text-amber-400" />
          <h3 className="text-xl font-display font-semibold text-slate-200">Next Up</h3>
        </div>
        
        <div className="space-y-2">
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
                    "flex items-center gap-3 p-3 rounded-xl",
                    index === 0 ? "bg-amber-500/20 border border-amber-500/30" : "bg-slate-700/30"
                  )}
                >
                  <span className={cn(
                    "font-mono font-bold text-2xl",
                    index === 0 ? "text-amber-400" : "text-slate-300"
                  )}>
                    {patient.queueNumber}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="text-slate-200 font-medium truncate">{patient.patientName}</div>
                    <div className="text-slate-500 text-sm truncate">{patient.serviceType}</div>
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="text-center text-slate-500 py-6">
                No patients waiting
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  </div>
);

// Focused Lane Layout - Single lane, larger display
const FocusedLaneLayout = ({ 
  lane, 
  patient,
  waiting,
  totalWaiting
}: { 
  lane?: Lane;
  patient?: QueueEntry;
  waiting: QueueEntry[];
  totalWaiting: number;
}) => {
  if (!lane) return null;

  const isOpen = lane.status === 'open';
  const isBreak = lane.status === 'break';
  const isClosed = lane.status === 'closed';

  return (
    <div className="h-[calc(100vh-12rem)] px-8 flex gap-6">
      {/* Main Focused Lane Display */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="flex-1 bg-slate-800/50 rounded-3xl p-8 border border-slate-700/50 flex flex-col items-center justify-center"
      >
        {/* Lane Header */}
        <div className="flex items-center gap-4 mb-8">
          <div className={cn(
            "w-6 h-6 rounded-full animate-pulse",
            isOpen && "bg-emerald-500",
            isBreak && "bg-amber-500",
            isClosed && "bg-slate-500"
          )} />
          <div className="flex items-center gap-3">
            <Focus className="w-8 h-8 text-teal-400" />
            <h2 className="text-4xl font-display font-bold text-white">{lane.name}</h2>
          </div>
          {lane.location && (
            <span className="text-slate-400 text-xl ml-4 flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              {lane.location}
            </span>
          )}
        </div>

        {/* Now Serving */}
        {patient ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <div className="text-slate-400 text-2xl mb-4 uppercase tracking-wider">Now Serving</div>
            <motion.div 
              key={patient.queueNumber}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="font-mono font-bold text-[12rem] leading-none text-teal-400 mb-6"
            >
              {patient.queueNumber}
            </motion.div>
            <div className="text-4xl text-white font-medium mb-3">{patient.patientName}</div>
            <div className="text-2xl text-slate-400">{patient.serviceType}</div>
          </motion.div>
        ) : isOpen ? (
          <div className="text-center">
            <div className="text-slate-400 text-2xl mb-4 uppercase tracking-wider">Status</div>
            <div className="text-6xl text-slate-300 font-medium">Ready</div>
            <div className="text-2xl text-slate-500 mt-4">Waiting for next patient</div>
          </div>
        ) : isBreak ? (
          <div className="text-center flex flex-col items-center">
            <PauseCircle className="w-32 h-32 text-amber-400 mb-6" />
            <div className="text-5xl text-amber-400 font-bold">On Break</div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center">
            <XCircle className="w-32 h-32 text-slate-500 mb-6" />
            <div className="text-5xl text-slate-500 font-bold">Closed</div>
          </div>
        )}

        {/* Staff Info */}
        {lane.assignedStaff && isOpen && (
          <div className="flex items-center gap-3 mt-8 pt-6 border-t border-slate-700/50 text-slate-400 text-xl">
            <User className="w-6 h-6" />
            <span>{lane.assignedStaff}</span>
          </div>
        )}
      </motion.div>

      {/* Sidebar - Next Up */}
      <div className="w-80 flex flex-col gap-4">
        {/* Stats */}
        <div className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
          <div className="grid grid-cols-1 gap-3">
            <div className="bg-slate-700/50 rounded-xl p-4 text-center">
              <div className="text-5xl font-display font-bold text-coral">{totalWaiting}</div>
              <div className="text-slate-400 text-sm mt-1">Waiting in Queue</div>
            </div>
          </div>
        </div>

        {/* Next Up List */}
        <div className="flex-1 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 overflow-hidden">
          <div className="flex items-center gap-2 mb-4">
            <Clock className="w-6 h-6 text-amber-400" />
            <h3 className="text-xl font-display font-semibold text-slate-200">Next Up</h3>
          </div>
          
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {waiting.length > 0 ? (
                waiting.map((waitingPatient, index) => (
                  <motion.div
                    key={waitingPatient.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ delay: index * 0.1 }}
                    className={cn(
                      "flex items-center gap-4 p-4 rounded-xl",
                      index === 0 ? "bg-amber-500/20 border border-amber-500/30" : "bg-slate-700/30"
                    )}
                  >
                    <span className={cn(
                      "font-mono font-bold text-3xl",
                      index === 0 ? "text-amber-400" : "text-slate-300"
                    )}>
                      {waitingPatient.queueNumber}
                    </span>
                    <div className="flex-1 min-w-0">
                      <div className="text-slate-200 font-medium text-lg truncate">{waitingPatient.patientName}</div>
                      <div className="text-slate-500 text-sm truncate">{waitingPatient.serviceType}</div>
                    </div>
                  </motion.div>
                ))
              ) : (
                <div className="text-center text-slate-500 py-6">
                  No patients waiting
                </div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
};

// Lane Card Component
const LaneCard = ({ 
  lane, 
  patient, 
  index,
  size
}: { 
  lane: Lane; 
  patient?: QueueEntry; 
  index: number;
  size: 'standard' | 'compact' | 'kiosk';
}) => {
  const isOpen = lane.status === 'open';
  const isBreak = lane.status === 'break';
  const isClosed = lane.status === 'closed';

  const sizeStyles = {
    standard: "rounded-2xl p-5",
    compact: "rounded-xl p-3 flex items-center gap-4",
    kiosk: "rounded-2xl p-6"
  };

  const numberStyles = {
    standard: "text-5xl",
    compact: "text-3xl",
    kiosk: "text-6xl"
  };

  const laneNameStyles = {
    standard: "text-lg",
    compact: "text-base",
    kiosk: "text-xl"
  };

  if (size === 'compact') {
    return (
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 10 }}
        transition={{ delay: index * 0.05 }}
        className={cn(
          "border flex items-center gap-4 p-3 rounded-xl",
          isOpen && patient && "bg-gradient-to-r from-teal-600/20 to-teal-700/10 border-teal-500/30",
          isOpen && !patient && "bg-slate-700/30 border-slate-600/30",
          isBreak && "bg-amber-500/10 border-amber-500/30",
          isClosed && "bg-slate-800/50 border-slate-700/30"
        )}
      >
        <div className="flex items-center gap-3 min-w-[100px]">
          <div className={cn(
            "w-2.5 h-2.5 rounded-full",
            isOpen && "bg-emerald-500",
            isBreak && "bg-amber-500",
            isClosed && "bg-slate-500"
          )} />
          <span className="font-semibold text-slate-200">{lane.name}</span>
        </div>
        
        {patient ? (
          <div className="flex-1 flex items-center gap-3">
            <span className="font-mono font-bold text-2xl text-teal-400">
              {patient.queueNumber}
            </span>
            <span className="text-slate-300 truncate">{patient.patientName}</span>
          </div>
        ) : isOpen ? (
          <span className="text-slate-500 text-sm">Ready for next patient</span>
        ) : isBreak ? (
          <span className="text-amber-400 text-sm flex items-center gap-1">
            <PauseCircle className="w-4 h-4" />
            On Break
          </span>
        ) : (
          <span className="text-slate-500 text-sm flex items-center gap-1">
            <XCircle className="w-4 h-4" />
            Closed
          </span>
        )}
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ delay: index * 0.05 }}
      className={cn(
        "border flex flex-col",
        sizeStyles[size],
        isOpen && patient && "bg-gradient-to-br from-teal-600/20 to-teal-700/10 border-teal-500/30",
        isOpen && !patient && "bg-slate-700/30 border-slate-600/30",
        isBreak && "bg-amber-500/10 border-amber-500/30",
        isClosed && "bg-slate-800/50 border-slate-700/30 opacity-60"
      )}
    >
      {/* Lane Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            "w-3 h-3 rounded-full",
            isOpen && "bg-emerald-500 animate-pulse",
            isBreak && "bg-amber-500",
            isClosed && "bg-slate-500"
          )} />
          <span className={cn("font-semibold text-slate-200", laneNameStyles[size])}>
            {lane.name}
          </span>
        </div>
        <span className="text-slate-500 text-sm">{lane.location}</span>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col justify-center">
        {patient ? (
          <>
            <div className={cn("font-mono font-bold text-teal-400 mb-1", numberStyles[size])}>
              {patient.queueNumber}
            </div>
            <div className={cn(
              "text-slate-300 truncate",
              size === 'kiosk' ? "text-xl" : "text-lg"
            )}>
              {patient.patientName}
            </div>
            <div className="text-slate-500 text-sm mt-1">{patient.serviceType}</div>
          </>
        ) : isOpen ? (
          <div className="text-center">
            <div className={cn("text-slate-500", size === 'kiosk' ? "text-lg" : "text-base")}>
              Ready for next patient
            </div>
          </div>
        ) : isBreak ? (
          <div className="text-center flex flex-col items-center gap-2">
            <PauseCircle className={cn("text-amber-400", size === 'kiosk' ? "w-12 h-12" : "w-8 h-8")} />
            <div className={cn("text-amber-400 font-medium", size === 'kiosk' ? "text-xl" : "text-base")}>
              On Break
            </div>
          </div>
        ) : (
          <div className="text-center flex flex-col items-center gap-2">
            <XCircle className={cn("text-slate-500", size === 'kiosk' ? "w-12 h-12" : "w-8 h-8")} />
            <div className={cn("text-slate-500 font-medium", size === 'kiosk' ? "text-xl" : "text-base")}>
              Closed
            </div>
          </div>
        )}
      </div>

      {/* Staff Info */}
      {lane.assignedStaff && isOpen && (
        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-slate-700/50 text-slate-400 text-sm">
          <User className="w-4 h-4" />
          <span className="truncate">{lane.assignedStaff}</span>
        </div>
      )}
    </motion.div>
  );
};

// Stats Card Component
const StatsCard = ({ 
  inServiceCount, 
  totalWaiting, 
  openLanes, 
  totalLanes 
}: { 
  inServiceCount: number; 
  totalWaiting: number;
  openLanes: number;
  totalLanes: number;
}) => (
  <div className="bg-slate-800/50 rounded-2xl p-4 backdrop-blur-sm border border-slate-700/50">
    <div className="flex items-center gap-2 mb-3">
      <Users className="w-5 h-5 text-coral" />
      <h3 className="text-base font-display font-semibold text-slate-200">Queue Status</h3>
    </div>
    <div className="grid grid-cols-2 gap-2">
      <div className="bg-slate-700/50 rounded-xl p-3 text-center">
        <div className="text-2xl font-display font-bold text-teal-400">{inServiceCount}</div>
        <div className="text-slate-400 text-xs">Serving</div>
      </div>
      <div className="bg-slate-700/50 rounded-xl p-3 text-center">
        <div className="text-2xl font-display font-bold text-coral">{totalWaiting}</div>
        <div className="text-slate-400 text-xs">Waiting</div>
      </div>
      <div className="col-span-2 bg-slate-700/50 rounded-xl p-3 text-center">
        <div className="text-2xl font-display font-bold text-emerald-400">
          {openLanes}<span className="text-lg text-slate-500">/{totalLanes}</span>
        </div>
        <div className="text-slate-400 text-xs">Lanes Open</div>
      </div>
    </div>
  </div>
);

// Next Up List Component
const NextUpList = ({ waiting, size = 'standard' }: { waiting: QueueEntry[]; size?: 'standard' | 'compact' }) => (
  <div className="flex-1 bg-slate-800/50 rounded-2xl p-4 backdrop-blur-sm border border-slate-700/50 overflow-hidden">
    <div className="flex items-center gap-2 mb-3">
      <Clock className="w-5 h-5 text-amber-400" />
      <h3 className="text-base font-display font-semibold text-slate-200">Next Up</h3>
    </div>
    
    <div className="space-y-2">
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
                "flex items-center justify-between p-3 rounded-xl",
                index === 0 ? "bg-amber-500/20 border border-amber-500/30" : "bg-slate-700/30"
              )}
            >
              <div className="flex items-center gap-3">
                <div className={cn(
                  "font-mono font-bold",
                  size === 'compact' ? "text-xl" : "text-2xl",
                  index === 0 ? "text-amber-400" : "text-slate-300"
                )}>
                  {patient.queueNumber}
                </div>
                <div className="min-w-0">
                  <div className="text-slate-200 text-sm font-medium truncate">{patient.patientName}</div>
                  <div className="text-slate-500 text-xs truncate">{patient.serviceType}</div>
                </div>
              </div>
              {index === 0 && (
                <span className="text-amber-400 text-xs font-medium animate-pulse">
                  Next
                </span>
              )}
            </motion.div>
          ))
        ) : (
          <div className="text-center text-slate-500 py-6 text-sm">
            No patients waiting
          </div>
        )}
      </AnimatePresence>
    </div>
  </div>
);

export default DisplayScreen;
