import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Flashlight, MapPin, Check, Building2, Stethoscope, Loader2, QrCode, Keyboard } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useQueueStore } from "@/store/queueStore";

type ScanStep = 'scan' | 'manual' | 'processing' | 'location' | 'service' | 'confirm' | 'success';

// Mock kiosk/location data that would be encoded in QR
const mockKioskData = {
  kioskId: "KIOSK-001",
  locationId: "LOC-001",
  locationName: "City Medical Center",
  address: "123 Healthcare Ave, Building A",
  floor: "Ground Floor",
  availableServices: ["general", "lab", "pharmacy", "vaccination"],
};

export function MobileQRScanner() {
  const navigate = useNavigate();
  const { services, checkInPatient, activeQueueEntry, appointments } = useQueueStore();
  const [step, setStep] = useState<ScanStep>('scan');
  const [flashlightOn, setFlashlightOn] = useState(false);
  const [manualCode, setManualCode] = useState("");
  const [selectedService, setSelectedService] = useState<string>("");
  const [scannedLocation, setScannedLocation] = useState(mockKioskData);

  // Simulate QR scan detection
  const handleSimulateScan = () => {
    setStep('processing');
    // Simulate processing delay
    setTimeout(() => {
      setScannedLocation(mockKioskData);
      setStep('location');
    }, 1500);
  };

  // Handle manual code submission
  const handleManualSubmit = () => {
    if (manualCode.length >= 4) {
      setStep('processing');
      setTimeout(() => {
        setScannedLocation(mockKioskData);
        setStep('location');
      }, 1500);
    }
  };

  // Confirm location and proceed
  const handleConfirmLocation = () => {
    setStep('service');
  };

  // Select service and proceed
  const handleSelectService = (serviceId: string) => {
    setSelectedService(serviceId);
    setStep('confirm');
  };

  // Final confirmation - join queue
  const handleJoinQueue = () => {
    // Check if there's an appointment for selected service
    const matchingAppointment = appointments.find(
      apt => apt.status === 'scheduled' && 
      services.find(s => s.id === selectedService)?.name === apt.serviceType
    );
    
    if (matchingAppointment) {
      checkInPatient(matchingAppointment.id);
    }
    setStep('success');
  };

  // Navigate based on step
  const handleBack = () => {
    switch (step) {
      case 'manual':
        setStep('scan');
        break;
      case 'location':
        setStep('scan');
        break;
      case 'service':
        setStep('location');
        break;
      case 'confirm':
        setStep('service');
        break;
      default:
        navigate('/mobile');
    }
  };

  const selectedServiceData = services.find(s => s.id === selectedService);

  return (
    <div className="min-h-screen bg-background animate-fade-in">
      <AnimatePresence mode="wait">
        {/* Step 1: QR Scanner View */}
        {step === 'scan' && (
          <motion.div
            key="scan"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="p-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={() => navigate('/mobile')}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-heading font-semibold">Scan QR Code</h1>
              <div className="w-10" />
            </div>

            <div className="text-center mb-6">
              <p className="text-muted-foreground">
                Point camera at the kiosk QR code
              </p>
            </div>

            {/* Camera Viewfinder */}
            <div className="relative aspect-square max-w-xs mx-auto">
              <div className="absolute inset-0 bg-muted rounded-2xl overflow-hidden">
                {/* Simulated camera view */}
                <div className={`w-full h-full transition-colors ${
                  flashlightOn 
                    ? 'bg-gradient-to-br from-yellow-100 to-yellow-50' 
                    : 'bg-gradient-to-br from-slate-800 to-slate-900'
                }`}>
                  {/* Mock QR code in view */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-24 h-24 bg-white rounded-lg p-2 shadow-lg opacity-80">
                      <div className="w-full h-full border-2 border-slate-800 rounded grid grid-cols-3 gap-0.5 p-1">
                        {[...Array(9)].map((_, i) => (
                          <div key={i} className={`${[0,2,3,5,6,8].includes(i) ? 'bg-slate-800' : 'bg-white'} rounded-sm`} />
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Scan frame corners */}
              <div className="absolute inset-8">
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-primary rounded-tl-xl" />
                <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-primary rounded-tr-xl" />
                <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-primary rounded-bl-xl" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-primary rounded-br-xl" />
              </div>
              
              {/* Scanning line animation */}
              <div className="absolute inset-8 overflow-hidden rounded-xl">
                <div 
                  className="absolute left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-primary to-transparent"
                  style={{ animation: 'scan 2s ease-in-out infinite' }} 
                />
              </div>
            </div>

            {/* Action buttons */}
            <div className="mt-8 flex justify-center gap-4">
              <Button 
                variant={flashlightOn ? "default" : "secondary"} 
                className="gap-2"
                onClick={() => setFlashlightOn(!flashlightOn)}
              >
                <Flashlight className="w-4 h-4" />
                {flashlightOn ? 'Light On' : 'Light Off'}
              </Button>
            </div>

            {/* Mock scan button for demo */}
            <div className="mt-6">
              <Button 
                className="w-full gap-2" 
                size="lg"
                onClick={handleSimulateScan}
              >
                <QrCode className="w-5 h-5" />
                Simulate QR Scan (Demo)
              </Button>
            </div>

            {/* Manual entry option */}
            <div className="mt-8 pt-6 border-t border-border text-center">
              <p className="text-muted-foreground text-sm mb-3">Having trouble scanning?</p>
              <Button variant="outline" className="gap-2" onClick={() => setStep('manual')}>
                <Keyboard className="w-4 h-4" />
                Enter code manually
              </Button>
            </div>

            <style>{`
              @keyframes scan {
                0%, 100% { top: 0; opacity: 1; }
                50% { top: calc(100% - 2px); opacity: 0.5; }
              }
            `}</style>
          </motion.div>
        )}

        {/* Step 1b: Manual Code Entry */}
        {step === 'manual' && (
          <motion.div
            key="manual"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-heading font-semibold">Enter Code</h1>
              <div className="w-10" />
            </div>

            <div className="space-y-6">
              <div className="text-center">
                <div className="w-16 h-16 rounded-full bg-secondary mx-auto mb-4 flex items-center justify-center">
                  <Keyboard className="w-8 h-8 text-secondary-foreground" />
                </div>
                <p className="text-muted-foreground">
                  Enter the 6-digit code displayed on the kiosk screen
                </p>
              </div>

              <div className="space-y-4">
                <Input
                  type="text"
                  placeholder="Enter kiosk code (e.g., ABC123)"
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value.toUpperCase())}
                  className="text-center text-xl font-mono tracking-wider h-14"
                  maxLength={8}
                />
                
                <Button 
                  className="w-full" 
                  size="lg"
                  disabled={manualCode.length < 4}
                  onClick={handleManualSubmit}
                >
                  Continue
                </Button>
              </div>

              <div className="text-center">
                <p className="text-sm text-muted-foreground">
                  The code is usually displayed below the QR code on the kiosk
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 2: Processing/Scanning */}
        {step === 'processing' && (
          <motion.div
            key="processing"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            className="p-6 flex flex-col items-center justify-center min-h-[80vh]"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-16 h-16 rounded-full border-4 border-primary border-t-transparent mb-6"
            />
            <h2 className="text-xl font-heading font-semibold mb-2">Scanning...</h2>
            <p className="text-muted-foreground text-center">
              Verifying kiosk location
            </p>
          </motion.div>
        )}

        {/* Step 3: Location Confirmation */}
        {step === 'location' && (
          <motion.div
            key="location"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-heading font-semibold">Confirm Location</h1>
              <div className="w-10" />
            </div>

            <div className="space-y-6">
              {/* Success indicator */}
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 200, damping: 15 }}
                  className="w-16 h-16 rounded-full bg-success/10 mx-auto mb-4 flex items-center justify-center"
                >
                  <Check className="w-8 h-8 text-success" />
                </motion.div>
                <h2 className="text-lg font-semibold">QR Code Recognized</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Please confirm your location
                </p>
              </div>

              {/* Location Card */}
              <Card className="p-5 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Building2 className="w-5 h-5 text-primary" />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold">{scannedLocation.locationName}</h3>
                    <p className="text-sm text-muted-foreground mt-1">
                      {scannedLocation.address}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2 text-sm text-muted-foreground pt-3 border-t">
                  <MapPin className="w-4 h-4" />
                  <span>{scannedLocation.floor}</span>
                  <span className="text-muted-foreground/50">•</span>
                  <span>Kiosk {scannedLocation.kioskId}</span>
                </div>
              </Card>

              {/* Available services preview */}
              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm font-medium mb-2">Available services at this location:</p>
                <div className="flex flex-wrap gap-2">
                  {scannedLocation.availableServices.map((svc) => {
                    const service = services.find(s => s.id === svc);
                    return service ? (
                      <span key={svc} className="text-xs bg-background px-2.5 py-1 rounded-full">
                        {service.name}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={handleBack}>
                  Scan Again
                </Button>
                <Button className="flex-1" onClick={handleConfirmLocation}>
                  Confirm Location
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Service Selection */}
        {step === 'service' && (
          <motion.div
            key="service"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-heading font-semibold">Select Service</h1>
              <div className="w-10" />
            </div>

            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold">What do you need today?</h2>
                <p className="text-muted-foreground text-sm mt-1">
                  Choose a service to join the queue
                </p>
              </div>

              <div className="space-y-3">
                {services
                  .filter(s => scannedLocation.availableServices.includes(s.id))
                  .map((service, index) => (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <Card
                        variant="interactive"
                        className={`p-4 cursor-pointer ${
                          selectedService === service.id ? 'ring-2 ring-primary' : ''
                        }`}
                        onClick={() => handleSelectService(service.id)}
                      >
                        <div className="flex items-center gap-4">
                          <div className="p-3 rounded-xl bg-primary/10">
                            <Stethoscope className="w-5 h-5 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="font-medium">{service.name}</h3>
                            <div className="flex items-center gap-3 mt-1 text-sm text-muted-foreground">
                              <span>{service.todayWaiting} waiting</span>
                              <span className="text-muted-foreground/50">•</span>
                              <span>~{service.avgServiceTime} min avg</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 5: Confirmation */}
        {step === 'confirm' && selectedServiceData && (
          <motion.div
            key="confirm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="p-6"
          >
            <div className="flex items-center justify-between mb-6">
              <Button variant="ghost" size="icon" onClick={handleBack}>
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <h1 className="font-heading font-semibold">Confirm Check-In</h1>
              <div className="w-10" />
            </div>

            <div className="space-y-6">
              <Card className="p-5 space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-primary/10">
                    <Stethoscope className="w-5 h-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedServiceData.name}</p>
                    <p className="text-sm text-muted-foreground">Service</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-lg bg-muted">
                    <Building2 className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <div>
                    <p className="font-medium">{scannedLocation.locationName}</p>
                    <p className="text-sm text-muted-foreground">{scannedLocation.floor}</p>
                  </div>
                </div>

                <div className="pt-4 border-t">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Current queue</span>
                    <span className="font-medium">{selectedServiceData.todayWaiting} people</span>
                  </div>
                  <div className="flex justify-between text-sm mt-2">
                    <span className="text-muted-foreground">Est. wait time</span>
                    <span className="font-medium">~{selectedServiceData.todayWaiting * 5} min</span>
                  </div>
                </div>
              </Card>

              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  📱 You'll receive SMS updates about your queue position
                </p>
              </div>

              <div className="flex gap-3 pt-4">
                <Button variant="outline" className="flex-1" onClick={handleBack}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleJoinQueue}>
                  Join Queue
                </Button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 6: Success */}
        {step === 'success' && (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="p-6 flex flex-col items-center justify-center min-h-[80vh] text-center"
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
              className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mb-6"
            >
              <Check className="w-10 h-10 text-success" />
            </motion.div>

            <h2 className="text-2xl font-heading font-bold mb-2">You're in the Queue!</h2>
            
            <div className="my-6">
              <p className="text-muted-foreground text-sm mb-2">Your Queue Number</p>
              <motion.div
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="text-5xl font-mono font-bold text-primary"
              >
                {activeQueueEntry?.queueNumber || 'Q-0099'}
              </motion.div>
            </div>

            <Card className="p-5 w-full text-left space-y-3 mb-6">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Service</span>
                <span className="font-medium">{selectedServiceData?.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Position</span>
                <span className="font-bold">{(selectedServiceData?.todayWaiting || 5) + 1}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Est. Wait</span>
                <span className="font-bold">~{((selectedServiceData?.todayWaiting || 5) + 1) * 5} min</span>
              </div>
              <div className="pt-3 border-t flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                {scannedLocation.locationName} • {scannedLocation.floor}
              </div>
            </Card>

            <div className="space-y-3 w-full">
              <div className="p-4 bg-secondary/30 rounded-xl">
                <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Keep this app open to track your position in real-time
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
