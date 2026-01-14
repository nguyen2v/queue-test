import { useState } from "react";
import { Phone, Plus, Megaphone, Pause, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface FloatingActionButtonProps {
  onCallNext: () => void;
  onWalkIn?: () => void;
  onAnnouncement?: () => void;
  onPauseQueue?: () => void;
}

const secondaryActions = [
  { id: "walkin", label: "Walk-in Check-in", icon: Plus },
  { id: "announcement", label: "Announcement", icon: Megaphone },
  { id: "pause", label: "Pause Queue", icon: Pause },
];

export function FloatingActionButton({
  onCallNext,
  onWalkIn,
  onAnnouncement,
  onPauseQueue,
}: FloatingActionButtonProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const handleSecondaryAction = (id: string) => {
    setIsExpanded(false);
    switch (id) {
      case "walkin":
        onWalkIn?.();
        break;
      case "announcement":
        onAnnouncement?.();
        break;
      case "pause":
        onPauseQueue?.();
        break;
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Secondary Actions */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.8 }}
            className="flex flex-col gap-2"
          >
            {secondaryActions.map((action, index) => {
              const Icon = action.icon;
              return (
                <motion.div
                  key={action.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                >
                  <Button
                    variant="outline"
                    size="sm"
                    className="bg-card shadow-elevated hover:bg-muted gap-2"
                    onClick={() => handleSecondaryAction(action.id)}
                  >
                    <Icon className="w-4 h-4" />
                    {action.label}
                  </Button>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Primary FAB */}
      <div className="flex items-center gap-2">
        {/* Expand/Collapse Toggle */}
        <Button
          size="icon"
          variant="outline"
          className={cn(
            "rounded-full w-10 h-10 bg-card shadow-elevated transition-transform",
            isExpanded && "rotate-45"
          )}
          onClick={() => setIsExpanded(!isExpanded)}
        >
          {isExpanded ? (
            <X className="w-5 h-5" />
          ) : (
            <Plus className="w-5 h-5" />
          )}
        </Button>

        {/* Call Next Button */}
        <Button
          size="lg"
          className="rounded-full px-6 gap-2 shadow-elevated gradient-teal hover:opacity-90"
          onClick={() => {
            setIsExpanded(false);
            onCallNext();
          }}
        >
          <Phone className="w-5 h-5" />
          Call Next Patient
        </Button>
      </div>

      {/* Keyboard Shortcut Hint */}
      <span className="text-[10px] text-muted-foreground mr-4">
        Press <kbd className="px-1 py-0.5 rounded bg-muted text-muted-foreground font-mono">N</kbd> for quick call
      </span>
    </div>
  );
}
