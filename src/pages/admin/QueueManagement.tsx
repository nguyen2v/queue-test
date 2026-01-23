import { useState } from "react";
import { useQueueStore } from "@/store/queueStore";
import { QueueCard } from "@/components/queue/QueueCard";
import { PatientDetailPanel } from "@/components/queue/PatientDetailPanel";
import { AddVisitorDialog } from "@/components/queue/AddVisitorDialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { QueueStatus, QueueEntry } from "@/types/queue";
import { LayoutGrid, List, Search, Filter, Plus } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

const columns: { status: QueueStatus; label: string; color: string }[] = [
  { status: 'checked-in', label: 'Checked In', color: 'bg-secondary' },
  { status: 'waiting', label: 'Waiting', color: 'bg-warning/10' },
  { status: 'clinic-suite', label: 'Clinic Suite', color: 'bg-secondary' },
  { status: 'in-service', label: 'In Service', color: 'bg-primary/10' },
  { status: 'completed', label: 'Completed', color: 'bg-success/10' },
];

export function QueueManagement() {
  const { queue, movePatient, selectedPatient, setSelectedPatient } = useQueueStore();
  const [viewMode, setViewMode] = useState<'board' | 'list'>('board');
  const [searchQuery, setSearchQuery] = useState('');
  const [draggedItem, setDraggedItem] = useState<QueueEntry | null>(null);
  const [isAddVisitorOpen, setIsAddVisitorOpen] = useState(false);

  const filteredQueue = queue.filter(
    (entry) =>
      entry.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      entry.queueNumber.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getColumnPatients = (status: QueueStatus) =>
    filteredQueue.filter((entry) => entry.status === status);

  const handleDragStart = (entry: QueueEntry) => {
    setDraggedItem(entry);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (status: QueueStatus) => {
    if (draggedItem && draggedItem.status !== status) {
      movePatient(draggedItem.id, status);
    }
    setDraggedItem(null);
  };

  const handleCloseDetail = () => {
    setSelectedPatient(null);
  };

  const handleReturnToWaiting = () => {
    if (selectedPatient) {
      movePatient(selectedPatient.id, 'waiting');
    }
  };

  const handleCallVisitor = () => {
    if (selectedPatient) {
      movePatient(selectedPatient.id, 'in-service');
    }
  };

  return (
    <div className={cn(
      "flex gap-6 animate-fade-in",
      selectedPatient ? "h-[calc(100vh-8rem)]" : ""
    )}>
      {/* Queue List Section */}
      <div className={cn(
        "transition-all duration-300 flex flex-col",
        selectedPatient ? "w-[400px] shrink-0" : "flex-1"
      )}>
        <div className="space-y-6 flex-1 overflow-hidden flex flex-col">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 shrink-0">
            <h1 className="text-2xl font-heading font-bold text-foreground">
              Queue Management
            </h1>
            <div className="flex items-center gap-3">
              {/* View Toggle */}
              <div className="flex items-center bg-muted rounded-lg p-1">
                <Button
                  variant={viewMode === 'board' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('board')}
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'secondary' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
              {!selectedPatient && (
                <Button variant="outline" size="sm">
                  <Filter className="w-4 h-4 mr-2" />
                  Filter
                </Button>
              )}
            </div>
          </div>

          {/* Search */}
          <div className="relative max-w-md shrink-0">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              placeholder="Search patients..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Kanban Board - Compact when patient selected */}
          {viewMode === 'board' && (
            <div className={cn(
              "flex-1 overflow-auto",
              selectedPatient ? "space-y-4" : ""
            )}>
              {selectedPatient ? (
                // Compact vertical list when patient is selected
                <div className="space-y-4">
                  {columns.map((column) => {
                    const patients = getColumnPatients(column.status);
                    if (patients.length === 0) return null;
                    return (
                      <div key={column.status} className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">
                            {column.label}
                          </span>
                          <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                            {patients.length}
                          </span>
                        </div>
                        <div className="space-y-2">
                          {patients.map((entry) => (
                            <QueueCard
                              key={entry.id}
                              entry={entry}
                              selected={selectedPatient?.id === entry.id}
                              onSelect={() => setSelectedPatient(entry)}
                              onCall={() => movePatient(entry.id, 'in-service')}
                              compact
                            />
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Full Kanban board
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
                  {columns.map((column) => {
                    const patients = getColumnPatients(column.status);
                    return (
                      <div
                        key={column.status}
                        className="space-y-3"
                        onDragOver={handleDragOver}
                        onDrop={() => handleDrop(column.status)}
                      >
                        <Card className={cn("border-t-4", column.color, "border-t-current")}>
                          <CardHeader className="pb-3">
                            <div className="flex items-center justify-between">
                              <CardTitle className="text-base">{column.label}</CardTitle>
                              <span className="text-sm font-medium text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                                {patients.length}
                              </span>
                            </div>
                          </CardHeader>
                          <CardContent className="space-y-3 min-h-[200px]">
                            <AnimatePresence>
                              {patients.map((entry) => (
                                <motion.div
                                  key={entry.id}
                                  layout
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  exit={{ opacity: 0, scale: 0.9 }}
                                  draggable
                                  onDragStart={() => handleDragStart(entry)}
                                  className="cursor-grab active:cursor-grabbing"
                                >
                                  <QueueCard
                                    entry={entry}
                                    selected={selectedPatient?.id === entry.id}
                                    onSelect={() => setSelectedPatient(entry)}
                                    onCall={() => movePatient(entry.id, 'in-service')}
                                    compact={column.status === 'completed'}
                                  />
                                </motion.div>
                              ))}
                            </AnimatePresence>
                            {patients.length === 0 && (
                              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                                No patients
                              </div>
                            )}
                          </CardContent>
                        </Card>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Add Visitor Button - Full screen mode */}
              {!selectedPatient && (
                <div className="mt-6">
                  <Button 
                    className="bg-primary text-primary-foreground hover:bg-primary/90"
                    onClick={() => setIsAddVisitorOpen(true)}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add visitor
                  </Button>
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="flex-1 overflow-auto">
              <Card>
                <CardContent className="p-0">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="text-left p-4 font-medium text-muted-foreground">Queue #</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Patient</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Service</th>
                        <th className="text-left p-4 font-medium text-muted-foreground">Status</th>
                        {!selectedPatient && (
                          <>
                            <th className="text-left p-4 font-medium text-muted-foreground">Wait Time</th>
                            <th className="text-right p-4 font-medium text-muted-foreground">Actions</th>
                          </>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {filteredQueue.map((entry) => {
                        const waitTime = Math.round(
                          (Date.now() - new Date(entry.checkInTime).getTime()) / 60000
                        );
                        return (
                          <tr
                            key={entry.id}
                            className={cn(
                              "border-b border-border/50 hover:bg-muted/30 transition-colors cursor-pointer",
                              selectedPatient?.id === entry.id && "bg-primary/5 border-l-2 border-l-primary"
                            )}
                            onClick={() => setSelectedPatient(entry)}
                          >
                            <td className="p-4 font-mono text-sm">{entry.queueNumber}</td>
                            <td className="p-4 font-medium">{entry.patientName}</td>
                            <td className="p-4 text-muted-foreground">{entry.serviceType}</td>
                            <td className="p-4">
                              <span
                                className={cn(
                                  "px-2 py-1 rounded-full text-xs font-medium",
                                  entry.status === 'waiting' && "bg-warning/10 text-warning",
                                    entry.status === 'clinic-suite' && "bg-secondary text-secondary-foreground",
                                  entry.status === 'in-service' && "bg-primary/10 text-primary",
                                    entry.status === 'completed' && "bg-success/10 text-success",
                                    (entry.status === 'cancelled' || entry.status === 'no-show') && "bg-muted text-muted-foreground"
                                )}
                              >
                                {entry.status}
                              </span>
                            </td>
                            {!selectedPatient && (
                              <>
                                <td className="p-4 text-sm">{waitTime} min</td>
                                <td className="p-4 text-right">
                                  <Button variant="outline" size="sm">
                                    View
                                  </Button>
                                </td>
                              </>
                            )}
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Add Visitor Button - Fixed at bottom when patient selected */}
          {selectedPatient && (
            <div className="shrink-0 pt-4">
              <Button 
                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                onClick={() => setIsAddVisitorOpen(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add visitor
              </Button>
            </div>
          )}
        </div>
      </div>

      {/* Patient Detail Panel */}
      <AnimatePresence>
        {selectedPatient && (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.2 }}
            className="flex-1 min-w-0 rounded-lg border border-border overflow-hidden"
          >
            <PatientDetailPanel
              entry={selectedPatient}
              onClose={handleCloseDetail}
              onReturnToWaiting={handleReturnToWaiting}
              onCallVisitor={handleCallVisitor}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Add Visitor Dialog */}
      <AddVisitorDialog 
        open={isAddVisitorOpen} 
        onOpenChange={setIsAddVisitorOpen} 
      />
    </div>
  );
}
