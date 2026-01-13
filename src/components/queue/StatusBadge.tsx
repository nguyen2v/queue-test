import { Badge } from "@/components/ui/badge";
import { Priority, QueueStatus } from "@/types/queue";

interface StatusBadgeProps {
  status: QueueStatus | Priority;
  className?: string;
}

const statusLabels: Record<string, string> = {
  'checked-in': 'Checked In',
  'waiting': 'Waiting',
  'in-service': 'In Service',
  'completed': 'Completed',
  'no-show': 'No Show',
  'urgent': 'Urgent',
  'high': 'High Priority',
  'normal': 'Normal',
};

const statusVariants: Record<string, "default" | "secondary" | "destructive" | "outline" | "success" | "warning" | "urgent" | "high-priority" | "waiting" | "in-service" | "completed" | "no-show" | "checked-in" | "teal" | "coral"> = {
  'checked-in': 'checked-in',
  'waiting': 'waiting',
  'in-service': 'in-service',
  'completed': 'completed',
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
