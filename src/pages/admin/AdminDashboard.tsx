import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useQueueStore } from "@/store/queueStore";
import { DashboardHeader } from "@/components/dashboard/DashboardHeader";
import { MetricCard } from "@/components/dashboard/MetricCard";
import { QueueByServiceTable } from "@/components/dashboard/QueueByServiceTable";
import { AlertsPanel } from "@/components/dashboard/AlertsPanel";
import { VolumeTimeline } from "@/components/dashboard/VolumeTimeline";
import { StaffCapacityPanel } from "@/components/dashboard/StaffCapacityPanel";
import { DailyProgressFooter } from "@/components/dashboard/DailyProgressFooter";
import { FloatingActionButton } from "@/components/dashboard/FloatingActionButton";
import { toast } from "@/hooks/use-toast";

// Mock data for the dashboard
const mockQueuesByService = [
  {
    service: "General Medicine",
    waiting: 8,
    avgWait: 12,
    velocity: 5.2,
    status: "normal" as const,
    nextPatients: [
      { id: "Q-0056", name: "John Smith", waitTime: 8 },
      { id: "Q-0057", name: "Sarah Lee", waitTime: 5 },
      { id: "Q-0058", name: "Mike Chen", waitTime: 3 },
    ],
  },
  {
    service: "Laboratory",
    waiting: 15,
    avgWait: 28,
    velocity: 3.1,
    status: "warning" as const,
    nextPatients: [
      { id: "Q-0041", name: "Ana Garcia", waitTime: 25 },
      { id: "Q-0042", name: "Tom Wilson", waitTime: 22 },
      { id: "Q-0043", name: "Lisa Park", waitTime: 18 },
    ],
  },
  {
    service: "Pharmacy",
    waiting: 3,
    avgWait: 5,
    velocity: 8.0,
    status: "normal" as const,
    nextPatients: [
      { id: "Q-0071", name: "David Kim", waitTime: 4 },
      { id: "Q-0072", name: "Emma Brown", waitTime: 2 },
    ],
  },
  {
    service: "Radiology",
    waiting: 6,
    avgWait: 45,
    velocity: 1.8,
    status: "critical" as const,
    nextPatients: [
      { id: "Q-0034", name: "Maria Santos", waitTime: 42 },
      { id: "Q-0035", name: "James Liu", waitTime: 38 },
      { id: "Q-0036", name: "Nina Patel", waitTime: 30 },
    ],
  },
  {
    service: "Vaccination",
    waiting: 4,
    avgWait: 8,
    velocity: 6.5,
    status: "normal" as const,
    nextPatients: [
      { id: "Q-0081", name: "Chris Taylor", waitTime: 6 },
      { id: "Q-0082", name: "Amy Wong", waitTime: 4 },
    ],
  },
];

const mockAlerts = [
  {
    id: "1",
    type: "critical" as const,
    title: "Radiology queue stalled",
    description: "No patient served in 18 min",
    actions: ["Investigate", "Reassign Staff"],
  },
  {
    id: "2",
    type: "longWait" as const,
    title: "Q-0034 Maria Santos",
    description: "Waiting 42 min - General Medicine",
    actions: ["Call Now", "Transfer", "Note"],
  },
  {
    id: "3",
    type: "vip" as const,
    title: "Q-0051 VIP Patient",
    description: "Laboratory queue - Position 4",
    actions: ["Prioritize", "View Details"],
  },
];

const mockRecentActivity = [
  { id: "1", text: "Q-0048 served (Lab)", time: "2 min ago" },
  { id: "2", text: "Q-0047 no-show", time: "5 min ago" },
  { id: "3", text: "Dr. Reyes started break", time: "8 min ago" },
];

const mockTimelineData = [
  { hour: "8am", actual: 8 },
  { hour: "9am", actual: 15 },
  { hour: "10am", actual: 22 },
  { hour: "11am", predicted: 25 },
  { hour: "12pm", predicted: 20 },
  { hour: "1pm", predicted: 18 },
  { hour: "2pm", predicted: 15 },
  { hour: "3pm", predicted: 12 },
  { hour: "4pm", predicted: 8 },
];

const mockUpcomingEvents = [
  { id: "1", text: "Dr. Reyes returns", time: "4 min" },
  { id: "2", text: "Nurse Chen break", time: "22 min" },
  { id: "3", text: "Shift change (3 staff)", time: "2:00 PM" },
];

export function AdminDashboard() {
  const navigate = useNavigate();
  const { queue, staff, callNextPatient } = useQueueStore();
  const [lastRefresh, setLastRefresh] = useState(Date.now());

  // Calculate metrics from store
  const waitingCount = queue.filter((p) => p.status === "waiting").length;
  const completedToday = queue.filter((p) => p.status === "completed").length;
  const noShowCount = queue.filter((p) => p.status === "no-show").length;

  const avgWaitTime = Math.round(
    queue
      .filter((p) => p.status === "waiting")
      .reduce(
        (acc, p) =>
          acc + (Date.now() - new Date(p.checkInTime).getTime()) / 60000,
        0
      ) / (waitingCount || 1)
  );

  // Find longest waiting patient
  const longestWaiting = queue
    .filter((p) => p.status === "waiting")
    .sort(
      (a, b) =>
        new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime()
    )[0];

  const longestWaitTime = longestWaiting
    ? Math.round(
        (Date.now() - new Date(longestWaiting.checkInTime).getTime()) / 60000
      )
    : 0;

  // Staff counts
  const staffStatus = {
    available: staff.filter((s) => s.status === "available").length,
    busy: staff.filter((s) => s.status === "busy").length,
    onBreak: staff.filter((s) => s.status === "break").length,
    offline: staff.filter((s) => s.status === "offline").length,
  };

  const activeStations = staffStatus.available + staffStatus.busy;
  const totalStations = staff.length;

  // Status calculations
  const getWaitingStatus = () => {
    if (waitingCount <= 20) return "normal";
    if (waitingCount <= 35) return "warning";
    return "critical";
  };

  const getAvgWaitStatus = () => {
    if (avgWaitTime <= 15) return "normal";
    if (avgWaitTime <= 25) return "warning";
    return "critical";
  };

  const getLongestWaitStatus = () => {
    if (longestWaitTime <= 20) return "normal";
    if (longestWaitTime <= 30) return "warning";
    return "critical";
  };

  const getStationsStatus = () => {
    const ratio = activeStations / totalStations;
    if (ratio > 0.6) return "normal";
    if (ratio >= 0.4) return "warning";
    return "critical";
  };

  // Sparkline data (mock last 2 hours)
  const waitingSparkline = [18, 20, 19, 22, 21, 23, waitingCount];
  const avgWaitSparkline = [12, 13, 11, 14, 15, 13, avgWaitTime];

  // Real-time refresh simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setLastRefresh(Date.now());
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  // Keyboard shortcut for call next
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key.toLowerCase() === "n" && !e.ctrlKey && !e.metaKey && !e.altKey) {
        const target = e.target as HTMLElement;
        if (target.tagName !== "INPUT" && target.tagName !== "TEXTAREA") {
          handleCallNext();
        }
      }
    };
    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, []);

  const handleCallNext = useCallback(() => {
    callNextPatient();
    toast({
      title: "Patient Called",
      description: "Next patient has been notified.",
    });
  }, [callNextPatient]);

  const handleAlertAction = (alertId: string, action: string) => {
    toast({
      title: `Action: ${action}`,
      description: `Processing alert ${alertId}...`,
    });
  };

  // Current hour for timeline
  const currentHour = new Date().getHours() - 8; // Offset from 8am

  return (
    <div className="space-y-4 pb-24 animate-fade-in">
      {/* Header Bar */}
      <DashboardHeader />

      {/* Primary Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          value={waitingCount}
          label="Currently Waiting"
          trend={{ value: 5, label: "vs 1hr ago" }}
          status={getWaitingStatus()}
          sparklineData={waitingSparkline}
          delay={0.1}
        />
        <MetricCard
          value={`${avgWaitTime} min`}
          label="Average Wait Time"
          secondary="Target: 15 min"
          status={getAvgWaitStatus()}
          statusBadge={avgWaitTime <= 15 ? "On Target" : undefined}
          sparklineData={avgWaitSparkline}
          delay={0.15}
        />
        <MetricCard
          value={`${longestWaitTime} min`}
          label="Longest Wait"
          secondary={longestWaiting ? `Q-${longestWaiting.queueNumber}` : undefined}
          status={getLongestWaitStatus()}
          actionLabel="View →"
          onAction={() => navigate("/admin/queue")}
          delay={0.2}
        />
        <MetricCard
          value={`${activeStations} of ${totalStations}`}
          label="Active Stations"
          secondary={`${staffStatus.onBreak} on break`}
          status={getStationsStatus()}
          actionLabel="Manage →"
          onAction={() => navigate("/admin/staff")}
          delay={0.25}
        />
      </div>

      {/* Main Grid: Queue Table + Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <QueueByServiceTable
            data={mockQueuesByService}
            onViewAll={() => navigate("/admin/queue")}
          />
        </div>
        <div className="lg:col-span-2">
          <AlertsPanel
            alerts={mockAlerts}
            recentActivity={mockRecentActivity}
            onAlertAction={handleAlertAction}
          />
        </div>
      </div>

      {/* Secondary Grid: Timeline + Staff */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <div className="lg:col-span-3">
          <VolumeTimeline
            data={mockTimelineData}
            currentHour={Math.max(0, Math.min(currentHour, mockTimelineData.length - 1))}
            peakHours="11am - 1pm"
            currentPhase={currentHour < 3 ? "Pre-peak ↗" : currentHour < 5 ? "Peak ●" : "Post-peak ↘"}
          />
        </div>
        <div className="lg:col-span-2">
          <StaffCapacityPanel
            status={staffStatus}
            waitingCount={waitingCount}
            targetRatio={5}
            upcoming={mockUpcomingEvents}
            onManage={() => navigate("/admin/staff")}
          />
        </div>
      </div>

      {/* Daily Progress Footer */}
      <DailyProgressFooter
        served={completedToday || 127}
        expected={190}
        noShows={noShowCount || 8}
        noShowRate={4.2}
      />

      {/* Floating Action Button */}
      <FloatingActionButton
        onCallNext={handleCallNext}
        onWalkIn={() => toast({ title: "Walk-in", description: "Opening check-in form..." })}
        onAnnouncement={() => toast({ title: "Announcement", description: "Opening announcement panel..." })}
        onPauseQueue={() => toast({ title: "Queue Paused", description: "Queue has been paused." })}
      />
    </div>
  );
}
