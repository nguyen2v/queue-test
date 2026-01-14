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
import { X, Search, UserPlus, ArrowLeft, User, Phone, Mail, Calendar } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface AddVisitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewMode = "select" | "search" | "create";

// Mock existing patients for search
const mockPatients = [
  { id: "p1", name: "Sarah Johnson", phone: "+1 555-0123", email: "sarah.j@email.com", dob: "1985-03-15", lastVisit: "2 weeks ago" },
  { id: "p2", name: "Michael Chen", phone: "+1 555-0456", email: "m.chen@email.com", dob: "1990-07-22", lastVisit: "1 month ago" },
  { id: "p3", name: "Emily Rodriguez", phone: "+1 555-0789", email: "emily.r@email.com", dob: "1978-11-08", lastVisit: "3 days ago" },
  { id: "p4", name: "James Wilson", phone: "+1 555-0321", email: "j.wilson@email.com", dob: "1995-01-30", lastVisit: "6 months ago" },
  { id: "p5", name: "Lisa Thompson", phone: "+1 555-0654", email: "lisa.t@email.com", dob: "1982-09-12", lastVisit: "1 week ago" },
];

export function AddVisitorDialog({ open, onOpenChange }: AddVisitorDialogProps) {
  const { services } = useQueueStore();
  const [viewMode, setViewMode] = useState<ViewMode>("select");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<typeof mockPatients[0] | null>(null);
  const [selectedService, setSelectedService] = useState("");
  
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    language: "english",
    service: "",
    dateOfBirth: "",
    plan: "",
    labels: "",
  });

  const filteredPatients = mockPatients.filter(patient =>
    patient.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    patient.phone.includes(searchQuery) ||
    patient.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSubmitNew = () => {
    console.log("Adding new visitor:", formData);
    handleClose();
  };

  const handleSubmitExisting = () => {
    console.log("Adding existing patient to queue:", selectedPatient, "Service:", selectedService);
    handleClose();
  };

  const handleClose = () => {
    onOpenChange(false);
    // Reset state after animation
    setTimeout(() => {
      setViewMode("select");
      setSearchQuery("");
      setSelectedPatient(null);
      setSelectedService("");
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        language: "english",
        service: "",
        dateOfBirth: "",
        plan: "",
        labels: "",
      });
    }, 200);
  };

  const handleBack = () => {
    if (selectedPatient) {
      setSelectedPatient(null);
      setSelectedService("");
    } else {
      setViewMode("select");
      setSearchQuery("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {viewMode !== "select" && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleBack}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
              <DialogTitle className="text-xl font-semibold">
                {viewMode === "select" && "Add visitor"}
                {viewMode === "search" && (selectedPatient ? "Add to queue" : "Search patient")}
                {viewMode === "create" && "New visitor"}
              </DialogTitle>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleClose}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Selection View */}
          {viewMode === "select" && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6"
            >
              <p className="text-muted-foreground text-sm mb-4">
                Choose how you'd like to add a visitor to the queue
              </p>
              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setViewMode("search")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed",
                    "hover:border-primary hover:bg-primary/5 transition-all duration-200",
                    "group cursor-pointer"
                  )}
                >
                  <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                    <Search className="w-6 h-6 text-primary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">Search Patient</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Find existing patient records
                    </p>
                  </div>
                </button>

                <button
                  onClick={() => setViewMode("create")}
                  className={cn(
                    "flex flex-col items-center gap-3 p-6 rounded-xl border-2 border-dashed",
                    "hover:border-secondary hover:bg-secondary/5 transition-all duration-200",
                    "group cursor-pointer"
                  )}
                >
                  <div className="w-14 h-14 rounded-full bg-secondary/10 flex items-center justify-center group-hover:bg-secondary/20 transition-colors">
                    <UserPlus className="w-6 h-6 text-secondary" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold">New Visitor</p>
                    <p className="text-xs text-muted-foreground mt-1">
                      Create a new patient record
                    </p>
                  </div>
                </button>
              </div>
            </motion.div>
          )}

          {/* Search View */}
          {viewMode === "search" && !selectedPatient && (
            <motion.div
              key="search"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6"
            >
              {/* Search Input */}
              <div className="relative mb-4">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name, phone, or email..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                  autoFocus
                />
              </div>

              {/* Results */}
              <div className="space-y-2 max-h-[320px] overflow-y-auto">
                {searchQuery.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <Search className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p className="text-sm">Start typing to search patients</p>
                  </div>
                ) : filteredPatients.length === 0 ? (
                  <div className="text-center py-8">
                    <User className="w-10 h-10 mx-auto mb-3 text-muted-foreground opacity-30" />
                    <p className="text-sm text-muted-foreground mb-3">No patients found</p>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => setViewMode("create")}
                    >
                      <UserPlus className="w-4 h-4 mr-2" />
                      Create New Visitor
                    </Button>
                  </div>
                ) : (
                  filteredPatients.map((patient) => (
                    <button
                      key={patient.id}
                      onClick={() => setSelectedPatient(patient)}
                      className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-muted/50 transition-colors text-left"
                    >
                      <Avatar className="w-10 h-10">
                        <AvatarFallback className="bg-primary/10 text-primary text-sm font-medium">
                          {patient.name.split(" ").map(n => n[0]).join("")}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">{patient.name}</p>
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Phone className="w-3 h-3" />
                            {patient.phone}
                          </span>
                          <span>•</span>
                          <span>Last visit: {patient.lastVisit}</span>
                        </div>
                      </div>
                    </button>
                  ))
                )}
              </div>
            </motion.div>
          )}

          {/* Selected Patient View */}
          {viewMode === "search" && selectedPatient && (
            <motion.div
              key="selected"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6"
            >
              {/* Patient Card */}
              <div className="bg-muted/30 rounded-xl p-4 mb-4">
                <div className="flex items-start gap-3">
                  <Avatar className="w-12 h-12">
                    <AvatarFallback className="bg-primary/10 text-primary font-medium">
                      {selectedPatient.name.split(" ").map(n => n[0]).join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p className="font-semibold text-lg">{selectedPatient.name}</p>
                    <div className="grid grid-cols-2 gap-2 mt-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-1.5">
                        <Phone className="w-3.5 h-3.5" />
                        {selectedPatient.phone}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Mail className="w-3.5 h-3.5" />
                        {selectedPatient.email}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Calendar className="w-3.5 h-3.5" />
                        DOB: {selectedPatient.dob}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <User className="w-3.5 h-3.5" />
                        Last: {selectedPatient.lastVisit}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="space-y-3">
                <label className="text-sm font-medium">Select Service *</label>
                <Select
                  value={selectedService}
                  onValueChange={setSelectedService}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Choose a service..." />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                <Button variant="outline" onClick={handleBack} className="min-w-[100px]">
                  Back
                </Button>
                <Button 
                  onClick={handleSubmitExisting} 
                  className="min-w-[100px]"
                  disabled={!selectedService}
                >
                  Add to Queue
                </Button>
              </div>
            </motion.div>
          )}

          {/* Create New View */}
          {viewMode === "create" && (
            <motion.div
              key="create"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="px-6 pb-6 space-y-4 max-h-[400px] overflow-y-auto"
            >
              {/* Name Row */}
              <div className="grid grid-cols-2 gap-4">
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

              {/* Contact */}
              <Input
                type="email"
                placeholder="Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
              <Input
                placeholder="Phone number"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />

              {/* Language & Service */}
              <div className="grid grid-cols-2 gap-4">
                <Select
                  value={formData.language}
                  onValueChange={(value) => setFormData({ ...formData, language: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Language *" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="mandarin">Chinese (Simplified)</SelectItem>
                    <SelectItem value="portuguese">Portuguese</SelectItem>
                  </SelectContent>
                </Select>

                <Select
                  value={formData.service}
                  onValueChange={(value) => setFormData({ ...formData, service: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Service *" />
                  </SelectTrigger>
                  <SelectContent>
                    {services.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* DOB & Plan */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Input
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  />
                  <p className="text-[10px] text-muted-foreground mt-1">MM/DD/YYYY</p>
                </div>
                <Select
                  value={formData.plan}
                  onValueChange={(value) => setFormData({ ...formData, plan: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Plan" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="basic">Basic</SelectItem>
                    <SelectItem value="standard">Standard</SelectItem>
                    <SelectItem value="premium">Premium</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Labels */}
              <Select
                value={formData.labels}
                onValueChange={(value) => setFormData({ ...formData, labels: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Labels" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="vip">VIP</SelectItem>
                  <SelectItem value="new">New Patient</SelectItem>
                  <SelectItem value="returning">Returning</SelectItem>
                  <SelectItem value="urgent">Urgent</SelectItem>
                </SelectContent>
              </Select>

              {/* Actions */}
              <div className="flex items-center justify-center gap-3 pt-2">
                <Button variant="outline" onClick={() => setViewMode("select")} className="min-w-[100px]">
                  Cancel
                </Button>
                <Button 
                  onClick={handleSubmitNew} 
                  className="min-w-[100px]"
                  disabled={!formData.firstName || !formData.service}
                >
                  Add Visitor
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
