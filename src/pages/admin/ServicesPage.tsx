import { useQueueStore } from "@/store/queueStore";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Stethoscope, 
  FlaskConical, 
  Syringe, 
  HeartPulse, 
  Plus,
  Users,
  Clock,
  MapPin,
  MoreHorizontal
} from "lucide-react";
import { motion } from "framer-motion";

const iconMap: Record<string, React.ReactNode> = {
  'stethoscope': <Stethoscope className="w-6 h-6" />,
  'flask-conical': <FlaskConical className="w-6 h-6" />,
  'syringe': <Syringe className="w-6 h-6" />,
  'heart-pulse': <HeartPulse className="w-6 h-6" />,
};

export function ServicesPage() {
  const { services } = useQueueStore();

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">
            Services
          </h1>
          <p className="text-muted-foreground">
            Manage service types and their configurations
          </p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Service
        </Button>
      </div>

      {/* Services Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, index) => (
          <motion.div
            key={service.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card variant="interactive" className="h-full">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-lg bg-primary/10 text-primary">
                      {iconMap[service.icon] || <Stethoscope className="w-6 h-6" />}
                    </div>
                    <div>
                      <CardTitle className="text-base">{service.name}</CardTitle>
                      <div className="flex items-center gap-1 mt-1">
                        <span
                          className={`w-2 h-2 rounded-full ${
                            service.isActive ? 'bg-success' : 'bg-muted-foreground'
                          }`}
                        />
                        <span className="text-xs text-muted-foreground">
                          {service.isActive ? 'Active' : 'Inactive'}
                        </span>
                      </div>
                    </div>
                  </div>
                  <Button variant="ghost" size="icon-sm">
                    <MoreHorizontal className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Info */}
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    <span>{service.locations[0]}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="w-4 h-4" />
                    <span>Avg Time: {service.avgServiceTime} min</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Users className="w-4 h-4" />
                    <span>{service.staffCount} staff assigned</span>
                  </div>
                </div>

                {/* Today's Stats */}
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Today:</span>
                    <div className="flex items-center gap-3">
                      <Badge variant="completed">{service.todayServed} served</Badge>
                      <Badge variant="waiting">{service.todayWaiting} waiting</Badge>
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1">
                    Edit
                  </Button>
                  <Button variant="secondary" size="sm" className="flex-1">
                    Manage Staff
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
