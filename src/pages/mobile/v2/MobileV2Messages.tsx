import { useQueueStore } from "@/store/queueStore";
import { Card } from "@/components/ui/card";
import { ArrowLeft, Bell, Check, Clock } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

export function MobileV2Messages() {
  const { notifications, markNotificationRead } = useQueueStore();
  const navigate = useNavigate();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'queue_update':
        return <Clock className="w-5 h-5 text-[hsl(221,83%,53%)]" />;
      case 'called':
        return <Bell className="w-5 h-5 text-[hsl(140,60%,40%)]" />;
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />;
    }
  };

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
          <h1 className="text-white font-semibold">Tin nhắn</h1>
          <div className="w-10" />
        </div>
      </div>

      <div className="px-5 py-6 space-y-4">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Bell className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">Không có tin nhắn mới</p>
          </div>
        ) : (
          notifications.map((notification, index) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card 
                className={`p-4 rounded-2xl cursor-pointer transition-all ${
                  notification.read 
                    ? 'bg-background border shadow-sm' 
                    : 'bg-[hsl(221,83%,97%)] border-[hsl(221,83%,90%)]'
                }`}
                onClick={() => markNotificationRead(notification.id)}
              >
                <div className="flex gap-3">
                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                    notification.read ? 'bg-muted' : 'bg-[hsl(221,83%,90%)]'
                  }`}>
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`font-medium text-sm ${!notification.read && 'text-[hsl(221,83%,40%)]'}`}>
                        {notification.title}
                      </p>
                      {notification.read && (
                        <Check className="w-4 h-4 text-muted-foreground flex-shrink-0" />
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-muted-foreground mt-2">
                      {new Date(notification.timestamp).toLocaleTimeString('vi-VN', {
                        hour: 'numeric',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}
