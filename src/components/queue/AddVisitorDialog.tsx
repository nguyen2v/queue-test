import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useQueueStore } from "@/store/queueStore";
import { X } from "lucide-react";

interface AddVisitorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function AddVisitorDialog({ open, onOpenChange }: AddVisitorDialogProps) {
  const { services } = useQueueStore();
  
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

  const handleSubmit = () => {
    // In a real app, this would add the visitor to the queue
    console.log("Adding visitor:", formData);
    onOpenChange(false);
    // Reset form
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
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] p-0 gap-0">
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-xl font-semibold">Add visitor</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 pb-6 space-y-4">
          {/* Name Row */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Input
                placeholder="First name *"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Input
                placeholder="Last name"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          {/* Email */}
          <div className="space-y-2">
            <Input
              type="email"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>

          {/* Phone */}
          <div className="space-y-2">
            <Input
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>

          {/* Language */}
          <div className="space-y-2">
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
          </div>

          {/* Service */}
          <div className="space-y-2">
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

          {/* Date of Birth */}
          <div className="space-y-1">
            <Input
              placeholder="Date of Birth (MM/DD/YYYY)"
              value={formData.dateOfBirth}
              onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
            />
            <p className="text-xs text-muted-foreground">(Month / Day / Year)</p>
          </div>

          {/* Plan */}
          <div className="space-y-2">
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
          <div className="space-y-2">
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
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-center gap-3 p-6 pt-0">
          <Button variant="outline" onClick={handleCancel} className="min-w-[100px]">
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            className="min-w-[100px] bg-primary text-primary-foreground"
            disabled={!formData.firstName || !formData.service}
          >
            Add visitor
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}