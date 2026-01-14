import { useState } from "react";
import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Check, Calendar, Clock, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

type CheckInStep = 'select' | 'confirm' | 'success';

export function MobileV2CheckIn() {
  const { appointments, checkInPatient, activeQueueEntry } = useQueueStore();
  const navigate = useNavigate();
  const [step, setStep] = useState<CheckInStep>('select');
  const [selectedAppointment, setSelectedAppointment] = useState<string | null>(null);

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled'
  );

  const handleContinue = () => {
    if (selectedAppointment) {
      setStep('confirm');
    }
  };

  const handleCheckIn = () => {
    if (selectedAppointment) {
      checkInPatient(selectedAppointment);
      setStep('success');
    }
  };

  const selectedApt = appointments.find((a) => a.id === selectedAppointment);

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
          <h1 className="text-white font-semibold">Đăng ký khám</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 py-6">
        <AnimatePresence mode="wait">
          {/* Step 1: Select Appointment */}
          {step === 'select' && (
            <motion.div
              key="select"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Chọn lịch hẹn</h2>

              <div className="space-y-3">
                {upcomingAppointments.map((apt) => (
                  <Card
                    key={apt.id}
                    className={`p-4 cursor-pointer transition-all rounded-2xl ${
                      selectedAppointment === apt.id
                        ? 'ring-2 ring-[hsl(221,83%,53%)] border-[hsl(221,83%,53%)] bg-[hsl(221,83%,97%)]'
                        : 'border shadow-sm'
                    }`}
                    onClick={() => setSelectedAppointment(apt.id)}
                  >
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-6 h-6 rounded-full border-2 flex items-center justify-center mt-0.5 ${
                          selectedAppointment === apt.id
                            ? 'border-[hsl(221,83%,53%)] bg-[hsl(221,83%,53%)]'
                            : 'border-muted-foreground'
                        }`}
                      >
                        {selectedAppointment === apt.id && (
                          <Check className="w-3.5 h-3.5 text-white" />
                        )}
                      </div>
                      <div className="flex-1">
                        <p className="font-semibold">
                          {apt.doctorName ? `${apt.doctorName} - ` : ''}{apt.serviceType}
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">
                          {new Date(apt.dateTime).toLocaleDateString('vi-VN', {
                            weekday: 'long',
                            month: 'short',
                            day: 'numeric',
                          })}, {new Date(apt.dateTime).toLocaleTimeString('vi-VN', {
                            hour: 'numeric',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>
                  </Card>
                ))}

                <div className="relative py-4">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center">
                    <span className="bg-background px-4 text-sm text-muted-foreground">Hoặc</span>
                  </div>
                </div>

                <Card className="p-4 cursor-pointer rounded-2xl border shadow-sm hover:bg-muted/50 transition-colors">
                  <p className="font-medium text-center text-[hsl(221,83%,53%)]">+ Đăng ký khám mới</p>
                </Card>
              </div>

              <Button
                size="lg"
                className="w-full rounded-xl bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]"
                disabled={!selectedAppointment}
                onClick={handleContinue}
              >
                Tiếp tục
              </Button>
            </motion.div>
          )}

          {/* Step 2: Confirm */}
          {step === 'confirm' && selectedApt && (
            <motion.div
              key="confirm"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="space-y-6"
            >
              <h2 className="text-xl font-bold">Xác nhận thông tin</h2>

              <Card className="p-5 space-y-4 rounded-2xl shadow-sm">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[hsl(221,83%,95%)] flex items-center justify-center">
                    <Calendar className="w-5 h-5 text-[hsl(221,83%,53%)]" />
                  </div>
                  <div>
                    <p className="font-semibold">{selectedApt.serviceType}</p>
                    <p className="text-sm text-muted-foreground">
                      {selectedApt.doctorName || 'Khám tổng quát'}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <Clock className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm">
                    {new Date(selectedApt.dateTime).toLocaleString('vi-VN', {
                      weekday: 'long',
                      month: 'long',
                      day: 'numeric',
                      hour: 'numeric',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center">
                    <MapPin className="w-5 h-5 text-muted-foreground" />
                  </div>
                  <p className="text-sm">{selectedApt.location}</p>
                </div>
              </Card>

              <div className="flex gap-3">
                <Button 
                  variant="outline" 
                  className="flex-1 rounded-xl" 
                  onClick={() => setStep('select')}
                >
                  Quay lại
                </Button>
                <Button 
                  className="flex-1 rounded-xl bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]" 
                  onClick={handleCheckIn}
                >
                  Xác nhận
                </Button>
              </div>
            </motion.div>
          )}

          {/* Step 3: Success */}
          {step === 'success' && activeQueueEntry && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-6"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.2 }}
                className="w-20 h-20 rounded-full bg-[hsl(140,60%,90%)] flex items-center justify-center"
              >
                <Check className="w-10 h-10 text-[hsl(140,60%,40%)]" />
              </motion.div>

              <div>
                <h2 className="text-2xl font-bold">Đăng ký thành công!</h2>
                <p className="text-muted-foreground mt-2">
                  Số thứ tự: <span className="font-mono font-bold text-[hsl(221,83%,53%)]">{activeQueueEntry.queueNumber}</span>
                </p>
              </div>

              <Card className="p-5 w-full text-left space-y-3 rounded-2xl shadow-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Vị trí</span>
                  <span className="font-bold">5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Thời gian chờ</span>
                  <span className="font-bold">~{activeQueueEntry.estimatedWaitMinutes} phút</span>
                </div>
                <div className="pt-3 border-t border-border/50">
                  <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <MapPin className="w-4 h-4" />
                    {activeQueueEntry.serviceType}
                  </div>
                  <p className="text-sm text-muted-foreground mt-1">{activeQueueEntry.location}</p>
                </div>
              </Card>

              <div className="space-y-3 w-full pt-4">
                <div className="p-4 bg-[hsl(221,83%,97%)] rounded-xl">
                  <p className="text-sm text-muted-foreground">
                    💡 <strong>Mẹo:</strong> Bật thông báo để được nhắc khi đến lượt
                  </p>
                </div>
                <Button 
                  size="lg" 
                  className="w-full rounded-xl bg-[hsl(221,83%,53%)] hover:bg-[hsl(221,83%,45%)]" 
                  onClick={() => navigate('/mobile/v2/queue')}
                >
                  Xem trạng thái hàng đợi
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
