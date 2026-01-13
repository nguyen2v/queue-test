import { useState, useEffect } from "react";
import { useQueueStore } from "@/store/queueStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { User, Search, Check } from "lucide-react";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { ServiceType, Staff, StaffStatus } from "@/types/queue";

const statusColors: Record<StaffStatus, string> = {
  available: "bg-success",
  busy: "bg-warning",
  break: "bg-muted-foreground",
  offline: "bg-muted",
};

const statusLabels: Record<StaffStatus, string> = {
  available: "Available",
  busy: "Busy",
  break: "On Break",
  offline: "Offline",
};

interface StaffAssignmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  service: ServiceType | null;
}

export function StaffAssignmentDialog({
  open,
  onOpenChange,
  service,
}: StaffAssignmentDialogProps) {
  const { staff, assignStaffToService } = useQueueStore();
  const [selectedStaff, setSelectedStaff] = useState<string[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Initialize selected staff when dialog opens
  useEffect(() => {
    if (open && service) {
      const assignedStaffIds = staff
        .filter((s) => s.assignedServices.includes(service.id))
        .map((s) => s.id);
      setSelectedStaff(assignedStaffIds);
      setSearchQuery("");
    }
  }, [open, service, staff]);

  const filteredStaff = staff.filter(
    (s) =>
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const toggleStaff = (staffId: string) => {
    setSelectedStaff((prev) =>
      prev.includes(staffId)
        ? prev.filter((id) => id !== staffId)
        : [...prev, staffId]
    );
  };

  const handleSave = () => {
    if (service) {
      assignStaffToService(service.id, selectedStaff);
      onOpenChange(false);
    }
  };

  if (!service) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Manage Staff for {service.name}</DialogTitle>
          <DialogDescription>
            Select staff members to assign to this service. They will be able to
            serve patients in this queue.
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            placeholder="Search staff..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Staff List */}
        <ScrollArea className="h-[300px] pr-4">
          <div className="space-y-2">
            {filteredStaff.length > 0 ? (
              filteredStaff.map((member) => {
                const isSelected = selectedStaff.includes(member.id);
                return (
                  <div
                    key={member.id}
                    onClick={() => toggleStaff(member.id)}
                    className={cn(
                      "flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all",
                      isSelected
                        ? "border-primary bg-primary/5"
                        : "border-border hover:border-primary/50 hover:bg-muted/50"
                    )}
                  >
                    <Checkbox
                      checked={isSelected}
                      onCheckedChange={() => toggleStaff(member.id)}
                      className="pointer-events-none"
                    />
                    <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center shrink-0">
                      <User className="w-5 h-5 text-secondary-foreground" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium truncate">
                          {member.name}
                        </span>
                        {isSelected && (
                          <Check className="w-4 h-4 text-primary shrink-0" />
                        )}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <span>{member.role}</span>
                        <span className="text-border">•</span>
                        <span className="flex items-center gap-1">
                          <span
                            className={cn(
                              "w-2 h-2 rounded-full",
                              statusColors[member.status]
                            )}
                          />
                          {statusLabels[member.status]}
                        </span>
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-sm font-medium">
                        {member.patientsServedToday}
                      </div>
                      <div className="text-xs text-muted-foreground">today</div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No staff found matching "{searchQuery}"
              </div>
            )}
          </div>
        </ScrollArea>

        {/* Summary */}
        <div className="flex items-center justify-between py-2 px-3 bg-muted/50 rounded-lg">
          <span className="text-sm text-muted-foreground">
            Staff assigned:
          </span>
          <Badge variant="secondary">{selectedStaff.length} selected</Badge>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Assignments</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
