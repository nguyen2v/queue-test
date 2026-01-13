import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  trend?: {
    value: number;
    label: string;
  };
  icon?: ReactNode;
  variant?: 'default' | 'teal' | 'coral' | 'success' | 'warning';
}

export function StatCard({
  title,
  value,
  subtitle,
  trend,
  icon,
  variant = 'default',
}: StatCardProps) {
  const getTrendIcon = () => {
    if (!trend) return null;
    if (trend.value > 0) return <TrendingUp className="w-3.5 h-3.5" />;
    if (trend.value < 0) return <TrendingDown className="w-3.5 h-3.5" />;
    return <Minus className="w-3.5 h-3.5" />;
  };

  const getTrendColor = () => {
    if (!trend) return '';
    if (trend.value > 0) return 'text-success';
    if (trend.value < 0) return 'text-destructive';
    return 'text-muted-foreground';
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'teal':
        return 'bg-primary/5 border-primary/20';
      case 'coral':
        return 'bg-accent/5 border-accent/20';
      case 'success':
        return 'bg-success/5 border-success/20';
      case 'warning':
        return 'bg-warning/5 border-warning/20';
      default:
        return '';
    }
  };

  return (
    <Card variant="stat" className={cn(getVariantStyles())}>
      <div className="flex items-start justify-between">
        <div className="space-y-2">
          <p className="text-sm font-medium text-muted-foreground">{title}</p>
          <p className="text-3xl font-heading font-bold text-foreground">
            {value}
          </p>
          {(subtitle || trend) && (
            <div className="flex items-center gap-2">
              {trend && (
                <span className={cn("flex items-center gap-1 text-xs font-medium", getTrendColor())}>
                  {getTrendIcon()}
                  {Math.abs(trend.value)}%
                </span>
              )}
              {subtitle && (
                <span className="text-xs text-muted-foreground">{subtitle}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="p-2.5 rounded-lg bg-secondary/50">
            {icon}
          </div>
        )}
      </div>
    </Card>
  );
}
