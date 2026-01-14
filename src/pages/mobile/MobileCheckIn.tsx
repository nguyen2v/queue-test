import { useState } from "react";
import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Check, Calendar, Clock, MapPin, UserPlus } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { z } from "zod";
import { toast } from "sonner";

type CheckInStep = 'select' | 'confirm' | 'success' | 'walkin-form' | 'walkin-confirm' | 'walkin-success';

// Validation schema for walk-in registration
const walkInSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50, "First name too long"),
  lastName: z.string().trim().max(50, "Last name too long").optional(),
  phone: z.string().trim().min(1, "Phone number is required").max(20, "Phone number too long"),
  email: z.string().trim().email("Invalid email").max(100, "Email too long").optional().or(z.literal("")),
  service: z.string().min(1, "Please select a service"),
  notes: z.string().max(500, "Notes too long").optional(),
});

type WalkInFormData = z.infer<typeof walkInSchema>;

export function MobileCheckIn() {
  const { appointments, checkInPatient, activeQueueEntry, services, addWalkInPatient } = useQueueStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckInStep>('select');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Walk-in form state
  const [walkInData, setWalkInData] = useState<WalkInFormData>({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    service: "",
    notes: "",
  });

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

  const handleWalkInChange = (field: keyof WalkInFormData, value: string) => {
    setWalkInData(prev => ({ ...prev, [field]: value }));
    // Clear error when user types
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateWalkInForm = (): boolean => {
    try {
      walkInSchema.parse(walkInData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path[0]) {
            newErrors[err.path[0] as string] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleWalkInContinue = () => {
    if (validateWalkInForm()) {
      setStep('walkin-confirm');
    }
  };

  const handleWalkInSubmit = () => {
    // Add walk-in patient to queue
    addWalkInPatient({
      firstName: walkInData.firstName,
      lastName: walkInData.lastName,
      phone: walkInData.phone,
      email: walkInData.email,
      service: walkInData.service,
      notes: walkInData.notes,
    });
    
    toast.success("You've joined the queue!");
    setStep('walkin-success');
  };

  const selectedApt = appointments.find((a) => a.id === selectedAppointment);
  const selectedService = services.find(s => s.id === walkInData.service);

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={() => {
            if (step === 'walkin-form') {
              setStep('select');
            } else if (step === 'walkin-confirm') {
              setStep('walkin-form');
            } else {
              navigate('/mobile');
            }
          }}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-heading font-semibold">
          {step.startsWith('walkin') ? 'Walk-in Registration' : 'Check In'}
        </h1>
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

              <Card 
                variant="interactive" 
                className="p-4 cursor-pointer"
                onClick={() => setStep('walkin-form')}
              >
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-secondary">
                    <UserPlus className="w-5 h-5 text-secondary-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">Walk-in Registration</p>
                    <p className="text-sm text-muted-foreground">Register without an appointment</p>
                  </div>
                </div>
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

        {/* Walk-in Registration Form */}
        {step === 'walkin-form' && (
          <motion.div
            key="walkin-form"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-5"
          >
            <div>
              <h2 className="text-xl font-heading font-bold">Your Information</h2>
              <p className="text-sm text-muted-foreground mt-1">
                Please fill in your details to join the queue
              </p>
            </div>

            <div className="space-y-4">
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">First Name *</label>
                  <Input
                    placeholder="John"
                    value={walkInData.firstName}
                    onChange={(e) => handleWalkInChange('firstName', e.target.value)}
                    className={errors.firstName ? 'border-destructive' : ''}
                  />
                  {errors.firstName && (
                    <p className="text-xs text-destructive">{errors.firstName}</p>
                  )}
                </div>
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">Last Name</label>
                  <Input
                    placeholder="Doe"
                    value={walkInData.lastName}
                    onChange={(e) => handleWalkInChange('lastName', e.target.value)}
                    className={errors.lastName ? 'border-destructive' : ''}
                  />
                  {errors.lastName && (
                    <p className="text-xs text-destructive">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Phone Number *</label>
                <Input
                  type="tel"
                  placeholder="+1 (555) 123-4567"
                  value={walkInData.phone}
                  onChange={(e) => handleWalkInChange('phone', e.target.value)}
                  className={errors.phone ? 'border-destructive' : ''}
                />
                {errors.phone && (
                  <p className="text-xs text-destructive">{errors.phone}</p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Email (optional)</label>
                <Input
                  type="email"
                  placeholder="john@example.com"
                  value={walkInData.email}
                  onChange={(e) => handleWalkInChange('email', e.target.value)}
                  className={errors.email ? 'border-destructive' : ''}
                />
                {errors.email && (
                  <p className="text-xs text-destructive">{errors.email}</p>
                )}
              </div>

              {/* Service Selection */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Service *</label>
                <Select
                  value={walkInData.service}
                  onValueChange={(value) => handleWalkInChange('service', value)}
                >
                  <SelectTrigger className={errors.service ? 'border-destructive' : ''}>
                    <SelectValue placeholder="Select a service" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center gap-2">
                          <span>{service.name}</span>
                          <span className="text-xs text-muted-foreground">
                            ~{service.avgServiceTime} min
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.service && (
                  <p className="text-xs text-destructive">{errors.service}</p>
                )}
              </div>

              {/* Notes */}
              <div className="space-y-1.5">
                <label className="text-sm font-medium">Reason for Visit (optional)</label>
                <Input
                  placeholder="Brief description of your visit"
                  value={walkInData.notes}
                  onChange={(e) => handleWalkInChange('notes', e.target.value)}
                  className={errors.notes ? 'border-destructive' : ''}
                />
                {errors.notes && (
                  <p className="text-xs text-destructive">{errors.notes}</p>
                )}
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleWalkInContinue}
            >
              Continue
            </Button>
          </motion.div>
        )}

        {/* Walk-in Confirmation */}
        {step === 'walkin-confirm' && (
          <motion.div
            key="walkin-confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-heading font-bold">Confirm Details</h2>

            <Card className="p-5 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Name</span>
                  <span className="font-medium">
                    {walkInData.firstName} {walkInData.lastName}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Phone</span>
                  <span className="font-medium">{walkInData.phone}</span>
                </div>
                {walkInData.email && (
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Email</span>
                    <span className="font-medium">{walkInData.email}</span>
                  </div>
                )}
                <div className="pt-3 border-t">
                  <div className="flex items-center gap-3">
                    <Calendar className="w-5 h-5 text-primary" />
                    <div>
                      <p className="font-medium">{selectedService?.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Est. wait: ~{selectedService?.avgServiceTime || 15} min
                      </p>
                    </div>
                  </div>
                </div>
                {walkInData.notes && (
                  <div className="pt-3 border-t">
                    <p className="text-sm text-muted-foreground mb-1">Reason for visit:</p>
                    <p className="text-sm">{walkInData.notes}</p>
                  </div>
                )}
              </div>
            </Card>

            <div className="p-4 bg-secondary/30 rounded-xl">
              <p className="text-sm text-muted-foreground">
                📍 By joining the queue, you'll receive updates about your position via SMS.
              </p>
            </div>

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setStep('walkin-form')}>
                Back
              </Button>
              <Button className="flex-1" onClick={handleWalkInSubmit}>
                Join Queue
              </Button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Confirm (for appointments) */}
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

        {/* Step 3: Success (for appointments) */}
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

        {/* Walk-in Success Screen */}
        {step === 'walkin-success' && activeQueueEntry && (
          <motion.div
            key="walkin-success"
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
              <h2 className="text-2xl font-heading font-bold">You're in the Queue!</h2>
              <p className="text-muted-foreground mt-2">
                Your queue number
              </p>
            </div>

            {/* Large Queue Number Display */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
              className="py-4"
            >
              <span className="text-5xl font-mono font-bold text-primary">
                {activeQueueEntry.queueNumber}
              </span>
            </motion.div>

            <Card className="p-5 w-full text-left space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Name</span>
                <span className="font-medium">{activeQueueEntry.patientName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{activeQueueEntry.serviceType}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position</span>
                <span className="font-bold">{selectedService?.todayWaiting || 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Wait</span>
                <span className="font-bold">~{activeQueueEntry.estimatedWaitMinutes} min</span>
              </div>
              <div className="pt-3 border-t border-border/50">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <MapPin className="w-4 h-4" />
                  {activeQueueEntry.location}
                </div>
              </div>
            </Card>

            <div className="space-y-3 w-full pt-4">
              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  📱 You'll receive SMS updates about your queue position at <strong>{walkInData.phone}</strong>
                </p>
              </div>
              <Button size="lg" className="w-full" onClick={() => navigate('/mobile/queue')}>
                View Queue Status
              </Button>
              <Button variant="ghost" className="w-full" onClick={() => navigate('/mobile')}>
                Back to Home
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
