import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Download, RefreshCw } from "lucide-react";
import { useQueueStore } from "@/store/queueStore";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const hourlyData = [
  { hour: '8AM', patients: 12 },
  { hour: '9AM', patients: 24 },
  { hour: '10AM', patients: 35 },
  { hour: '11AM', patients: 28 },
  { hour: '12PM', patients: 18 },
  { hour: '1PM', patients: 22 },
  { hour: '2PM', patients: 30 },
  { hour: '3PM', patients: 26 },
  { hour: '4PM', patients: 20 },
  { hour: '5PM', patients: 15 },
];

const waitTimeData = [
  { day: 'Mon', time: 12 },
  { day: 'Tue', time: 15 },
  { day: 'Wed', time: 10 },
  { day: 'Thu', time: 18 },
  { day: 'Fri', time: 14 },
  { day: 'Sat', time: 8 },
  { day: 'Sun', time: 6 },
];

const COLORS = ['hsl(173, 85%, 31%)', 'hsl(25, 95%, 53%)', 'hsl(160, 84%, 39%)', 'hsl(38, 92%, 50%)'];

export function AnalyticsPage() {
  const { services } = useQueueStore();

  const serviceData = services.map((s) => ({
    name: s.name,
    value: s.todayServed,
  }));

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Analytics
          </h1>
          <p className="text-muted-foreground">
            Monitor performance and patient flow
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Refresh
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
        </div>
      </div>

      <Tabs defaultValue="realtime">
        <TabsList>
          <TabsTrigger value="realtime">Real-Time</TabsTrigger>
          <TabsTrigger value="historical">Historical</TabsTrigger>
          <TabsTrigger value="reports">Reports</TabsTrigger>
        </TabsList>

        <TabsContent value="realtime" className="mt-6 space-y-6">
          {/* Live Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card variant="stat" className="bg-primary/5 border-primary/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Current Wait Time</p>
                <p className="text-4xl font-heading font-bold text-primary mt-2">12 min</p>
                <p className="text-xs text-muted-foreground mt-1">Avg across all queues</p>
              </div>
            </Card>
            <Card variant="stat">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Queue Depth</p>
                <p className="text-4xl font-heading font-bold text-foreground mt-2">28</p>
                <p className="text-xs text-muted-foreground mt-1">Patients waiting</p>
              </div>
            </Card>
            <Card variant="stat" className="bg-success/5 border-success/20">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Service Rate</p>
                <p className="text-4xl font-heading font-bold text-success mt-2">24/hr</p>
                <p className="text-xs text-muted-foreground mt-1">Patients per hour</p>
              </div>
            </Card>
          </div>

          {/* Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Hourly Patient Volume</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={hourlyData}>
                      <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                      <XAxis dataKey="hour" className="text-xs" />
                      <YAxis className="text-xs" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: 'hsl(var(--card))',
                          border: '1px solid hsl(var(--border))',
                          borderRadius: '8px',
                        }}
                      />
                      <Bar dataKey="patients" fill="hsl(173, 85%, 31%)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Patients by Service</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64 flex items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={serviceData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {serviceData.map((_, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="flex flex-wrap justify-center gap-4 mt-4">
                  {serviceData.map((service, index) => (
                    <div key={service.name} className="flex items-center gap-2 text-sm">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: COLORS[index % COLORS.length] }}
                      />
                      <span className="text-muted-foreground">{service.name}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="historical" className="mt-6 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Wait Time Trends (This Week)</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={waitTimeData}>
                    <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
                    <XAxis dataKey="day" className="text-xs" />
                    <YAxis className="text-xs" />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: 'hsl(var(--card))',
                        border: '1px solid hsl(var(--border))',
                        borderRadius: '8px',
                      }}
                    />
                    <Line
                      type="monotone"
                      dataKey="time"
                      stroke="hsl(173, 85%, 31%)"
                      strokeWidth={2}
                      dot={{ fill: 'hsl(173, 85%, 31%)', strokeWidth: 2 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="reports" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Generated Reports</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {['Daily Summary', 'Weekly Analysis', 'Monthly Review'].map((report) => (
                  <div
                    key={report}
                    className="flex items-center justify-between p-4 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <div>
                      <p className="font-medium">{report}</p>
                      <p className="text-sm text-muted-foreground">Last generated: Today</p>
                    </div>
                    <Button variant="outline" size="sm">
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
