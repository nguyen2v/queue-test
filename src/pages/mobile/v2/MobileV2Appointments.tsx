import { useQueueStore } from "@/store/queueStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Calendar, Clock, MapPin, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function MobileV2Appointments() {
  const { appointments } = useQueueStore();
  const navigate = useNavigate();

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled' && new Date(apt.dateTime) > new Date()
  );

  const pastAppointments = appointments.filter(
    (apt) => apt.status !== 'scheduled' || new Date(apt.dateTime) <= new Date()
  );

  return (
    <div className="animate-fade-in">
      {/* Header with gradient */}
      <div 
        className="relative px-5 pt-12 pb-6"
        style={{
          background: "linear-gradient(180deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 60%) 100%)"
        }}
      >
        <div className="flex items-center justify-between">
          <button 
            onClick={() => navigate('/mobile/v2')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-semibold">Lịch hẹn</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 py-6 space-y-6">
        {/* Upcoming Appointments */}
        <div>
          <h2 className="text-lg font-bold mb-4">Lịch hẹn sắp tới</h2>
          {upcomingAppointments.length === 0 ? (
            <Card className="p-6 rounded-2xl text-center">
              <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mx-auto mb-3">
                <Calendar className="w-6 h-6 text-muted-foreground" />
              </div>
              <p className="text-muted-foreground text-sm">Không có lịch hẹn sắp tới</p>
              <Button 
                className="mt-4 rounded-xl bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
                onClick={() => navigate('/mobile/v2/checkin')}
              >
                Đặt lịch mới
              </Button>
            </Card>
          ) : (
            <div className="space-y-3">
              {upcomingAppointments.map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Card className="p-4 rounded-2xl shadow-sm">
                    <div className="flex items-start gap-3">
                      <div className="w-12 h-12 rounded-xl bg-[hsl(221,83%,95%)] flex items-center justify-center">
                        <Calendar className="w-6 h-6 text-[hsl(221,83%,53%)]" />
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">{apt.serviceType}</p>
                        {apt.doctorName && (
                          <div className="flex items-center gap-1 text-sm text-muted-foreground mt-1">
                            <User className="w-3.5 h-3.5" />
                            {apt.doctorName}
                          </div>
                        )}
                        <div className="flex items-center gap-3 mt-2 text-sm text-muted-foreground">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {new Date(apt.dateTime).toLocaleTimeString('vi-VN', {
                              hour: 'numeric',
                              minute: '2-digit',
                            })}
                          </span>
                          <span>
                            {new Date(apt.dateTime).toLocaleDateString('vi-VN', {
                              day: 'numeric',
                              month: 'short',
                            })}
                          </span>
                        </div>
                        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
                          <MapPin className="w-3.5 h-3.5" />
                          {apt.location}
                        </div>
                      </div>
                    </div>
                    <div className="mt-4 pt-3 border-t">
                      <Button 
                        className="w-full rounded-xl bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
                        onClick={() => navigate('/mobile/v2/checkin')}
                      >
                        Đăng ký khám
                      </Button>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Past Appointments */}
        {pastAppointments.length > 0 && (
          <div>
            <h2 className="text-lg font-bold mb-4">Lịch sử khám</h2>
            <div className="space-y-3">
              {pastAppointments.slice(0, 3).map((apt, index) => (
                <motion.div
                  key={apt.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + index * 0.1 }}
                >
                  <Card className="p-4 rounded-2xl shadow-sm bg-muted/30">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                        <Calendar className="w-5 h-5 text-muted-foreground" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium text-sm">{apt.serviceType}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(apt.dateTime).toLocaleDateString('vi-VN', {
                            day: 'numeric',
                            month: 'long',
                            year: 'numeric',
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
