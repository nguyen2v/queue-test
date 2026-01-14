import { useState } from "react";
import { ChevronDown, ChevronRight, ArrowUpDown } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type Status = "normal" | "warning" | "critical";

interface ServiceQueue {
  service: string;
  waiting: number;
  avgWait: number;
  velocity: number;
  status: Status;
  nextPatients?: { id: string; name: string; waitTime: number }[];
}

interface QueueByServiceTableProps {
  data: ServiceQueue[];
  onViewAll?: () => void;
}

const statusDot: Record<Status, string> = {
  normal: "bg-emerald-500",
  warning: "bg-amber-400",
  critical: "bg-rose-400",
};

const statusRowBg: Record<Status, string> = {
  normal: "",
  warning: "bg-amber-50/50 dark:bg-amber-950/20",
  critical: "bg-rose-50/50 dark:bg-rose-950/20",
};

export function QueueByServiceTable({ data, onViewAll }: QueueByServiceTableProps) {
  const [expandedRow, setExpandedRow] = useState<string | null>(null);
  const [sortKey, setSortKey] = useState<"waiting" | "avgWait" | "velocity">("waiting");
  const [sortAsc, setSortAsc] = useState(false);

  const sortedData = [...data].sort((a, b) => {
    const diff = a[sortKey] - b[sortKey];
    return sortAsc ? diff : -diff;
  });

  const toggleSort = (key: typeof sortKey) => {
    if (sortKey === key) {
      setSortAsc(!sortAsc);
    } else {
      setSortKey(key);
      setSortAsc(false);
    }
  };

  return (
    <Card className="h-full border-0 shadow-sm">
      <CardHeader className="pb-4 px-6">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold text-foreground">
            Queue Status by Service
          </CardTitle>
          <Button 
            variant="ghost" 
            size="sm" 
            onClick={onViewAll}
            className="text-muted-foreground hover:text-foreground text-sm font-medium"
          >
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/40">
                <th className="text-left text-xs font-medium text-muted-foreground px-6 py-3 w-[35%]">
                  Service
                </th>
                <th
                  className="text-center text-xs font-medium text-muted-foreground px-4 py-3 cursor-pointer hover:text-foreground transition-colors group w-[15%]"
                  onClick={() => toggleSort("waiting")}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Waiting
                    <ArrowUpDown className={cn(
                      "w-3 h-3 transition-colors",
                      sortKey === "waiting" ? "text-foreground" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                    )} />
                  </div>
                </th>
                <th
                  className="text-center text-xs font-medium text-muted-foreground px-4 py-3 cursor-pointer hover:text-foreground transition-colors group w-[20%]"
                  onClick={() => toggleSort("avgWait")}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Avg Wait
                    <ArrowUpDown className={cn(
                      "w-3 h-3 transition-colors",
                      sortKey === "avgWait" ? "text-foreground" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                    )} />
                  </div>
                </th>
                <th
                  className="text-center text-xs font-medium text-muted-foreground px-4 py-3 cursor-pointer hover:text-foreground transition-colors group w-[15%]"
                  onClick={() => toggleSort("velocity")}
                >
                  <div className="flex items-center justify-center gap-1.5">
                    Velocity
                    <ArrowUpDown className={cn(
                      "w-3 h-3 transition-colors",
                      sortKey === "velocity" ? "text-foreground" : "text-muted-foreground/50 group-hover:text-muted-foreground"
                    )} />
                  </div>
                </th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-3 w-[15%]">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row, index) => (
                <ServiceRow
                  key={row.service}
                  row={row}
                  isExpanded={expandedRow === row.service}
                  isLast={index === sortedData.length - 1}
                  onToggle={() =>
                    setExpandedRow(expandedRow === row.service ? null : row.service)
                  }
                />
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}

interface ServiceRowProps {
  row: ServiceQueue;
  isExpanded: boolean;
  isLast: boolean;
  onToggle: () => void;
}

function ServiceRow({ row, isExpanded, isLast, onToggle }: ServiceRowProps) {
  return (
    <>
      <tr
        className={cn(
          "cursor-pointer transition-colors",
          !isLast && !isExpanded && "border-b border-border/30",
          isExpanded && "border-b-0",
          statusRowBg[row.status],
          "hover:bg-muted/40"
        )}
        onClick={onToggle}
      >
        <td className="px-6 py-4">
          <div className="flex items-center gap-3">
            <div className={cn(
              "flex items-center justify-center w-5 h-5 rounded transition-transform duration-200",
              isExpanded && "transform"
            )}>
              {isExpanded ? (
                <ChevronDown className="w-4 h-4 text-muted-foreground" />
              ) : (
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
            <span className="font-medium text-sm text-foreground">{row.service}</span>
          </div>
        </td>
        <td className="px-4 py-4 text-center">
          <span className="font-semibold text-sm text-foreground">{row.waiting}</span>
        </td>
        <td className="px-4 py-4 text-center">
          <span className="text-sm text-foreground">{row.avgWait} min</span>
        </td>
        <td className="px-4 py-4 text-center">
          <span className="text-sm text-muted-foreground">{row.velocity}/hr</span>
        </td>
        <td className="px-4 py-4">
          <div className="flex justify-center">
            <span
              className={cn(
                "w-2.5 h-2.5 rounded-full shadow-sm",
                statusDot[row.status]
              )}
            />
          </div>
        </td>
      </tr>
      
      {/* Expanded content */}
      <tr
        className={cn(
          "transition-all duration-200 overflow-hidden",
          isExpanded ? "opacity-100" : "opacity-0 h-0",
          !isLast && "border-b border-border/30",
          statusRowBg[row.status]
        )}
        style={{ display: isExpanded ? "table-row" : "none" }}
      >
        <td colSpan={5} className="px-6 py-0">
          <div className={cn(
            "py-4 pl-8 transition-all duration-200",
            isExpanded ? "opacity-100" : "opacity-0"
          )}>
            <p className="text-xs font-medium text-muted-foreground mb-3">
              Next up:
            </p>
            {row.nextPatients && row.nextPatients.length > 0 ? (
              <div className="space-y-2.5">
                {row.nextPatients.map((patient) => (
                  <div
                    key={patient.id}
                    className="flex items-center text-sm"
                  >
                    <span className="font-medium text-foreground w-20">
                      {patient.id}
                    </span>
                    <span className="text-muted-foreground flex-1 text-center">
                      {patient.name}
                    </span>
                    <span className="text-muted-foreground w-20 text-right">
                      {patient.waitTime} min
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground italic">
                No patients waiting
              </p>
            )}
          </div>
        </td>
      </tr>
    </>
  );
}
