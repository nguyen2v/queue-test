import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { X, Megaphone, Volume2, Monitor, Smartphone, Clock, Send, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

interface AnnouncementDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend?: (announcement: AnnouncementData) => void;
}

interface AnnouncementData {
  message: string;
  channels: string[];
  priority: "normal" | "important" | "urgent";
  scheduleTime?: string;
}

const channelOptions = [
  { id: "display", label: "TV Displays", icon: Monitor, description: "Show on waiting room screens" },
  { id: "mobile", label: "Mobile App", icon: Smartphone, description: "Push notification to patients" },
  { id: "audio", label: "Audio Announcement", icon: Volume2, description: "Play over PA system" },
];

const quickMessages = [
  "Attention: There is currently a 15-minute delay. We apologize for the inconvenience.",
  "The pharmacy will be closing in 30 minutes. Please collect your prescriptions.",
  "Dr. Smith is now available. Patients waiting for General Medicine, please proceed to Lane 2.",
  "Reminder: Please have your ID and insurance card ready when called.",
];

export function AnnouncementDialog({ open, onOpenChange, onSend }: AnnouncementDialogProps) {
  const [step, setStep] = useState<"compose" | "success">("compose");
  const [message, setMessage] = useState("");
  const [selectedChannels, setSelectedChannels] = useState<string[]>(["display"]);
  const [priority, setPriority] = useState<"normal" | "important" | "urgent">("normal");
  const [isScheduled, setIsScheduled] = useState(false);
  const [scheduleTime, setScheduleTime] = useState("");

  const handleChannelToggle = (channelId: string) => {
    setSelectedChannels(prev =>
      prev.includes(channelId)
        ? prev.filter(c => c !== channelId)
        : [...prev, channelId]
    );
  };

  const handleQuickMessage = (msg: string) => {
    setMessage(msg);
  };

  const handleSend = () => {
    onSend?.({
      message,
      channels: selectedChannels,
      priority,
      scheduleTime: isScheduled ? scheduleTime : undefined,
    });
    setStep("success");
  };

  const handleClose = () => {
    onOpenChange(false);
    setTimeout(() => {
      setStep("compose");
      setMessage("");
      setSelectedChannels(["display"]);
      setPriority("normal");
      setIsScheduled(false);
      setScheduleTime("");
    }, 200);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[520px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b border-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-secondary/10 flex items-center justify-center">
                <Megaphone className="w-5 h-5 text-secondary" />
              </div>
              <DialogTitle className="text-xl font-semibold">
                {step === "compose" ? "Make Announcement" : "Announcement Sent"}
              </DialogTitle>
            </div>
            <Button variant="ghost" size="icon" className="h-8 w-8" onClick={handleClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <AnimatePresence mode="wait">
          {/* Compose Step */}
          {step === "compose" && (
            <motion.div
              key="compose"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="p-6 space-y-5 max-h-[500px] overflow-y-auto"
            >
              {/* Message */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">Message *</Label>
                <Textarea
                  placeholder="Type your announcement message..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="min-h-[100px] resize-none"
                />
                <p className="text-xs text-muted-foreground">
                  {message.length}/280 characters
                </p>
              </div>

              {/* Quick Messages */}
              <div className="space-y-2">
                <Label className="text-sm font-medium text-muted-foreground">Quick Messages</Label>
                <div className="flex flex-wrap gap-2">
                  {quickMessages.map((msg, index) => (
                    <button
                      key={index}
                      onClick={() => handleQuickMessage(msg)}
                      className="text-xs px-3 py-1.5 bg-muted rounded-full hover:bg-muted/80 transition-colors text-left truncate max-w-full"
                    >
                      {msg.substring(0, 50)}...
                    </button>
                  ))}
                </div>
              </div>

              {/* Channels */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Broadcast Channels</Label>
                <div className="space-y-2">
                  {channelOptions.map((channel) => {
                    const Icon = channel.icon;
                    const isSelected = selectedChannels.includes(channel.id);
                    return (
                      <button
                        key={channel.id}
                        onClick={() => handleChannelToggle(channel.id)}
                        className={cn(
                          "w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left",
                          isSelected
                            ? "border-primary bg-primary/5"
                            : "border-border hover:bg-muted/50"
                        )}
                      >
                        <div className={cn(
                          "w-10 h-10 rounded-lg flex items-center justify-center",
                          isSelected ? "bg-primary/10" : "bg-muted"
                        )}>
                          <Icon className={cn("w-5 h-5", isSelected ? "text-primary" : "text-muted-foreground")} />
                        </div>
                        <div className="flex-1">
                          <p className={cn("font-medium text-sm", isSelected && "text-primary")}>
                            {channel.label}
                          </p>
                          <p className="text-xs text-muted-foreground">{channel.description}</p>
                        </div>
                        <div className={cn(
                          "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                          isSelected ? "border-primary bg-primary" : "border-muted-foreground/30"
                        )}>
                          {isSelected && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Priority */}
              <div className="space-y-3">
                <Label className="text-sm font-medium">Priority</Label>
                <div className="flex gap-2">
                  {(["normal", "important", "urgent"] as const).map((p) => (
                    <button
                      key={p}
                      onClick={() => setPriority(p)}
                      className={cn(
                        "flex-1 py-2 px-3 rounded-lg border text-sm font-medium transition-all capitalize",
                        priority === p
                          ? p === "urgent"
                            ? "bg-destructive/10 border-destructive text-destructive"
                            : p === "important"
                            ? "bg-warning/10 border-warning text-warning"
                            : "bg-primary/10 border-primary text-primary"
                          : "border-border hover:bg-muted"
                      )}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>

              {/* Schedule */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="schedule"
                    checked={isScheduled}
                    onCheckedChange={(checked) => setIsScheduled(checked === true)}
                  />
                  <Label htmlFor="schedule" className="text-sm font-medium cursor-pointer">
                    Schedule for later
                  </Label>
                </div>
                {isScheduled && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="flex items-center gap-2"
                  >
                    <Clock className="w-4 h-4 text-muted-foreground" />
                    <Input
                      type="time"
                      value={scheduleTime}
                      onChange={(e) => setScheduleTime(e.target.value)}
                      className="w-auto"
                    />
                  </motion.div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-3 pt-2">
                <Button variant="outline" className="flex-1" onClick={handleClose}>
                  Cancel
                </Button>
                <Button 
                  className="flex-1 gap-2"
                  disabled={!message.trim() || selectedChannels.length === 0}
                  onClick={handleSend}
                >
                  <Send className="w-4 h-4" />
                  {isScheduled ? "Schedule" : "Send Now"}
                </Button>
              </div>
            </motion.div>
          )}

          {/* Success Step */}
          {step === "success" && (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="p-6 text-center"
            >
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", delay: 0.1 }}
                className="w-20 h-20 rounded-full bg-success/10 flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle2 className="w-10 h-10 text-success" />
              </motion.div>

              <h3 className="text-xl font-semibold mb-2">
                {isScheduled ? "Announcement Scheduled!" : "Announcement Sent!"}
              </h3>
              <p className="text-muted-foreground mb-6">
                {isScheduled 
                  ? `Will be broadcast at ${scheduleTime}`
                  : "Your message is now being broadcast"
                }
              </p>

              <div className="bg-muted/30 rounded-xl p-4 mb-6 text-left">
                <p className="text-sm text-muted-foreground mb-2">Message</p>
                <p className="text-sm font-medium">{message}</p>
                <div className="flex items-center gap-2 mt-3 pt-3 border-t border-border">
                  <span className="text-xs text-muted-foreground">Channels:</span>
                  <div className="flex gap-1">
                    {selectedChannels.map(ch => {
                      const channel = channelOptions.find(c => c.id === ch);
                      const Icon = channel?.icon || Monitor;
                      return (
                        <div key={ch} className="w-6 h-6 rounded bg-muted flex items-center justify-center">
                          <Icon className="w-3.5 h-3.5 text-muted-foreground" />
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <Button className="w-full" onClick={handleClose}>
                Done
              </Button>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}
