import { useQueueStore } from "@/store/queueStore";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  User,
  ClipboardList,
  Bell,
  Phone,
  MapPin,
  Globe,
  FileText,
  Lock,
  HelpCircle,
  LogOut,
  ChevronRight,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const menuItems = [
  { icon: ClipboardList, label: 'Visit History', href: '#' },
  { icon: Bell, label: 'Notification Settings', href: '#' },
  { icon: Phone, label: 'Contact Information', href: '#' },
  { icon: MapPin, label: 'Preferred Location', value: 'City Medical Center', href: '#' },
  { icon: Globe, label: 'Language', value: 'English', href: '#' },
];

const bottomLinks = [
  { icon: FileText, label: 'Terms of Service', href: '#' },
  { icon: Lock, label: 'Privacy Policy', href: '#' },
  { icon: HelpCircle, label: 'Help & Support', href: '#' },
];

export function MobileProfile() {
  const { currentPatient } = useQueueStore();
  const navigate = useNavigate();

  return (
    <div className="p-6 space-y-6 animate-fade-in">
      {/* Header */}
      <h1 className="text-2xl font-heading font-bold">Profile</h1>

      {/* Profile Card */}
      <div className="flex flex-col items-center text-center">
        <div className="w-20 h-20 rounded-full gradient-teal flex items-center justify-center">
          <User className="w-10 h-10 text-primary-foreground" />
        </div>
        <h2 className="mt-4 text-xl font-heading font-bold">{currentPatient.name}</h2>
        <p className="text-muted-foreground">{currentPatient.email}</p>
      </div>

      {/* Menu Items */}
      <Card className="divide-y divide-border/50">
        {menuItems.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center justify-between p-4 hover:bg-muted/30 transition-colors touch-target"
          >
            <div className="flex items-center gap-3">
              <item.icon className="w-5 h-5 text-muted-foreground" />
              <span className="font-medium">{item.label}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              {item.value && <span className="text-sm">{item.value}</span>}
              <ChevronRight className="w-4 h-4" />
            </div>
          </button>
        ))}
      </Card>

      {/* Bottom Links */}
      <div className="space-y-2">
        {bottomLinks.map((item) => (
          <button
            key={item.label}
            className="w-full flex items-center gap-3 p-3 text-muted-foreground hover:text-foreground transition-colors"
          >
            <item.icon className="w-5 h-5" />
            <span>{item.label}</span>
          </button>
        ))}
      </div>

      {/* Sign Out */}
      <Button
        variant="ghost"
        className="w-full text-destructive hover:text-destructive hover:bg-destructive/10"
      >
        <LogOut className="w-4 h-4 mr-2" />
        Sign Out
      </Button>
    </div>
  );
}
