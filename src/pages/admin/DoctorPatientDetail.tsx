import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { useQueueStore } from "@/store/queueStore";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  CheckCircle2,
  Check,
  Phone,
  Stethoscope,
  XCircle,
  ClipboardCheck,
} from "lucide-react";

type LocationState = {
  activeRoom?: string;
};

function statusLabel(status: string) {
  switch (status) {
    case "clinic-suite":
      return "Clinic Suite";
    case "in-service":
      return "In Service";
    case "completed":
      return "Completed";
    case "cancelled":
      return "Cancelled";
    case "no-show":
      return "No Show";
    case "waiting":
      return "Waiting";
    case "checked-in":
      return "Checked In";
    default:
      return status;
  }
}

export function DoctorPatientDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const { activeRoom } = (location.state || {}) as LocationState;

  const {
    queue,
    updatePatientDetails,
    updatePatientVitals,
    startCallingPatient,
    confirmCalledPatient,
    markInService,
    cancelPatient,
    updatePatientStatus,
  } = useQueueStore();

  const entry = useMemo(() => queue.find((q) => q.id === id), [queue, id]);

  const [localName, setLocalName] = useState<string>("");
  const [localRoom, setLocalRoom] = useState<string>(activeRoom || "");
  const [notes, setNotes] = useState<string>("");

  // vitals
  const [bloodPressure, setBloodPressure] = useState<string>("");
  const [respiratoryRate, setRespiratoryRate] = useState<string>("");
  const [heartRate, setHeartRate] = useState<string>("");
  const [spo2, setSpo2] = useState<string>("");
  const [temperatureC, setTemperatureC] = useState<string>("");
  const [heightCm, setHeightCm] = useState<string>("");
  const [weightKg, setWeightKg] = useState<string>("");

  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    if (!entry) return;
    setLocalName(entry.patientName);
    setLocalRoom(entry.room || activeRoom || "");
    setNotes(entry.notes || "");

    setBloodPressure(entry.vitals?.bloodPressure || "");
    setRespiratoryRate(entry.vitals?.respiratoryRate?.toString() || "");
    setHeartRate(entry.vitals?.heartRate?.toString() || "");
    setSpo2(entry.vitals?.spo2?.toString() || "");
    setTemperatureC(entry.vitals?.temperatureC?.toString() || "");
    setHeightCm(entry.vitals?.heightCm?.toString() || "");
    setWeightKg(entry.vitals?.weightKg?.toString() || "");
  }, [entry, activeRoom]);

  useEffect(() => {
    if (!entry || entry.callStatus !== "calling") return;
    const t = window.setInterval(() => setNow(Date.now()), 250);
    return () => window.clearInterval(t);
  }, [entry?.callStatus]);

  const callSecondsElapsed = useMemo(() => {
    if (!entry?.callStartedAt) return 0;
    return Math.max(0, Math.floor((now - entry.callStartedAt) / 1000));
  }, [entry?.callStartedAt, now]);

  // Auto-transition calling -> called after 15s
  useEffect(() => {
    if (!entry) return;
    if (entry.callStatus !== "calling") return;
    if (!entry.callStartedAt) return;

    const msRemaining = Math.max(0, entry.callStartedAt + 15000 - Date.now());
    const t = window.setTimeout(() => {
      confirmCalledPatient(entry.id);
    }, msRemaining);

    return () => window.clearTimeout(t);
  }, [entry?.id, entry?.callStatus, entry?.callStartedAt, confirmCalledPatient]);

  if (!entry) {
    return (
      <div className="space-y-4 animate-fade-in">
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => navigate("/admin/doctor")}> 
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
        <Card>
          <CardContent className="p-6 text-sm text-muted-foreground">
            Patient not found.
          </CardContent>
        </Card>
      </div>
    );
  }

  const isCancelled = entry.status === "cancelled" || entry.status === "no-show";
  const callDisabled = isCancelled || entry.status === "completed" || entry.status === "in-service";
  const inServiceDisabled = isCancelled || entry.status === "completed";
  const cancelDisabled = entry.status === "completed";

  const handleSaveDetails = () => {
    updatePatientDetails(entry.id, {
      patientName: localName.trim() || entry.patientName,
      room: localRoom || entry.room,
      notes,
    });
  };

  const handleSaveVitals = () => {
    updatePatientVitals(entry.id, {
      bloodPressure: bloodPressure || undefined,
      respiratoryRate: respiratoryRate ? Number(respiratoryRate) : undefined,
      heartRate: heartRate ? Number(heartRate) : undefined,
      spo2: spo2 ? Number(spo2) : undefined,
      temperatureC: temperatureC ? Number(temperatureC) : undefined,
      heightCm: heightCm ? Number(heightCm) : undefined,
      weightKg: weightKg ? Number(weightKg) : undefined,
    });
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <header className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" onClick={() => navigate("/admin/doctor")}
            className="shrink-0"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div className="min-w-0">
            <h1 className="text-2xl font-heading font-bold text-foreground truncate">{entry.patientName}</h1>
            <div className="flex items-center gap-2 mt-1 flex-wrap">
              <Badge variant="outline">{statusLabel(entry.status)}</Badge>
              <span className="text-xs font-mono text-muted-foreground">{entry.queueNumber}</span>
              {entry.room && <Badge variant="secondary">{entry.room}</Badge>}
              {entry.callStatus === "calling" && <Badge variant="warning">Calling…</Badge>}
              {entry.callStatus === "called" && (
                <Badge variant="success" className="gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Called
                </Badge>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Call: Call -> Calling (15s) -> Called */}
          <Button
            onClick={() => startCallingPatient(entry.id, localRoom || entry.room || activeRoom || "Room 101")}
            disabled={callDisabled || entry.callStatus !== "idle"}
            className={cn("gap-2", entry.callStatus === "called" && "pointer-events-none")}
          >
            {entry.callStatus === "called" ? (
              <Check className="w-4 h-4" />
            ) : (
              <Phone className="w-4 h-4" />
            )}
            {entry.callStatus === "idle" && "Call"}
            {entry.callStatus === "calling" && `Calling (${Math.max(0, 15 - callSecondsElapsed)}s)`}
            {entry.callStatus === "called" && "Called"}
          </Button>

          {/* In Service */}
          <Button
            variant="secondary"
            onClick={() => markInService(entry.id)}
            disabled={inServiceDisabled || entry.status === "in-service"}
            className="gap-2"
          >
            <Stethoscope className="w-4 h-4" />
            In Service
          </Button>

          {/* Completed (only meaningful when in-service) */}
          <Button
            variant="success"
            onClick={() => updatePatientStatus(entry.id, "completed")}
            disabled={entry.status !== "in-service"}
            className="gap-2"
          >
            <ClipboardCheck className="w-4 h-4" />
            Completed
          </Button>

          {/* Cancel / No show */}
          <Button
            variant="destructive"
            onClick={() => cancelPatient(entry.id)}
            disabled={cancelDisabled}
            className="gap-2"
          >
            <XCircle className="w-4 h-4" />
            Cancel
          </Button>
        </div>
      </header>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <Card className="xl:col-span-2">
          <CardHeader>
            <CardTitle className="text-base">Patient Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="patientName">Name</Label>
                <Input
                  id="patientName"
                  value={localName}
                  onChange={(e) => setLocalName(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="room">Room</Label>
                <Input id="room" value={localRoom} onChange={(e) => setLocalRoom(e.target.value)} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notes">Notes</Label>
              <Input id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} />
            </div>

            <div className="flex items-center gap-2">
              <Button onClick={handleSaveDetails} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Save details
              </Button>
              <Button variant="outline" onClick={() => navigate("/admin/doctor")}>Done</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Vitals</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="bp">Blood pressure</Label>
                <Input id="bp" value={bloodPressure} onChange={(e) => setBloodPressure(e.target.value)} placeholder="120/80" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="rr">Respiratory rate</Label>
                <Input id="rr" value={respiratoryRate} onChange={(e) => setRespiratoryRate(e.target.value)} placeholder="16" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hr">Heart rate</Label>
                <Input id="hr" value={heartRate} onChange={(e) => setHeartRate(e.target.value)} placeholder="78" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="spo2">SpO₂</Label>
                <Input id="spo2" value={spo2} onChange={(e) => setSpo2(e.target.value)} placeholder="98" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="temp">Body temp (°C)</Label>
                <Input id="temp" value={temperatureC} onChange={(e) => setTemperatureC(e.target.value)} placeholder="36.8" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" value={heightCm} onChange={(e) => setHeightCm(e.target.value)} placeholder="170" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" value={weightKg} onChange={(e) => setWeightKg(e.target.value)} placeholder="72" />
              </div>
            </div>

            <Separator />
            <div className="flex items-center gap-2">
              <Button onClick={handleSaveVitals} className="gap-2">
                <CheckCircle2 className="w-4 h-4" />
                Save vitals
              </Button>
              <div className="text-xs text-muted-foreground">
                Vitals indicator shows when height & weight are filled.
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
