import { useQueueStore } from "@/store/queueStore";
import { Search, QrCode, Bell, Calendar, MessageSquare, Star, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card } from "@/components/ui/card";
import logo from "@/assets/logo.png";

export function MobileV2Home() {
  const { currentPatient, appointments, activeQueueEntry, notifications } = useQueueStore();
  const navigate = useNavigate();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const upcomingAppointments = appointments.filter(
    (apt) => apt.status === 'scheduled' && new Date(apt.dateTime) > new Date()
  );

  // If patient is in queue, show queue status instead
  if (activeQueueEntry) {
    navigate('/mobile/v2/queue');
    return null;
  }

  // Mock doctors data
  const doctors = [
    { id: 1, name: "TS. Giang Thiên Vũ", hospital: "BV Đại học Y Dược, Phòng khá...", specialties: ["Khám nội tổng quát", "Xương khớp"], reviews: 50, rating: 5 },
    { id: 2, name: "BS. Nguyễn Văn An", hospital: "BV Chợ Rẫy", specialties: ["Tim mạch", "Nội khoa"], reviews: 32, rating: 4.8 },
  ];

  // Mock articles
  const articles = [
    { id: 1, title: "Kết quả phẫu thuật cố định cột sống tại bệnh viện hữu nghị Việt Đ...", image: "https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=100&h=100&fit=crop" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header with gradient background */}
      <div 
        className="relative px-5 pt-12 pb-32"
        style={{
          background: "linear-gradient(180deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 60%) 50%, hsl(221, 83%, 65%) 100%)"
        }}
      >
        {/* Top row: Avatar, greeting, icons */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Avatar className="w-12 h-12 border-2 border-white/30">
              <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&h=100&fit=crop" />
              <AvatarFallback className="bg-white/20 text-white">
                {currentPatient.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-white/80 text-sm">Chào bạn</p>
              <p className="text-white font-semibold">{currentPatient.name}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button 
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
              onClick={() => navigate('/mobile/v2/scan')}
            >
              <QrCode className="w-5 h-5 text-white" />
            </button>
            <button 
              className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center relative"
              onClick={() => navigate('/mobile/v2/messages')}
            >
              <Bell className="w-5 h-5 text-white" />
              {unreadCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-destructive text-destructive-foreground text-[10px] font-bold rounded-full flex items-center justify-center">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Search bar */}
        <div className="relative mb-4">
          <div className="bg-white rounded-xl px-4 py-3 flex items-center gap-3 shadow-lg">
            <Search className="w-5 h-5 text-muted-foreground" />
            <input 
              type="text" 
              placeholder="Nhập tên bác sĩ, loại bệnh" 
              className="flex-1 bg-transparent outline-none text-sm text-foreground placeholder:text-muted-foreground"
            />
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-white rounded-xl px-4 py-3 flex items-center gap-2 shadow-md"
            onClick={() => navigate('/mobile/v2/online')}
          >
            <div className="w-8 h-8 rounded-full bg-[hsl(221,83%,95%)] flex items-center justify-center">
              <MessageSquare className="w-4 h-4 text-[hsl(221,83%,53%)]" />
            </div>
            <span className="text-sm font-medium text-[hsl(221,83%,53%)]">Tư vấn trực tuyến</span>
          </motion.button>
          <motion.button
            whileTap={{ scale: 0.98 }}
            className="flex-1 bg-[hsl(221,83%,65%)] rounded-xl px-4 py-3 flex items-center gap-2 shadow-md"
            onClick={() => navigate('/mobile/v2/checkin')}
          >
            <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-white" />
            </div>
            <span className="text-sm font-medium text-white">Đặt lịch offline</span>
          </motion.button>
        </div>
      </div>

      {/* Banner card - overlapping the header */}
      <div className="px-5 -mt-16 mb-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-[hsl(221,83%,95%)] to-[hsl(221,83%,90%)] border-0 p-5">
            <div className="flex items-center gap-2 mb-2">
              <img src={logo} alt="Caremate" className="w-6 h-6 rounded-md" />
              <span className="text-[hsl(140,60%,40%)] font-semibold text-sm">Caremate</span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              Khám và điều trị<br />đa khoa
            </h3>
            <div className="absolute right-0 bottom-0 w-32 h-32 opacity-80">
              <img 
                src="https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=200&h=200&fit=crop" 
                alt="Doctor" 
                className="w-full h-full object-cover rounded-tl-3xl"
              />
              <div className="absolute top-2 right-2">
                <Star className="w-5 h-5 text-yellow-400 fill-yellow-400" />
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Doctor list section */}
      <div className="px-5 mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Danh sách bác sĩ</h2>
          <button className="text-[hsl(221,83%,53%)] text-sm font-medium flex items-center gap-1">
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-5 px-5">
          {doctors.map((doctor, index) => (
            <motion.div
              key={doctor.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 + index * 0.1 }}
            >
              <Card className="min-w-[280px] p-4 rounded-2xl border shadow-sm">
                <div className="flex gap-3">
                  <Avatar className="w-16 h-16 rounded-xl">
                    <AvatarImage src={`https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=100&h=100&fit=crop&seed=${doctor.id}`} />
                    <AvatarFallback className="rounded-xl bg-muted">
                      {doctor.name.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-sm truncate">{doctor.name}</h3>
                    <p className="text-xs text-muted-foreground truncate">{doctor.hospital}</p>
                    <div className="flex flex-wrap gap-1 mt-2">
                      {doctor.specialties.map((spec, i) => (
                        <span key={i} className="text-[10px] bg-muted px-2 py-0.5 rounded-full">
                          {spec}
                        </span>
                      ))}
                    </div>
                    <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {doctor.reviews}
                      </span>
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        {doctor.rating}
                      </span>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Articles section */}
      <div className="px-5 pb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Bài viết</h2>
          <button className="text-[hsl(221,83%,53%)] text-sm font-medium flex items-center gap-1">
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
        
        {articles.map((article, index) => (
          <motion.div
            key={article.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
          >
            <Card className="p-3 rounded-xl border shadow-sm flex gap-3">
              <img 
                src={article.image} 
                alt={article.title} 
                className="w-20 h-20 rounded-lg object-cover"
              />
              <div className="flex-1">
                <p className="text-sm font-medium leading-snug line-clamp-3">{article.title}</p>
              </div>
            </Card>
          </motion.div>
        ))}
      </div>
    </div>
  );
}
