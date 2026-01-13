import { useQueueStore } from "@/store/queueStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { User, Plus, MoreHorizontal } from "lucide-react";
import { StaffStatus } from "@/types/queue";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const statusColors: Record<StaffStatus, string> = {
  available: 'bg-success',
  busy: 'bg-warning',
  break: 'bg-muted-foreground',
  offline: 'bg-muted',
};

const statusLabels: Record<StaffStatus, string> = {
  available: 'Available',
  busy: 'Busy',
  break: 'On Break',
  offline: 'Offline',
};

export function StaffPage() {
  const { staff, updateStaffStatus } = useQueueStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Staff Management
          </h1>
          <p className="text-muted-foreground">
            Manage staff assignments and schedules
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Staff
        </Button>
      </div>

      <Tabs defaultValue="list">
        <TabsList>
          <TabsTrigger value="list">Staff List</TabsTrigger>
          <TabsTrigger value="schedule">Schedule</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="mt-6">
          <Card>
            <CardContent className="p-0">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left p-4 font-medium text-muted-foreground">Staff</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Role</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Services</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                    <th className="text-left p-4 font-medium text-muted-foreground">Today</th>
                    <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {staff.map((member) => (
                    <tr
                      key={member.id}
                      className="border-b border-border/50 hover:bg-muted/30 transition-colors"
                    >
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-secondary flex items-center justify-center">
                            <User className="w-5 h-5 text-secondary-foreground" />
                          </div>
                          <span className="font-medium">{member.name}</span>
                        </div>
                      </td>
                      <td className="p-4 text-muted-foreground">{member.role}</td>
                      <td className="p-4">
                        <div className="flex flex-wrap gap-1">
                          {member.assignedServices.slice(0, 2).map((service) => (
                            <Badge key={service} variant="secondary" className="text-xs">
                              {service}
                            </Badge>
                          ))}
                          {member.assignedServices.length > 2 && (
                            <Badge variant="secondary" className="text-xs">
                              +{member.assignedServices.length - 2}
                            </Badge>
                          )}
                        </div>
                      </td>
                      <td className="p-4">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="gap-2">
                              <span
                                className={cn(
                                  "w-2 h-2 rounded-full",
                                  statusColors[member.status]
                                )}
                              />
                              {statusLabels[member.status]}
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            {(Object.keys(statusColors) as StaffStatus[]).map((status) => (
                              <DropdownMenuItem
                                key={status}
                                onClick={() => updateStaffStatus(member.id, status)}
                              >
                                <span
                                  className={cn(
                                    "w-2 h-2 rounded-full mr-2",
                                    statusColors[status]
                                  )}
                                />
                                {statusLabels[status]}
                              </DropdownMenuItem>
                            ))}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                      <td className="p-4">
                        <span className="font-medium">{member.patientsServedToday}</span>
                        <span className="text-muted-foreground text-sm"> patients</span>
                      </td>
                      <td className="p-4 text-right">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon-sm">
                              <MoreHorizontal className="w-4 h-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem>View Profile</DropdownMenuItem>
                            <DropdownMenuItem>Edit Assignments</DropdownMenuItem>
                            <DropdownMenuItem>View Schedule</DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="schedule" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Weekly Schedule</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-64 flex items-center justify-center text-muted-foreground">
                Schedule calendar coming soon...
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {staff
              .sort((a, b) => b.patientsServedToday - a.patientsServedToday)
              .map((member, index) => (
                <Card key={member.id} variant="stat">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full bg-secondary flex items-center justify-center">
                        <User className="w-6 h-6 text-secondary-foreground" />
                      </div>
                      {index < 3 && (
                        <span
                          className={cn(
                            "absolute -top-1 -right-1 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-primary-foreground",
                            index === 0 && "bg-warning",
                            index === 1 && "bg-muted-foreground",
                            index === 2 && "bg-high-priority"
                          )}
                        >
                          {index + 1}
                        </span>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-medium">{member.name}</p>
                      <p className="text-sm text-muted-foreground">{member.role}</p>
                    </div>
                  </div>
                  <div className="mt-4 pt-4 border-t border-border/50">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Patients served</span>
                      <span className="font-bold text-lg">{member.patientsServedToday}</span>
                    </div>
                  </div>
                </Card>
              ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
