import { cn } from "@/lib/utils";
import { Priority, QueueStatus } from "@/types/queue";

interface StatusDotProps {
  status: QueueStatus | Priority;
  className?: string;
  animate?: boolean;
}

export function StatusDot({ status, className, animate = true }: StatusDotProps) {
  const getStatusClasses = () => {
    switch (status) {
      case 'urgent':
        return cn('bg-urgent', animate && 'animate-pulse');
      case 'high':
        return cn('bg-high-priority', animate && 'animate-pulse');
      case 'waiting':
        return cn('bg-warning', animate && 'animate-pulse');
      case 'in-service':
        return 'bg-primary';
      case 'completed':
        return 'bg-success';
      case 'no-show':
        return 'bg-muted-foreground';
      case 'checked-in':
        return 'bg-secondary-foreground';
      case 'normal':
      default:
        return 'bg-muted-foreground';
    }
  };

  return (
    <span
      className={cn(
        "inline-block w-2 h-2 rounded-full",
        getStatusClasses(),
        className
      )}
    />
  );
}
