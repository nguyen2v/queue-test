import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useQueueStore } from '@/store/queueStore';
import { UserPlus } from 'lucide-react';
import { toast } from 'sonner';
import { Priority } from '@/types/queue';

export const AddVisitorDialog = () => {
  const [open, setOpen] = useState(false);
  const [patientName, setPatientName] = useState('');
  const [serviceType, setServiceType] = useState('');
  const [priority, setPriority] = useState<Priority>('normal');
  const [notes, setNotes] = useState('');
  
  const { services, addVisitor } = useQueueStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!patientName.trim() || !serviceType) {
      toast.error('Please fill in required fields');
      return;
    }

    const entry = addVisitor({
      patientName: patientName.trim(),
      serviceType,
      priority,
      notes: notes.trim() || undefined,
    });

    toast.success(`Visitor ${entry.queueNumber} added to queue`);
    setPatientName('');
    setServiceType('');
    setPriority('normal');
    setNotes('');
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <UserPlus className="h-4 w-4" />
          Add Visitor
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add New Visitor</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Visitor Name *</Label>
            <Input
              id="name"
              value={patientName}
              onChange={(e) => setPatientName(e.target.value)}
              placeholder="Enter visitor name"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="service">Service Type *</Label>
            <Select value={serviceType} onValueChange={setServiceType}>
              <SelectTrigger>
                <SelectValue placeholder="Select service" />
              </SelectTrigger>
              <SelectContent>
                {services.map((service) => (
                  <SelectItem key={service.id} value={service.name}>
                    {service.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="priority">Priority</Label>
            <Select value={priority} onValueChange={(v) => setPriority(v as Priority)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="normal">Normal</SelectItem>
                <SelectItem value="high">High</SelectItem>
                <SelectItem value="urgent">Urgent</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="notes">Notes (optional)</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Special requirements or notes"
              rows={3}
            />
          </div>
          
          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">Add to Queue</Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
