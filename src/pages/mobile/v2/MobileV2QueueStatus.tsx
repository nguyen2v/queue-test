import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, MapPin, Bell, BellOff, UserX, Clock, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState, useEffect } from "react";

export function MobileV2QueueStatus() {
  const { activeQueueEntry, leaveQueue, queue } = useQueueStore();
  const navigate = useNavigate();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [stepAwayMode, setStepAwayMode] = useState(false);

  // Calculate position
  const position = activeQueueEntry
    ? queue
        .filter((p) => p.status === 'waiting' && p.serviceType === activeQueueEntry.serviceType)
        .sort((a, b) => new Date(a.checkInTime).getTime() - new Date(b.checkInTime).getTime())
        .findIndex((p) => p.id === activeQueueEntry.id) + 1
    : 0;

  const estimatedWait = position * 5; // 5 min per patient

  useEffect(() => {
    if (!activeQueueEntry) {
      navigate('/mobile/v2');
    }
  }, [activeQueueEntry, navigate]);

  if (!activeQueueEntry) {
    return (
      <div className="p-6 flex flex-col items-center justify-center min-h-[80vh]">
        <p className="text-muted-foreground">Bạn chưa có trong hàng đợi</p>
        <Button onClick={() => navigate('/mobile/v2')} className="mt-4">
          Về trang chủ
        </Button>
      </div>
    );
  }

  const handleLeaveQueue = () => {
    leaveQueue();
    navigate('/mobile/v2');
  };

  return (
    <div className="animate-fade-in">
      {/* Header with gradient */}
      <div 
        className="relative px-5 pt-12 pb-8"
        style={{
          background: "linear-gradient(180deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 60%) 100%)"
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/mobile/v2')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-semibold">Trạng thái hàng đợi</h1>
          <div className="w-10" />
        </div>

        {/* Position Display */}
        <div className="flex flex-col items-center">
          <p className="text-white/80 text-sm mb-3">Vị trí của bạn</p>
          <motion.div
            className="relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
          >
            <div className="w-28 h-28 rounded-full bg-white flex items-center justify-center relative shadow-xl">
              <span className="text-5xl font-bold text-[hsl(221,83%,53%)]">
                {position}
              </span>
              <div className="absolute inset-0 rounded-full border-4 border-white/50 animate-pulse" />
            </div>
          </motion.div>
          <p className="text-white/80 mt-3">trong hàng</p>
        </div>
      </div>

      {/* Content */}
      <div className="px-5 -mt-4 space-y-4">
        {/* Wait time & service info card */}
        <Card className="p-5 rounded-2xl shadow-lg border-0">
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(221,83%,95%)] flex items-center justify-center mx-auto mb-2">
                <Clock className="w-6 h-6 text-[hsl(221,83%,53%)]" />
              </div>
              <p className="text-2xl font-bold text-foreground">~{estimatedWait}</p>
              <p className="text-xs text-muted-foreground">phút chờ</p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 rounded-full bg-[hsl(221,83%,95%)] flex items-center justify-center mx-auto mb-2">
                <Users className="w-6 h-6 text-[hsl(221,83%,53%)]" />
              </div>
              <p className="text-2xl font-bold text-foreground">{position}</p>
              <p className="text-xs text-muted-foreground">người trước</p>
            </div>
          </div>
          
          <div className="border-t pt-4">
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4 text-[hsl(221,83%,53%)]" />
              <span className="text-sm">{activeQueueEntry.serviceType}</span>
            </div>
            <p className="text-xs text-muted-foreground mt-1 ml-6">{activeQueueEntry.location}</p>
          </div>
        </Card>

        {/* Queue number */}
        <Card className="p-4 rounded-2xl shadow-sm border bg-[hsl(221,83%,97%)]">
          <div className="text-center">
            <p className="text-xs text-muted-foreground mb-1">Số thứ tự của bạn</p>
            <p className="text-3xl font-bold font-mono text-[hsl(221,83%,53%)]">
              {activeQueueEntry.queueNumber}
            </p>
          </div>
        </Card>

        {/* Progress */}
        <Card className="p-4 rounded-2xl shadow-sm">
          <p className="text-sm text-muted-foreground mb-3">Tiến trình hàng đợi</p>
          <div className="flex items-center justify-center gap-2">
            {[1, 2, 3, 4, 5].map((step) => (
              <div
                key={step}
                className={`w-4 h-4 rounded-full transition-colors ${
                  step <= 5 - position + 1 ? 'bg-[hsl(221,83%,53%)]' : 'bg-muted'
                }`}
              />
            ))}
          </div>
          <p className="text-center text-sm text-muted-foreground mt-3">
            {position <= 2 ? "Sắp đến lượt!" : "Bạn đang đến gần hơn!"}
          </p>
        </Card>

        {/* Action Cards */}
        <div className="space-y-3">
          <Card
            className="p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
            onClick={() => setNotificationsOn(!notificationsOn)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                notificationsOn ? 'bg-[hsl(221,83%,95%)]' : 'bg-muted'
              }`}>
                {notificationsOn ? (
                  <Bell className="w-5 h-5 text-[hsl(221,83%,53%)]" />
                ) : (
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">Thông báo {notificationsOn ? 'BẬT' : 'TẮT'}</p>
                <p className="text-sm text-muted-foreground">
                  {notificationsOn
                    ? "Chúng tôi sẽ thông báo khi đến lượt"
                    : "Bật để nhận thông tin hàng đợi"}
                </p>
              </div>
            </div>
          </Card>

          <Card
            className="p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
            onClick={() => setStepAwayMode(!stepAwayMode)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                stepAwayMode ? 'bg-warning/10' : 'bg-muted'
              }`}>
                <UserX className={`w-5 h-5 ${stepAwayMode ? 'text-warning' : 'text-muted-foreground'}`} />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <p className="font-medium">Chế độ tạm rời</p>
                  {stepAwayMode && (
                    <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full font-medium">
                      Đang bật
                    </span>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  Rời phòng chờ, chúng tôi sẽ gọi bạn quay lại
                </p>
              </div>
            </div>
          </Card>
        </div>

        {/* Leave Queue */}
        <div className="pt-4 pb-8">
          <Button
            variant="ghost"
            className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
            onClick={handleLeaveQueue}
          >
            Rời hàng đợi
          </Button>
        </div>
      </div>
    </div>
  );
}
