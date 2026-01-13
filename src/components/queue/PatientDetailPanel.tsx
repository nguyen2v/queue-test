import { QueueEntry } from "@/types/queue";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  X,
  Copy,
  Phone,
  RotateCcw,
  Tag,
  UserCheck,
  Bell,
  CheckCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

interface ActivityEvent {
  id: string;
  time: Date;
  type: "check-in" | "label" | "assigned" | "called" | "served";
  description: string;
  actor?: string;
  label?: string;
  labelColor?: string;
}

interface PatientDetailPanelProps {
  entry: QueueEntry;
  onClose: () => void;
  onReturnToWaiting?: () => void;
  onCallVisitor?: () => void;
}

export function PatientDetailPanel({
  entry,
  onClose,
  onReturnToWaiting,
  onCallVisitor,
}: PatientDetailPanelProps) {
  // Parse name into first/last
  const nameParts = entry.patientName.split(" ");
  const firstName = nameParts[0] || "";
  const lastName = nameParts.slice(1).join(" ") || "";

  // Mock activity data - in real app this would come from store/API
  const activities: ActivityEvent[] = [
    {
      id: "1",
      time: entry.checkInTime,
      type: "check-in",
      description: "Visitor checked in via kiosk",
    },
    {
      id: "2",
      time: new Date(new Date(entry.checkInTime).getTime() + 1000),
      type: "label",
      description: "Added label",
      label: entry.serviceType,
      labelColor: "bg-primary",
    },
    {
      id: "3",
      time: new Date(new Date(entry.checkInTime).getTime() + 60000),
      type: "assigned",
      description: "Assigned to",
      actor: entry.assignedStaff || "Staff Member",
    },
    ...(entry.status === "in-service" || entry.status === "completed"
      ? [
          {
            id: "4",
            time: new Date(new Date(entry.checkInTime).getTime() + 120000),
            type: "called" as const,
            description: "Visitor called by",
            actor: "me",
          },
        ]
      : []),
    ...(entry.status === "completed"
      ? [
          {
            id: "5",
            time: new Date(new Date(entry.checkInTime).getTime() + 300000),
            type: "served" as const,
            description: "Served by",
            actor: "me",
          },
        ]
      : []),
  ];

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "checked-in":
        return "Checked In";
      case "waiting":
        return "Waiting";
      case "in-service":
        return "In Service";
      case "completed":
        return "Served";
      case "no-show":
        return "No Show";
      default:
        return status;
    }
  };

  const getActivityIcon = (type: ActivityEvent["type"]) => {
    switch (type) {
      case "check-in":
        return <UserCheck className="w-3.5 h-3.5" />;
      case "label":
        return <Tag className="w-3.5 h-3.5" />;
      case "assigned":
        return <UserCheck className="w-3.5 h-3.5" />;
      case "called":
        return <Bell className="w-3.5 h-3.5" />;
      case "served":
        return <CheckCircle className="w-3.5 h-3.5" />;
      default:
        return null;
    }
  };

  return (
    <div className="flex h-full bg-background border-l border-border animate-slide-in-right">
      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-border">
          <h2 className="text-xl font-heading font-semibold text-foreground">
            {entry.patientName}
          </h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="w-5 h-5" />
          </Button>
        </div>

        {/* Scrollable Content */}
        <ScrollArea className="flex-1">
          <div className="p-4 space-y-6">
            {/* Status Badge */}
            <div>
              <Badge variant="outline" className="text-sm">
                {getStatusLabel(entry.status)}
              </Badge>
            </div>

            {/* Quick Info */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Email</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm truncate">
                    {firstName.toLowerCase()}.{lastName.toLowerCase()}@example.com
                  </span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Phone</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm">(202) 555-0118</span>
                  <Button variant="ghost" size="icon" className="h-6 w-6 shrink-0">
                    <Copy className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            </div>

            <div>
              <p className="text-sm text-muted-foreground mb-1">Service</p>
              <p className="text-sm font-medium">{entry.serviceType}</p>
            </div>

            <Separator />

            {/* Editable Form */}
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First name *</Label>
                <Input id="firstName" defaultValue={firstName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="lastName">Last name</Label>
                <Input id="lastName" defaultValue={lastName} />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  defaultValue={`${firstName.toLowerCase()}.${lastName.toLowerCase()}@example.com`}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Phone number</Label>
                <Input id="phone" defaultValue="(202) 555-0118" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="language">Language *</Label>
                <Select defaultValue="english">
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="english">English</SelectItem>
                    <SelectItem value="spanish">Spanish</SelectItem>
                    <SelectItem value="french">French</SelectItem>
                    <SelectItem value="mandarin">Mandarin</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Service *</Label>
                <Select defaultValue={entry.serviceType.toLowerCase()}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="consultation">Consultation</SelectItem>
                    <SelectItem value="general checkup">General Checkup</SelectItem>
                    <SelectItem value="lab work">Lab Work</SelectItem>
                    <SelectItem value="follow-up">Follow-up</SelectItem>
                    <SelectItem value="prescription refill">Prescription Refill</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-3 pt-4">
              <Button
                variant="outline"
                className="flex-1"
                onClick={onReturnToWaiting}
              >
                <RotateCcw className="w-4 h-4 mr-2" />
                Return to waiting
              </Button>
              <Button className="flex-1" onClick={onCallVisitor}>
                <Phone className="w-4 h-4 mr-2" />
                Call visitor
              </Button>
            </div>
          </div>
        </ScrollArea>
      </div>

      {/* Activity Sidebar */}
      <div className="w-72 border-l border-border bg-muted/30 flex flex-col">
        <div className="p-4 border-b border-border">
          <div className="flex items-center justify-between">
            <h3 className="font-medium text-foreground">Activity</h3>
            <Button variant="ghost" size="sm" className="text-primary text-sm h-auto py-1">
              Filters: All events
            </Button>
          </div>
        </div>

        <ScrollArea className="flex-1">
          <div className="p-4 space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className="flex flex-col items-center">
                  <div className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                  <div className="w-px flex-1 bg-border mt-1" />
                </div>
                <div className="flex-1 pb-4">
                  <p className="text-sm text-muted-foreground mb-1">
                    {format(new Date(activity.time), "h:mma")}
                  </p>
                  <div className="flex items-center gap-2 flex-wrap">
                    {getActivityIcon(activity.type)}
                    <span className="text-sm">
                      {activity.description}
                      {activity.actor && (
                        <span className="font-semibold"> {activity.actor}</span>
                      )}
                    </span>
                    {activity.label && (
                      <Badge
                        className={cn(
                          "text-xs",
                          activity.labelColor || "bg-primary"
                        )}
                      >
                        {activity.label}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}
