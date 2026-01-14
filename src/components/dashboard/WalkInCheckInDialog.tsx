import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueueStore } from "@/store/queueStore";
import { X, ArrowRight, User, Phone, Mail, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface WalkInCheckInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (queueNumber: string) => void;
}

type Step = "form" | "confirm" | "success";

export function WalkInCheckInDialog({ open, onOpenChange, onSuccess }: WalkInCheckInDialogProps) {
  const { services, addWalkInPatient } = useQueueStore();
  const [step, setStep] = useState<Step>("form");
  const [queueNumber, setQueueNumber] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    email: "",
    service: "",
    priority: "normal",
    notes: "",
  });

  const selectedService = services.find(s => s.id === formData.service);

  const handleSubmit = () => {
    setStep("confirm");
  };

  const handleConfirm = () => {
    // Add to queue
    const newQueueNumber = `W-${String(Math.floor(Math.random() * 900) + 100)}`;
    
    addWalkInPatient({
      firstName: formData.firstName,
      lastName: formData.lastName,
      phone: formData.phone,
      email: formData.email,
      service: formData.service,
      notes: formData.notes,
    });
    
    setQueueNumber(newQueueNumber);
    setStep("success");
    onSuccess?.(newQueueNumber);
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("form");
      setQueueNumber("");
      setFormData({
        firstName: "",
        lastName: "",
        phone: "",
        email: "",
        service: "",
        priority: "normal",
        notes: "",
      });
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">
              {step === "form" && "Walk-in Check-in"}
              {step === "confirm" && "Confirm Details"}
              {step === "success" && "Check-in Complete"}
            </DialogTitle>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Form Step */}
          {step === "form" && (
            <motion.div
              key="form"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4"
            >
              {/* Patient Info */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Patient Information
                </h3>
                <div className="grid grid-cols-2 gap-3">
                  <Input
                    placeholder="First name *"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  />
                  <Input
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  />
                </div>
                <Input
                  placeholder="Phone number"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                />
                <Input
                  type="email"
                  placeholder="Email (optional)"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              {/* Service Selection */}
              <div className="space-y-3">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                  Service
                </h3>
                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select service *" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        <div className="flex items-center justify-between w-full">
                          <span>{service.name}</span>
                          <span className="text-xs text-muted-foreground ml-2">
                            ~{service.avgServiceTime} min
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                {/* Priority */}
                <div className="flex gap-2">
                  {["normal", "high", "urgent"].map((priority) => (
                    <button
                      key={priority}
                      onClick={() => setFormData({ ...formData, priority })}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize",
                        formData.priority === priority
                          ? priority === "urgent"
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : priority === "high"
                            ? "bg-warning/10 border-warning text-warning"
                            : "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      {priority}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <Input
                placeholder="Notes (optional)"
                value={formData.notes}
                onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              />

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  disabled={!formData.firstName || !formData.service}
                  onClick={handleSubmit}
                >
                  Continue
                  <ArrowRight className="w-4 h-4" />
                </Button>
              </div>
            </motion.div>
          )}

          {/* Confirm Step */}
          {step === "confirm" && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="p-6 space-y-4"
            >
              {/* Summary Card */}
              <div className="bg-muted/30 rounded-xl p-4 space-y-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="w-6 h-6 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-lg">
                      {formData.firstName} {formData.lastName}
                    </p>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      {formData.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" />
                          {formData.phone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="border-t border-border pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Service</span>
                    <span className="font-medium">{selectedService?.name}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Est. Wait</span>
                    <span className="font-medium">~{selectedService?.avgServiceTime || 15} min</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Priority</span>
                    <span className={cn(
                      "font-medium capitalize",
                      formData.priority === "urgent" && "text-destructive",
                      formData.priority === "high" && "text-warning"
                    )}>
                      {formData.priority}
                    </span>
                  </div>
                  {formData.notes && (
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Notes</span>
                      <span className="font-medium truncate max-w-[200px]">{formData.notes}</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setStep("form")}>
                  Back
                </Button>
                <Button className="flex-1" onClick={handleConfirm}>
                  Confirm Check-in
                </Button>
              </div>
            </motion.div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-success" />
              </motion.div>

              <h3 className="text-xl font-semibold mb-2">Check-in Successful!</h3>
              <p className="text-muted-foreground mb-6">
                Patient has been added to the queue
              </p>

              <div className="bg-muted/30 rounded-xl p-4 mb-6">
                <p className="text-sm text-muted-foreground mb-1">Queue Number</p>
                <p className="text-4xl font-bold text-primary">{queueNumber}</p>
                <p className="text-sm text-muted-foreground mt-2">
                  {selectedService?.name} • Est. wait ~{selectedService?.avgServiceTime || 15} min
                </p>
              </div>

              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
