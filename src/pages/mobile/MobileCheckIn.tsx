import { useState } from "react";
import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type CheckInStep = 'select' | 'confirm' | 'success';

export function MobileCheckIn() {
  const { appointments, checkInPatient, activeQueueEntry } = useQueueStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckInStep>('select');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled'
  );

  const handleContinue = () => {
    if (selectedAppointment) {
      setStep('confirm');
    }
  };

  const handleCheckIn = () => {
    if (selectedAppointment) {
      checkInPatient(selectedAppointment);
      setStep('success');
    }
  };

  const selectedApt = appointments.find((a) => a.id === selectedAppointment);

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mobile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-heading font-semibold">Check In</h1>
        <div className="w-10" />
      </div>

      <AnimatePresence mode="wait">
        {/* Step 1: Select Appointment */}
        {step === 'select' && (
          <motion.div
            key="select"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-heading font-bold">Select Appointment</h2>

            <div className="space-y-3">
              {upcomingAppointments.map((apt) => (
                <Card
                  key={apt.id}
                  variant={selectedAppointment === apt.id ? 'elevated' : 'queue'}
                  className={`p-4 cursor-pointer transition-all ${
                    selectedAppointment === apt.id
                      ? 'ring-2 ring-primary border-primary'
                      : ''
                  }`}
                  onClick={() => setSelectedAppointment(apt.id)}
                >
                  <div className="flex items-start gap-3">
                    <div
                      className={`w-5 h-5 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                        selectedAppointment === apt.id
                          ? 'border-primary bg-primary'
                          : 'border-muted-foreground'
                      }`}
                    >
                      {selectedAppointment === apt.id && (
                        <Check className="w-3 h-3 text-primary-foreground" />
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">
                        {apt.doctorName ? `${apt.doctorName} - ` : ''}{apt.serviceType}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        {new Date(apt.dateTime).toLocaleDateString('en-US', {
                          weekday: 'long',
                          month: 'short',
                          day: 'numeric',
                        })}, {new Date(apt.dateTime).toLocaleTimeString('en-US', {
                          hour: 'numeric',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}

              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center">
                  <span className="bg-background px-4 text-sm text-muted-foreground">Or</span>
                </div>
              </div>

              <Card variant="queue" className="p-4 cursor-pointer">
                <p className="font-medium text-center">+ Walk-in Registration</p>
              </Card>
            </div>

            <Button
              size="lg"
              className="w-full"
              disabled={!selectedAppointment}
              onClick={handleContinue}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* Step 2: Confirm */}
        {step === 'confirm' && selectedApt && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-heading font-bold">Confirm Details</h2>

            <Card className="p-5 space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-5 h-5 text-primary" />
                <div>
                  <p className="font-medium">{selectedApt.serviceType}</p>
                  <p className="text-sm text-muted-foreground">
                    {selectedApt.doctorName || 'General appointment'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm">
                  {new Date(selectedApt.dateTime).toLocaleString('en-US', {
                    weekday: 'long',
                    month: 'long',
                    day: 'numeric',
                    hour: 'numeric',
                    minute: '2-digit',
                  })}
                </p>
              </div>
              <div className="flex items-center gap-3">
                <MapPin className="w-5 h-5 text-muted-foreground" />
                <p className="text-sm">{selectedApt.location}</p>
              </div>
            </Card>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('select')}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleCheckIn}>
                Check In
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 3: Success */}
        {step === 'success' && activeQueueEntry && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center"
            >
              <Check className="w-10 h-10 text-success" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-heading font-bold">You're Checked In!</h2>
              <p className="text-muted-foreground mt-2">
                Queue Number: <span className="font-mono font-bold">{activeQueueEntry.queueNumber}</span>
              </p>
            </div>

            <Card className="p-5 w-full text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position</span>
                <span className="font-bold">5</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Wait</span>
                <span className="font-bold">~{activeQueueEntry.estimatedWaitMinutes} min</span>
              </div>
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {activeQueueEntry.serviceType}
                </div>
                <p className="text-sm text-muted-foreground mt-1">{activeQueueEntry.location}</p>
              </div>
            </Card>

            <div className="space-y-3 w-full pt-4">
              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Enable notifications to be alerted when ready
                </p>
              </div>
              <Button size="lg" className="w-full" onClick={() => navigate('/mobile/queue')}>
                View Queue Status
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
