import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-primary text-primary-foreground",
        secondary:
          "border-transparent bg-secondary text-secondary-foreground",
        destructive:
          "border-transparent bg-destructive text-destructive-foreground",
        outline: "text-foreground",
        success:
          "border-transparent bg-success/10 text-success",
        warning:
          "border-transparent bg-warning/10 text-warning",
        urgent:
          "border-transparent bg-urgent/10 text-urgent",
        "high-priority":
          "border-transparent bg-high-priority/10 text-high-priority",
        waiting:
          "border-transparent bg-warning/10 text-warning",
        "clinic-suite":
          "border-transparent bg-secondary text-secondary-foreground",
        "in-service":
          "border-transparent bg-primary/10 text-primary",
        completed:
          "border-transparent bg-success/10 text-success",
        cancelled:
          "border-transparent bg-destructive/10 text-destructive",
        "no-show":
          "border-transparent bg-muted text-muted-foreground",
        "checked-in":
          "border-transparent bg-secondary text-secondary-foreground",
        teal:
          "border-transparent bg-primary/10 text-primary",
        coral:
          "border-transparent bg-accent/10 text-accent",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
