import { ReactNode } from "react";
import { TrendingUp, TrendingDown, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Status = "normal" | "warning" | "critical";

interface MetricCardProps {
  value: string | number;
  label: string;
  secondary?: string;
  trend?: {
    value: number;
    label: string;
  };
  status?: Status;
  statusBadge?: string;
  actionLabel?: string;
  onAction?: () => void;
  sparklineData?: number[];
  delay?: number;
}

const statusColors: Record<Status, { bg: string; border: string; text: string }> = {
  normal: {
    bg: "bg-success/5",
    border: "border-success/20",
    text: "text-success",
  },
  warning: {
    bg: "bg-warning/5",
    border: "border-warning/20",
    text: "text-warning",
  },
  critical: {
    bg: "bg-destructive/5",
    border: "border-destructive/20",
    text: "text-destructive",
  },
};

function MiniSparkline({ data, status }: { data: number[]; status: Status }) {
  const max = Math.max(...data);
  const min = Math.min(...data);
  const range = max - min || 1;

  const strokeColor = status === "normal" 
    ? "hsl(var(--success))" 
    : status === "warning" 
    ? "hsl(var(--warning))" 
    : "hsl(var(--destructive))";

  const points = data
    .map((value, index) => {
      const x = (index / (data.length - 1)) * 80;
      const y = 20 - ((value - min) / range) * 16;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <svg className="w-20 h-5" viewBox="0 0 80 24">
      <polyline
        points={points}
        fill="none"
        stroke={strokeColor}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        opacity="0.6"
      />
    </svg>
  );
}

export function MetricCard({
  value,
  label,
  secondary,
  trend,
  status = "normal",
  statusBadge,
  actionLabel,
  onAction,
  sparklineData,
  delay = 0,
}: MetricCardProps) {
  const colors = statusColors[status];

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.3 }}
      className={cn(
        "relative bg-card rounded-xl border p-5 transition-all duration-200 hover:shadow-elevated cursor-pointer group",
        colors.bg,
        colors.border
      )}
      onClick={onAction}
    >
      {/* Value */}
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              "text-3xl font-heading font-bold tracking-tight",
              status === "critical" ? "text-destructive" : 
              status === "warning" ? "text-warning" : "text-foreground"
            )}
          >
            {value}
          </p>
          <p className="text-sm text-muted-foreground mt-1">{label}</p>
        </div>

        {/* Status Badge */}
        {statusBadge && (
          <span
            className={cn(
              "text-xs font-medium px-2 py-1 rounded-full",
              colors.bg,
              colors.text
            )}
          >
            {statusBadge}
          </span>
        )}
      </div>

      {/* Secondary Info */}
      <div className="mt-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          {trend && (
            <div
              className={cn(
                "flex items-center gap-1 text-xs font-medium",
                trend.value >= 0 ? "text-success" : "text-destructive"
              )}
            >
              {trend.value >= 0 ? (
                <TrendingUp className="w-3 h-3" />
              ) : (
                <TrendingDown className="w-3 h-3" />
              )}
              <span>{trend.value >= 0 ? "+" : ""}{trend.value}</span>
            </div>
          )}
          {secondary && (
            <span className="text-xs text-muted-foreground">{secondary}</span>
          )}
        </div>

        {/* Sparkline */}
        {sparklineData && sparklineData.length > 0 && (
          <MiniSparkline data={sparklineData} status={status} />
        )}
      </div>

      {/* Action */}
      {actionLabel && (
        <div className="mt-3 flex items-center gap-1 text-xs font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
          <span>{actionLabel}</span>
          <ArrowRight className="w-3 h-3" />
        </div>
      )}
    </motion.div>
  );
}
