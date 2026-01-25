import { motion, AnimatePresence } from "framer-motion";
import { Bell, ArrowRight, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ItsYourTurnOverlayProps {
  isVisible: boolean;
  destination: string;
  room?: string;
  building?: string;
  onDismiss: () => void;
}

export function ItsYourTurnOverlay({
  isVisible,
  destination,
  room,
  building,
  onDismiss,
}: ItsYourTurnOverlayProps) {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-foreground/60 backdrop-blur-sm p-6"
          onClick={onDismiss}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 10 }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="bg-card rounded-3xl p-8 max-w-sm w-full text-center shadow-elevated"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Animated bell icon */}
            <motion.div
              initial={{ rotate: -15 }}
              animate={{ rotate: [15, -15, 15, -15, 0] }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="w-20 h-20 rounded-full gradient-coral mx-auto mb-6 flex items-center justify-center"
            >
              <Bell className="w-10 h-10 text-accent-foreground" />
            </motion.div>

            {/* Title */}
            <motion.h2
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-2xl font-heading font-bold text-foreground mb-2"
            >
              It's Your Turn!
            </motion.h2>

            {/* Subtitle */}
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="text-muted-foreground mb-6"
            >
              Please proceed to your destination
            </motion.p>

            {/* Destination info */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-primary/5 rounded-2xl p-4 mb-6"
            >
              <div className="flex items-center justify-center gap-2 text-primary mb-1">
                <MapPin className="w-4 h-4" />
                <span className="font-semibold">{destination}</span>
              </div>
              {(building || room) && (
                <p className="text-sm text-muted-foreground">
                  {building && `${building}`}
                  {building && room && ", "}
                  {room}
                </p>
              )}
            </motion.div>

            {/* CTA Button */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button
                size="lg"
                className="w-full rounded-xl gradient-teal text-primary-foreground font-semibold"
                onClick={onDismiss}
              >
                Got it
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </motion.div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
