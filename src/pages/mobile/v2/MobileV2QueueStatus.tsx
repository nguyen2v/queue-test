import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, BellOff, UserX, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { QueueHistoryCard } from "@/components/mobile/queue/QueueHistoryCard";
import { QueueLocationCard } from "@/components/mobile/queue/QueueLocationCard";
import { QueuePositionDisplay } from "@/components/mobile/queue/QueuePositionDisplay";
import { InServiceDisplay } from "@/components/mobile/queue/InServiceDisplay";
import { ItsYourTurnScreen } from "@/components/mobile/queue/ItsYourTurnScreen";
import { QueueStatusCard } from "@/components/mobile/queue/QueueStatusCard";
import { QueueTestButtons } from "@/components/mobile/queue/QueueTestButtons";
import { QUEUE_LOCATIONS } from "@/types/queue";

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
  const currentLocation = activeQueueEntry.currentLocation || 'general-waiting';
  const locationInfo = QUEUE_LOCATIONS[currentLocation];
  const isRadiology = currentLocation === 'radiology';
  const isInClinicSuite = activeQueueEntry.status === 'clinic-suite' || currentLocation === 'clinic-suite';

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
    currentLocation: "Vị trí hiện tại",
    service: "Dịch vụ",
  };

  // Determine current test state
  const getCurrentTestState = (): 'waiting' | 'your-turn' | 'in-service' | 'radiology' => {
    if (showItsYourTurn) return 'your-turn';
    if (isRadiology) return 'radiology';
    if (isInService) return 'in-service';
    return 'waiting';
  };

  // Determine status card state
  const getStatusCardState = (): 'waiting' | 'your-turn' | 'in-service' | 'queue' => {
    if (showItsYourTurn) return 'your-turn';
    if (isInService) return 'in-service';
    return 'waiting';
  };

  return (
    <div className="animate-fade-in min-h-screen bg-background">
      {/* Header with gradient */}
      <div 
        className="relative px-5 pt-12 pb-6"
        style={{
          background: isInService 
            ? "linear-gradient(180deg, hsl(var(--success)) 0%, hsl(var(--success) / 0.8) 100%)"
            : showItsYourTurn
            ? "linear-gradient(180deg, hsl(var(--accent)) 0%, hsl(var(--accent) / 0.8) 100%)"
            : "linear-gradient(180deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 60%) 100%)"
        }}
      >
        <div className="flex items-center justify-between mb-4">
          <button 
            onClick={() => navigate('/mobile/v2')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-semibold">{labels.queueStatus}</h1>
          <div className="w-10" />
        </div>

        {/* Position Display */}
        <div className="text-center text-white">
          <p className="text-white/80 text-sm mb-2">{labels.yourPosition}</p>
          <div className="w-24 h-24 rounded-full bg-white/20 backdrop-blur-sm mx-auto flex items-center justify-center mb-3">
            <span className="text-4xl font-bold">{isInService ? '—' : position}</span>
          </div>
          <p className="text-white/80 text-sm">{labels.inLine}</p>
          
          {!isInService && (
            <>
              <p className="text-white/80 text-sm mt-4">Estimated Wait</p>
              <p className="text-2xl font-bold">~{estimatedWait} minutes</p>
            </>
          )}

          {/* Current Location Badge */}
          <div className="flex items-center justify-center gap-2 mt-4 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mx-auto w-fit">
            <MapPin className="w-4 h-4" />
            <span className="text-sm font-medium">{locationInfo?.name || 'General Waiting Room'}</span>
          </div>
        </div>
      </div>

      {/* Queue Number Card */}
      <div className="px-5 -mt-4">
        <Card className="p-4 rounded-2xl shadow-lg text-center">
          <p className="text-xs text-muted-foreground mb-1">{labels.queueNumber}</p>
          <p className="text-3xl font-bold font-mono text-primary">
            {activeQueueEntry.queueNumber}
          </p>
        </Card>
      </div>

      {/* Content */}
      <div className="px-5 pt-4 space-y-4 pb-8">
        {/* Floating Status Card */}
        <QueueStatusCard
          currentLocation={currentLocation}
          status={getStatusCardState()}
          position={position}
          estimatedWait={estimatedWait}
          queueNumber={activeQueueEntry.queueNumber}
          building={activeQueueEntry.building}
          room={activeQueueEntry.room}
          serviceName={activeQueueEntry.serviceType}
        />

        {/* It's Your Turn - Inline (non-blocking) */}
        {showItsYourTurn && (
          <ItsYourTurnScreen
            destination={itsYourTurnDestination?.name || ''}
            building={itsYourTurnDestination?.building}
            room={itsYourTurnDestination?.room}
            queueNumber={activeQueueEntry.queueNumber}
            onDismiss={dismissItsYourTurn}
          />
        )}

        {/* In Service Display */}
        {isInService && !showItsYourTurn && (
          <InServiceDisplay
            serviceName={activeQueueEntry.serviceType}
            building={activeQueueEntry.building}
            room={activeQueueEntry.room}
            staffName={activeQueueEntry.assignedStaff}
          />
        )}

        {/* Queue History */}
        {activeQueueEntry.queueHistory && activeQueueEntry.queueHistory.length > 0 && (
          <QueueHistoryCard history={activeQueueEntry.queueHistory} />
        )}

        {/* Location Details Card */}
        <Card className="p-4 rounded-2xl shadow-sm">
          <p className="text-sm font-medium text-foreground mb-3">{labels.currentLocation}</p>
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="font-semibold text-foreground">{locationInfo?.name}</p>
              <p className="text-sm text-muted-foreground">
                {activeQueueEntry.building && activeQueueEntry.building}
                {activeQueueEntry.building && activeQueueEntry.room && ", "}
                {activeQueueEntry.room}
              </p>
              <p className="text-sm text-muted-foreground mt-1">
                {labels.service}: {activeQueueEntry.serviceType}
              </p>
            </div>
          </div>
        </Card>

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

        {/* Test Buttons */}
        <QueueTestButtons currentState={getCurrentTestState()} />

        {/* Leave Queue */}
        {!isInService && (
          <div className="pt-4">
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
