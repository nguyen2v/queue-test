import { useQueueStore } from "@/store/queueStore";
import { StatCard } from "@/components/queue/StatCard";
import { QueueCard } from "@/components/queue/QueueCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { StatusDot } from "@/components/queue/StatusDot";
import { Users, Clock, CheckCircle, XCircle, Phone, User } from "lucide-react";
import { motion } from "framer-motion";

export function AdminDashboard() {
  const { queue, staff, services, callNextPatient } = useQueueStore();

  const waitingCount = queue.filter((p) => p.status === 'waiting').length;
  const inServiceCount = queue.filter((p) => p.status === 'in-service').length;
  const completedToday = queue.filter((p) => p.status === 'completed').length;
  const noShowCount = queue.filter((p) => p.status === 'no-show').length;

  const avgWaitTime = Math.round(
    queue
      .filter((p) => p.status === 'waiting')
      .reduce((acc, p) => acc + (Date.now() - new Date(p.checkInTime).getTime()) / 60000, 0) /
      (waitingCount || 1)
  );

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Good morning";
    if (hour < 17) return "Good afternoon";
    return "Good evening";
  };

  const activeQueues = services.filter((s) => s.isActive);

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            {greeting()}, Admin
          </h1>
          <p className="text-muted-foreground">
            {new Date().toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
        <Button size="lg" onClick={() => callNextPatient()}>
          <Phone className="w-4 h-4" />
          Call Next Patient
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <StatCard
            title="Currently Waiting"
            value={waitingCount}
            trend={{ value: 12, label: "vs last hour" }}
            icon={<Users className="w-5 h-5 text-primary" />}
            variant="teal"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <StatCard
            title="Avg Wait Time"
            value={`${avgWaitTime} min`}
            subtitle="Target: 15 min"
            trend={{ value: avgWaitTime <= 15 ? 5 : -8, label: "vs target" }}
            icon={<Clock className="w-5 h-5 text-warning" />}
            variant={avgWaitTime <= 15 ? 'success' : 'warning'}
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <StatCard
            title="Served Today"
            value={completedToday}
            subtitle="85% of expected"
            trend={{ value: 8, label: "vs yesterday" }}
            icon={<CheckCircle className="w-5 h-5 text-success" />}
            variant="success"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <StatCard
            title="No-Show Rate"
            value={`${Math.round((noShowCount / (completedToday + noShowCount || 1)) * 100)}%`}
            trend={{ value: -2, label: "vs avg" }}
            icon={<XCircle className="w-5 h-5 text-muted-foreground" />}
          />
        </motion.div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Active Queues - Left Section */}
        <div className="lg:col-span-3 space-y-4">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle>Active Queues</CardTitle>
                <Button variant="ghost" size="sm">
                  View All
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {activeQueues.map((service) => (
                <div
                  key={service.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <StatusDot status={service.todayWaiting > 5 ? 'waiting' : 'in-service'} />
                    <div>
                      <p className="font-medium">{service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {service.locations[0]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6 text-sm">
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{service.todayWaiting}</p>
                      <p className="text-xs text-muted-foreground">Waiting</p>
                    </div>
                    <div className="text-center">
                      <p className="font-semibold text-foreground">{service.avgServiceTime}m</p>
                      <p className="text-xs text-muted-foreground">Avg</p>
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Recent Patients */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Recent Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {queue
                  .filter((p) => p.status === 'waiting')
                  .slice(0, 4)
                  .map((entry) => (
                    <QueueCard
                      key={entry.id}
                      entry={entry}
                      compact
                      onCall={() => {}}
                    />
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Staff on Duty */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Staff on Duty</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {staff.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/30 transition-colors"
                >
                  <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center relative">
                    <User className="w-5 h-5 text-secondary-foreground" />
                    <span
                      className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-card ${
                        member.status === 'available'
                          ? 'bg-success'
                          : member.status === 'busy'
                          ? 'bg-warning'
                          : member.status === 'break'
                          ? 'bg-muted-foreground'
                          : 'bg-muted'
                      }`}
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">{member.patientsServedToday}</p>
                    <p className="text-xs text-muted-foreground">served</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <Card>
            <CardHeader className="pb-4">
              <CardTitle>Today's Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Peak Hour</span>
                  <span className="font-medium">10:00 AM - 11:00 AM</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">Busiest Service</span>
                  <span className="font-medium">Lab Work</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">In Service</span>
                  <span className="font-medium">{inServiceCount} patients</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
