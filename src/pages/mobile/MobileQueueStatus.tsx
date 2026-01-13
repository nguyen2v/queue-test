import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, MapPin, Bell, BellOff, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function MobileQueueStatus() {
  const { activeQueueEntry, leaveQueue, queue } = useQueueStore();
  const navigate = useNavigate();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [stepAwayMode, setStepAwayMode] = useState(false);

  // Calculate position
  const position = activeQueueEntry
    ? queue
        .filter((p) => p.status === 'waiting' && p.serviceType === activeQueueEntry.serviceType)
        .sort((a, b) => new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime())
        .findIndex((p) => p.id === activeQueueEntry.id) + 1
    : 0;

  const estimatedWait = position * 5; // 5 min per patient

  // Mock position updates
  useEffect(() => {
    if (!activeQueueEntry) {
      navigate('/mobile');
    }
  }, [activeQueueEntry, navigate]);

  if (!activeQueueEntry) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-muted-foreground">You're not in a queue</p>
        <Button onClick={() => navigate('/mobile')} className="mt-4">
          Go Home
        </Button>
      </div>
    );
  }

  const handleLeaveQueue = () => {
    leaveQueue();
    navigate('/mobile');
  };

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mobile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-heading font-semibold">Queue Status</h1>
        <div className="w-10" />
      </div>

      {/* Position Display */}
      <div className="flex flex-col items-center py-8">
        <p className="text-muted-foreground text-sm mb-2">Your Position</p>
        <motion.div
          className="relative"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
        >
          <div className="w-32 h-32 rounded-full gradient-teal flex items-center justify-center relative">
            <span className="text-5xl font-heading font-bold text-primary-foreground">
              {position}
            </span>
            <div className="absolute inset-0 rounded-full border-4 border-primary/30 animate-pulse-ring" />
          </div>
        </motion.div>
        <p className="text-muted-foreground mt-3">in line</p>

        {/* Estimated Wait */}
        <div className="mt-6 text-center">
          <p className="text-muted-foreground text-sm">Estimated Wait</p>
          <p className="text-2xl font-heading font-bold text-foreground">
            ~{estimatedWait} minutes
          </p>
        </div>

        {/* Service Info */}
        <div className="mt-4 flex items-center gap-2 text-muted-foreground">
          <MapPin className="w-4 h-4 text-primary" />
          <span>{activeQueueEntry.serviceType}</span>
        </div>
        <p className="text-sm text-muted-foreground">{activeQueueEntry.location}</p>
      </div>

      {/* Progress */}
      <Card className="p-4">
        <p className="text-sm text-muted-foreground mb-3">Queue Progress</p>
        <div className="flex items-center justify-center gap-2">
          {[1, 2, 3, 4, 5].map((step) => (
            <div
              key={step}
              className={`w-4 h-4 rounded-full ${
                step <= 5 - position + 1 ? 'bg-primary' : 'bg-muted'
              }`}
            />
          ))}
        </div>
        <p className="text-center text-sm text-muted-foreground mt-3">
          {position <= 2 ? "Almost there!" : "You're getting closer!"}
        </p>
      </Card>

      {/* Action Cards */}
      <div className="space-y-3">
        <Card
          variant="interactive"
          className="p-4"
          onClick={() => setNotificationsOn(!notificationsOn)}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${notificationsOn ? 'bg-primary/10' : 'bg-muted'}`}>
              {notificationsOn ? (
                <Bell className="w-5 h-5 text-primary" />
              ) : (
                <BellOff className="w-5 h-5 text-muted-foreground" />
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">Notifications {notificationsOn ? 'ON' : 'OFF'}</p>
              <p className="text-sm text-muted-foreground">
                {notificationsOn
                  ? "We'll alert you when you're next"
                  : "Enable to receive queue updates"}
              </p>
            </div>
          </div>
        </Card>

        <Card
          variant="interactive"
          className="p-4"
          onClick={() => setStepAwayMode(!stepAwayMode)}
        >
          <div className="flex items-center gap-4">
            <div className={`p-2.5 rounded-lg ${stepAwayMode ? 'bg-warning/10' : 'bg-muted'}`}>
              <UserX className={`w-5 h-5 ${stepAwayMode ? 'text-warning' : 'text-muted-foreground'}`} />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <p className="font-medium">Step Away Mode</p>
                {stepAwayMode && <Badge variant="warning">Active</Badge>}
              </div>
              <p className="text-sm text-muted-foreground">
                Leave the waiting area and we'll call you back
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Leave Queue */}
      <div className="pt-4">
        <Button
          variant="ghost"
          className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
          onClick={handleLeaveQueue}
        >
          Leave Queue
        </Button>
      </div>
    </div>
  );
}
