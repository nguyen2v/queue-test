import { Button } from "@/components/ui/button";
import { useQueueStore } from "@/store/queueStore";
import { ArrowRight, Stethoscope, Scan } from "lucide-react";

interface QueueTestButtonsProps {
  currentState: 'waiting' | 'your-turn' | 'in-service' | 'radiology';
}

export function QueueTestButtons({ currentState }: QueueTestButtonsProps) {
  const { 
    activeQueueEntry,
    triggerItsYourTurn,
    dismissItsYourTurn,
    movePatientToLocation,
    updatePatientStatus,
  } = useQueueStore();

  const handleTestItsYourTurn = () => {
    triggerItsYourTurn("Clinic Suite", "Building A", "Room 305");
  };

  const handleTestInService = () => {
    if (activeQueueEntry) {
      dismissItsYourTurn();
      movePatientToLocation(activeQueueEntry.id, 'clinic-suite', 'Building A', 'Room 305');
      updatePatientStatus(activeQueueEntry.id, 'in-service');
    }
  };

  const handleTestRadiology = () => {
    if (activeQueueEntry) {
      movePatientToLocation(activeQueueEntry.id, 'radiology', 'Building B', 'Radiology Suite 1');
      updatePatientStatus(activeQueueEntry.id, 'waiting');
      triggerItsYourTurn("Radiology", "Building B", "Radiology Suite 1");
    }
  };

  const handleResetToWaiting = () => {
    if (activeQueueEntry) {
      dismissItsYourTurn();
      movePatientToLocation(activeQueueEntry.id, 'general-waiting', 'Building A', undefined);
      updatePatientStatus(activeQueueEntry.id, 'waiting');
    }
  };

  return (
    <div className="space-y-2 p-4 bg-muted/50 rounded-2xl border border-dashed border-muted-foreground/30">
      <p className="text-xs text-muted-foreground font-medium mb-2">🧪 Test State Transitions</p>
      
      {currentState === 'waiting' && (
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between text-primary border-primary/30"
          onClick={handleTestItsYourTurn}
        >
          <span>Trigger "It's Your Turn"</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}

      {currentState === 'your-turn' && (
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between text-success border-success/30"
          onClick={handleTestInService}
        >
          <span>Move to "In Service"</span>
          <Stethoscope className="w-4 h-4" />
        </Button>
      )}

      {currentState === 'in-service' && (
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between text-warning border-warning/30"
          onClick={handleTestRadiology}
        >
          <span>Refer to Radiology</span>
          <Scan className="w-4 h-4" />
        </Button>
      )}

      {currentState === 'radiology' && (
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-between text-muted-foreground"
          onClick={handleResetToWaiting}
        >
          <span>Reset to General Waiting</span>
          <ArrowRight className="w-4 h-4" />
        </Button>
      )}

      {/* Always show reset button except on waiting */}
      {currentState !== 'waiting' && (
        <Button
          variant="ghost"
          size="sm"
          className="w-full text-xs text-muted-foreground"
          onClick={handleResetToWaiting}
        >
          Reset to Waiting
        </Button>
      )}
    </div>
  );
}
