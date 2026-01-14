import { useQueueStore } from "@/store/queueStore";
import { Card } from "@/components/ui/card";
import { ArrowLeft, User, Phone, Mail, MapPin, Calendar, ChevronRight, Settings, HelpCircle, LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MobileV2Profile() {
  const { currentPatient } = useQueueStore();
  const navigate = useNavigate();

  const menuItems = [
    { icon: User, label: "Thông tin cá nhân", to: "#" },
    { icon: Calendar, label: "Lịch sử khám", to: "#" },
    { icon: Settings, label: "Cài đặt", to: "#" },
    { icon: HelpCircle, label: "Trợ giúp", to: "#" },
  ];

  return (
    <div className="animate-fade-in">
      {/* Header with gradient */}
      <div 
        className="relative px-5 pt-12 pb-20"
        style={{
          background: "linear-gradient(180deg, hsl(221, 83%, 53%) 0%, hsl(221, 83%, 60%) 100%)"
        }}
      >
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={() => navigate('/mobile/v2')}
            className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center"
          >
            <ArrowLeft className="w-5 h-5 text-white" />
          </button>
          <h1 className="text-white font-semibold">Tài khoản</h1>
          <div className="w-10" />
        </div>
      </div>

      {/* Profile Card - overlapping header */}
      <div className="px-5 -mt-16 mb-6">
        <Card className="p-6 rounded-2xl shadow-lg text-center">
          <Avatar className="w-20 h-20 mx-auto border-4 border-white shadow-lg -mt-16">
            <AvatarImage src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&h=150&fit=crop" />
            <AvatarFallback className="text-2xl bg-[hsl(221,83%,53%)] text-white">
              {currentPatient.name.charAt(0)}
            </AvatarFallback>
          </Avatar>
          <h2 className="text-xl font-bold mt-4">{currentPatient.name}</h2>
          <p className="text-sm text-muted-foreground">Bệnh nhân</p>
          
          <div className="grid grid-cols-2 gap-4 mt-6 pt-4 border-t">
            <div className="flex items-center gap-2 text-sm">
              <Phone className="w-4 h-4 text-[hsl(221,83%,53%)]" />
              <span className="text-muted-foreground">{currentPatient.phone}</span>
            </div>
            <div className="flex items-center gap-2 text-sm">
              <Mail className="w-4 h-4 text-[hsl(221,83%,53%)]" />
              <span className="text-muted-foreground truncate">{currentPatient.email}</span>
            </div>
          </div>
        </Card>
      </div>

      {/* Menu Items */}
      <div className="px-5 space-y-3">
        {menuItems.map((item, index) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card 
              className="p-4 rounded-2xl cursor-pointer hover:bg-muted/50 transition-colors"
              onClick={() => navigate(item.to)}
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[hsl(221,83%,95%)] flex items-center justify-center">
                  <item.icon className="w-5 h-5 text-[hsl(221,83%,53%)]" />
                </div>
                <span className="flex-1 font-medium">{item.label}</span>
                <ChevronRight className="w-5 h-5 text-muted-foreground" />
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Logout */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: menuItems.length * 0.1 }}
        >
          <Card className="p-4 rounded-2xl cursor-pointer hover:bg-destructive/5 transition-colors mt-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-destructive/10 flex items-center justify-center">
                <LogOut className="w-5 h-5 text-destructive" />
              </div>
              <span className="flex-1 font-medium text-destructive">Đăng xuất</span>
            </div>
          </Card>
        </motion.div>
      </div>

      <div className="px-5 py-8 text-center">
        <p className="text-xs text-muted-foreground">Phiên bản 2.0.0</p>
      </div>
    </div>
  );
}
