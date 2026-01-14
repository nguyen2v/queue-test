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
  normal: "bg-success",
  warning: "bg-warning",
  critical: "bg-destructive animate-pulse",
};

const statusRowBg: Record<Status, string> = {
  normal: "",
  warning: "bg-warning/5",
  critical: "bg-destructive/5",
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
    <Card className="h-full">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">Queue Status by Service</CardTitle>
          <Button variant="ghost" size="sm" onClick={onViewAll}>
            View All →
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/50">
                <th className="text-left text-xs font-medium text-muted-foreground px-4 py-2">
                  Service
                </th>
                <th
                  className="text-center text-xs font-medium text-muted-foreground px-4 py-2 cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("waiting")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Waiting
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="text-center text-xs font-medium text-muted-foreground px-4 py-2 cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("avgWait")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Avg Wait
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th
                  className="text-center text-xs font-medium text-muted-foreground px-4 py-2 cursor-pointer hover:text-foreground"
                  onClick={() => toggleSort("velocity")}
                >
                  <div className="flex items-center justify-center gap-1">
                    Velocity
                    <ArrowUpDown className="w-3 h-3" />
                  </div>
                </th>
                <th className="text-center text-xs font-medium text-muted-foreground px-4 py-2">
                  Status
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedData.map((row) => (
                <>
                  <tr
                    key={row.service}
                    className={cn(
                      "border-b border-border/30 cursor-pointer hover:bg-muted/30 transition-colors",
                      statusRowBg[row.status]
                    )}
                    onClick={() =>
                      setExpandedRow(expandedRow === row.service ? null : row.service)
                    }
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        {expandedRow === row.service ? (
                          <ChevronDown className="w-4 h-4 text-muted-foreground" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground" />
                        )}
                        <span className="font-medium text-sm">{row.service}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-sm">
                      {row.waiting}
                    </td>
                    <td className="px-4 py-3 text-center text-sm">
                      {row.avgWait} min
                    </td>
                    <td className="px-4 py-3 text-center text-sm text-muted-foreground">
                      {row.velocity}/hr
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex justify-center">
                        <span
                          className={cn(
                            "w-2.5 h-2.5 rounded-full",
                            statusDot[row.status]
                          )}
                        />
                      </div>
                    </td>
                  </tr>
                  {expandedRow === row.service && row.nextPatients && (
                    <tr>
                      <td colSpan={5} className="bg-muted/20 px-8 py-3">
                        <p className="text-xs text-muted-foreground mb-2">
                          Next up:
                        </p>
                        <div className="space-y-1">
                          {row.nextPatients.map((patient) => (
                            <div
                              key={patient.id}
                              className="flex items-center justify-between text-sm"
                            >
                              <span className="font-medium">{patient.id}</span>
                              <span className="text-muted-foreground">
                                {patient.name}
                              </span>
                              <span className="text-muted-foreground">
                                {patient.waitTime} min
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
