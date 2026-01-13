import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { MapPin, Bell, Users, Zap, Key } from "lucide-react";

export function SettingsPage() {
  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-heading font-bold text-foreground">
          Settings
        </h1>
        <p className="text-muted-foreground">
          Configure system preferences and integrations
        </p>
      </div>

      <Accordion type="single" collapsible className="space-y-4">
        {/* Locations */}
        <AccordionItem value="locations" className="border rounded-xl px-6 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <MapPin className="w-5 h-5 text-primary" />
              </div>
              <div className="text-left">
                <p className="font-heading font-semibold">Locations</p>
                <p className="text-sm text-muted-foreground font-normal">
                  Manage facility locations and operating hours
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">City Medical Center</p>
                  <p className="text-sm text-muted-foreground">123 Healthcare Ave</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Button variant="secondary">+ Add Location</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Notifications */}
        <AccordionItem value="notifications" className="border rounded-xl px-6 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-accent/10">
                <Bell className="w-5 h-5 text-accent" />
              </div>
              <div className="text-left">
                <p className="font-heading font-semibold">Notifications</p>
                <p className="text-sm text-muted-foreground font-normal">
                  Configure SMS and email templates
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <Label>SMS Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send patient SMS alerts</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Email Notifications</Label>
                  <p className="text-sm text-muted-foreground">Send email confirmations</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Queue Rules */}
        <AccordionItem value="queue-rules" className="border rounded-xl px-6 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-warning/10">
                <Zap className="w-5 h-5 text-warning" />
              </div>
              <div className="text-left">
                <p className="font-heading font-semibold">Queue Rules</p>
                <p className="text-sm text-muted-foreground font-normal">
                  Priority and escalation settings
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <div className="space-y-2">
                <Label>Auto-escalate after (minutes)</Label>
                <Input type="number" defaultValue="30" className="max-w-32" />
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <Label>Priority Override</Label>
                  <p className="text-sm text-muted-foreground">Allow staff to override priorities</p>
                </div>
                <Switch defaultChecked />
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* User Management */}
        <AccordionItem value="users" className="border rounded-xl px-6 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-success/10">
                <Users className="w-5 h-5 text-success" />
              </div>
              <div className="text-left">
                <p className="font-heading font-semibold">User Management</p>
                <p className="text-sm text-muted-foreground font-normal">
                  Admin users and permissions
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">Admin User</p>
                  <p className="text-sm text-muted-foreground">admin@queuecare.com</p>
                </div>
                <Button variant="outline" size="sm">Edit</Button>
              </div>
              <Button variant="secondary">+ Invite Admin</Button>
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* Integrations */}
        <AccordionItem value="integrations" className="border rounded-xl px-6 bg-card">
          <AccordionTrigger className="hover:no-underline">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-muted">
                <Key className="w-5 h-5 text-muted-foreground" />
              </div>
              <div className="text-left">
                <p className="font-heading font-semibold">Integrations</p>
                <p className="text-sm text-muted-foreground font-normal">
                  API keys and external connections
                </p>
              </div>
            </div>
          </AccordionTrigger>
          <AccordionContent>
            <div className="pt-4 space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg bg-muted/30">
                <div>
                  <p className="font-medium">Display Screen API</p>
                  <p className="text-sm text-muted-foreground font-mono">qc_live_****...</p>
                </div>
                <Button variant="outline" size="sm">Regenerate</Button>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
