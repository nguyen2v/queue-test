import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Smartphone, QrCode, Calendar, MapPin, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo from "@/assets/logo.png";

export function MobileHome() {
  const { currentPatient, appointments, activeQueueEntry } = useQueueStore();
  const navigate = useNavigate();

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled' && new Date(apt.dateTime) > new Date()
  );

  // If patient is in queue, show queue status instead
  if (activeQueueEntry) {
    navigate('/mobile/queue');
    return null;
  }

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <img src={logo} alt="QueueCare" className="w-10 h-10 rounded-xl" />
          <span className="font-heading font-bold text-xl">QueueCare</span>
        </div>
      </div>

      {/* Welcome */}
      <div>
        <h1 className="text-2xl font-heading font-bold">
          Welcome back, {currentPatient.name.split(' ')[0]}
        </h1>
        <p className="text-muted-foreground mt-1">
          How can we help you today?
        </p>
      </div>

      {/* Action Cards */}
      <div className="space-y-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card
            variant="interactive"
            className="p-5"
            onClick={() => navigate('/mobile/checkin')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl gradient-teal">
                <Smartphone className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg">Mobile Check-In</h3>
                <p className="text-sm text-muted-foreground">
                  Tap to check in for your appointment
                </p>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card
            variant="interactive"
            className="p-5"
            onClick={() => navigate('/mobile/scan')}
          >
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-secondary">
                <QrCode className="w-6 h-6 text-secondary-foreground" />
              </div>
              <div className="flex-1">
                <h3 className="font-heading font-semibold text-lg">Scan QR Code</h3>
                <p className="text-sm text-muted-foreground">
                  Scan kiosk QR to check in on arrival
                </p>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Upcoming Appointments */}
      {upcomingAppointments.length > 0 && (
        <div className="space-y-3">
          <h2 className="font-heading font-semibold text-muted-foreground text-sm uppercase tracking-wide">
            Upcoming
          </h2>
          {upcomingAppointments.map((apt) => (
            <motion.div
              key={apt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Card variant="queue" className="p-4">
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4 text-primary" />
                      <span className="font-medium">
                        {apt.doctorName ? `${apt.doctorName} - ` : ''}{apt.serviceType}
                      </span>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {new Date(apt.dateTime).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                        })}, {new Date(apt.dateTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                      <MapPin className="w-3.5 h-3.5" />
                      {apt.location}
                    </div>
                  </div>
                </div>
                <div className="mt-4 pt-3 border-t border-border/50">
                  <Button
                    variant="default"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate('/mobile/checkin')}
                  >
                    Check In Available
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
