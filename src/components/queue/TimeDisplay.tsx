import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

interface TimeDisplayProps {
  minutes: number;
  showIcon?: boolean;
  className?: string;
}

export function TimeDisplay({ minutes, showIcon = true, className }: TimeDisplayProps) {
  const getColorClass = () => {
    if (minutes < 15) return 'text-success';
    if (minutes < 30) return 'text-warning';
    return 'text-urgent';
  };

  return (
    <span className={cn("inline-flex items-center gap-1 font-medium", getColorClass(), className)}>
      {showIcon && <Clock className="w-3.5 h-3.5" />}
      <span>{minutes} min</span>
    </span>
  );
}
