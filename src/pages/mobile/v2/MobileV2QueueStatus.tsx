import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, BellOff, UserX } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QueueHistoryCard } from "@/components/mobile/queue/QueueHistoryCard";
import { QueueLocationCard } from "@/components/mobile/queue/QueueLocationCard";
import { QueuePositionDisplay } from "@/components/mobile/queue/QueuePositionDisplay";
import { InServiceDisplay } from "@/components/mobile/queue/InServiceDisplay";
import { ItsYourTurnOverlay } from "@/components/mobile/queue/ItsYourTurnOverlay";

export function MobileV2QueueStatus() {
  const { 
    activeQueueEntry, 
    leaveQueue, 
    queue,
    showItsYourTurn,
    itsYourTurnDestination,
    dismissItsYourTurn,
  } = useQueueStore();
  const navigate = useNavigate();
  const [notificationsOn, setNotificationsOn] = useState(true);
  const [stepAwayMode, setStepAwayMode] = useState(false);

  // Calculate position in current location
  const position = activeQueueEntry
    ? queue
        .filter((p) => 
          (p.status === 'waiting' || p.status === 'clinic-suite') && 
          p.currentLocation === activeQueueEntry.currentLocation
        )
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

  const isInService = activeQueueEntry.status === 'in-service';
  const isInClinicSuite = activeQueueEntry.status === 'clinic-suite';
  const isWaiting = activeQueueEntry.status === 'waiting' || activeQueueEntry.status === 'checked-in';

  // Derive status for location card
  const locationStatus = isInService ? 'in-service' : isInClinicSuite ? 'clinic-suite' : 'waiting';

  // Vietnamese labels
  const labels = {
    queueStatus: "Trạng thái hàng đợi",
    yourPosition: "Vị trí của bạn",
    inLine: "trong hàng",
    queueNumber: "Số thứ tự của bạn",
    queueProgress: "Tiến trình hàng đợi",
    almostThere: "Sắp đến lượt!",
    gettingCloser: "Bạn đang đến gần hơn!",
    notificationsOn: "Thông báo BẬT",
    notificationsOff: "Thông báo TẮT",
    notificationsDesc: "Chúng tôi sẽ thông báo khi đến lượt",
    enableNotifications: "Bật để nhận thông tin hàng đợi",
    stepAwayMode: "Chế độ tạm rời",
    stepAwayActive: "Đang bật",
    stepAwayDesc: "Rời phòng chờ, chúng tôi sẽ gọi bạn quay lại",
    leaveQueue: "Rời hàng đợi",
    yourJourney: "Hành trình của bạn",
  };

  return (
    <div className="animate-fade-in">
      {/* It's Your Turn Overlay */}
      <ItsYourTurnOverlay
        isVisible={showItsYourTurn}
        destination={itsYourTurnDestination?.name || ''}
        building={itsYourTurnDestination?.building}
        room={itsYourTurnDestination?.room}
        onDismiss={dismissItsYourTurn}
      />

      {/* Header with gradient */}
      <div 
        className="relative px-5 pt-12 pb-8"
        style={{
          background: isInService 
            ? "linear-gradient(180deg, hsl(173, 85%, 31%) 0%, hsl(173, 75%, 38%) 100%)"
            : isInClinicSuite
            ? "linear-gradient(180deg, hsl(215, 25%, 27%) 0%, hsl(215, 20%, 35%) 100%)"
            : "linear-gradient(180deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 60%) 100%)"
        }}
      >
        <div className="flex items-center justify-between mb-6">
          <button 
            onClick={() => navigate('/mobile/v2')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-semibold">{labels.queueStatus}</h1>
          <div className="w-10" />
        </div>

        {/* In Service - show different header */}
        {isInService ? (
          <div className="text-center text-white">
            <p className="text-white/80 text-sm mb-2">{labels.queueNumber}</p>
            <p className="text-3xl font-bold font-mono">{activeQueueEntry.queueNumber}</p>
          </div>
        ) : (
          /* Position Display for waiting states */
          <QueuePositionDisplay
            queueNumber={activeQueueEntry.queueNumber}
            position={position}
            estimatedWait={estimatedWait}
          />
        )}
      </div>

      {/* Content */}
      <div className="px-5 -mt-4 space-y-4">
        {/* Queue History */}
        {activeQueueEntry.queueHistory && activeQueueEntry.queueHistory.length > 0 && (
          <QueueHistoryCard history={activeQueueEntry.queueHistory} />
        )}

        {/* In Service Display */}
        {isInService && (
          <InServiceDisplay
            serviceName={activeQueueEntry.serviceType}
            building={activeQueueEntry.building}
            room={activeQueueEntry.room}
            staffName={activeQueueEntry.assignedStaff}
          />
        )}

        {/* Location Card for waiting/clinic-suite */}
        {!isInService && (
          <QueueLocationCard
            serviceName={activeQueueEntry.serviceType}
            location={activeQueueEntry.location}
            building={activeQueueEntry.building}
            room={activeQueueEntry.room}
            status={locationStatus}
          />
        )}

        {/* Queue number card */}
        {!isInService && (
          <Card className="p-4 rounded-2xl shadow-sm border bg-primary/5">
            <div className="text-center">
              <p className="text-xs text-muted-foreground mb-1">{labels.queueNumber}</p>
              <p className="text-3xl font-bold font-mono text-primary">
                {activeQueueEntry.queueNumber}
              </p>
            </div>
          </Card>
        )}

        {/* Progress for waiting states */}
        {!isInService && (
          <Card className="p-4 rounded-2xl shadow-sm">
            <p className="text-sm text-muted-foreground mb-3">{labels.queueProgress}</p>
            <div className="flex items-center justify-center gap-2">
              {[1, 2, 3, 4, 5].map((step) => (
                <div
                  key={step}
                  className={`w-4 h-4 rounded-full transition-colors ${
                    step <= 5 - position + 1 ? 'bg-primary' : 'bg-muted'
                  }`}
                />
              ))}
            </div>
            <p className="text-center text-sm text-muted-foreground mt-3">
              {position <= 2 ? labels.almostThere : labels.gettingCloser}
            </p>
          </Card>
        )}

        {/* Action Cards */}
        <div className="space-y-3">
          <Card
            className="p-4 rounded-2xl cursor-pointer transition-all hover:shadow-md"
            onClick={() => setNotificationsOn(!notificationsOn)}
          >
            <div className="flex items-center gap-4">
              <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                notificationsOn ? 'bg-primary/10' : 'bg-muted'
              }`}>
                {notificationsOn ? (
                  <Bell className="w-5 h-5 text-primary" />
                ) : (
                  <BellOff className="w-5 h-5 text-muted-foreground" />
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">
                  {notificationsOn ? labels.notificationsOn : labels.notificationsOff}
                </p>
                <p className="text-sm text-muted-foreground">
                  {notificationsOn ? labels.notificationsDesc : labels.enableNotifications}
                </p>
              </div>
            </div>
          </Card>

          {!isInService && (
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
                    <p className="font-medium">{labels.stepAwayMode}</p>
                    {stepAwayMode && (
                      <span className="text-xs bg-warning/20 text-warning px-2 py-0.5 rounded-full font-medium">
                        {labels.stepAwayActive}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">{labels.stepAwayDesc}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Leave Queue */}
        {!isInService && (
          <div className="pt-4 pb-8">
            <Button
              variant="ghost"
              className="w-full text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
              onClick={handleLeaveQueue}
            >
              {labels.leaveQueue}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
