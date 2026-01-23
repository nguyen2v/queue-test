import { Badge } from "@/components/ui/badge";
import { Priority, QueueStatus } from "@/types/queue";

interface StatusBadgeProps {
  status: QueueStatus | Priority;
  className?: string;
}

const statusLabels: Record<string, string> = {
  'checked-in': 'Checked In',
  'waiting': 'Waiting',
  'clinic-suite': 'Clinic Suite',
  'in-service': 'In Service',
  'completed': 'Completed',
  'cancelled': 'Cancelled',
  'no-show': 'No Show',
  'urgent': 'Urgent',
  'high': 'High Priority',
  'normal': 'Normal',
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "urgent" | "high-priority" | "waiting" | "in-service" | "completed" | "no-show" | "checked-in" | "teal" | "coral" | "clinic-suite" | "cancelled"> = {
  'checked-in': 'checked-in',
  'waiting': 'waiting',
  'clinic-suite': 'clinic-suite',
  'in-service': 'in-service',
  'completed': 'completed',
  'cancelled': 'cancelled',
  'no-show': 'no-show',
  'urgent': 'urgent',
  'high': 'high-priority',
  'normal': 'secondary',
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge variant={statusVariants[status] || 'secondary'} className={className}>
      {statusLabels[status] || status}
    </Badge>
  );
}
