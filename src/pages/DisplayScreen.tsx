import { useEffect, useState } from 'react';
import { useQueueStore } from '@/store/queueStore';
import { StatusDot } from '@/components/queue/StatusDot';
import { Clock, MapPin, Users, Bell } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DisplayScreen = () => {
  const { queue } = useQueueStore();
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const inService = queue.filter(p => p.status === 'in-service');
  const waiting = queue.filter(p => p.status === 'waiting').slice(0, 5);
  const totalWaiting = queue.filter(p => p.status === 'waiting' || p.status === 'checked-in').length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white p-8 overflow-hidden">
      {/* Header */}
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <span className="text-2xl font-bold">Q</span>
          </div>
          <div>
            <h1 className="text-3xl font-display font-bold">QueueCare</h1>
            <p className="text-slate-400">City Medical Center</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-4xl font-display font-bold tabular-nums">
            {currentTime.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
          </div>
          <div className="text-slate-400">
            {currentTime.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}
          </div>
        </div>
      </header>

      <div className="grid grid-cols-3 gap-8 h-[calc(100vh-12rem)]">
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
                  <motion.div
                    key={patient.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    className="bg-gradient-to-br from-teal-600/20 to-teal-700/10 rounded-2xl p-6 border border-teal-500/30 flex flex-col justify-between"
                  >
                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <div className="w-3 h-3 rounded-full bg-teal-500 animate-pulse" />
                        <span className="text-teal-400 font-medium">In Service</span>
                      </div>
                      <div className="text-6xl font-display font-bold text-white mb-2">
                        {patient.queueNumber}
                      </div>
                      <div className="text-xl text-slate-300 truncate">
                        {patient.patientName}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-slate-400 mt-4">
                      <MapPin className="w-5 h-5" />
                      <span className="text-lg">{patient.location}</span>
                    </div>
                  </motion.div>
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
          {/* Stats Card */}
          <div className="bg-slate-800/50 rounded-3xl p-6 backdrop-blur-sm border border-slate-700/50">
            <div className="flex items-center gap-3 mb-4">
              <Users className="w-6 h-6 text-coral" />
              <h3 className="text-xl font-display font-semibold text-slate-200">Queue Status</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-4xl font-display font-bold text-teal-400">{inService.length}</div>
                <div className="text-slate-400 text-sm">Being Served</div>
              </div>
              <div className="bg-slate-700/50 rounded-xl p-4 text-center">
                <div className="text-4xl font-display font-bold text-coral">{totalWaiting}</div>
                <div className="text-slate-400 text-sm">Waiting</div>
              </div>
            </div>
          </div>

          {/* Next Up List */}
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
                      className={`flex items-center justify-between p-4 rounded-xl ${
                        index === 0 
                          ? 'bg-amber-500/20 border border-amber-500/30' 
                          : 'bg-slate-700/30'
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`text-3xl font-display font-bold ${
                          index === 0 ? 'text-amber-400' : 'text-slate-300'
                        }`}>
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
        </div>
      </div>

      {/* Footer Ticker */}
      <footer className="mt-6 bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50">
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

export default DisplayScreen;
