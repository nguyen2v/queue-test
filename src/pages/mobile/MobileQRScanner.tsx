import { Button } from "@/components/ui/button";
import { ArrowLeft, Flashlight } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function MobileQRScanner() {
  const navigate = useNavigate();

  return (
    <div className="p-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <Button variant="ghost" size="icon" onClick={() => navigate('/mobile')}>
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <h1 className="font-heading font-semibold">Scan QR Code</h1>
        <div className="w-10" />
      </div>

      <div className="text-center mb-8">
        <p className="text-muted-foreground">
          Point camera at the kiosk QR code
        </p>
      </div>

      {/* Camera Viewfinder */}
      <div className="relative aspect-square max-w-xs mx-auto">
        <div className="absolute inset-0 bg-muted rounded-2xl overflow-hidden">
          {/* Simulated camera view */}
          <div className="w-full h-full bg-gradient-to-br from-muted to-muted-foreground/10" />
        </div>
        
        {/* Scan frame */}
        <div className="absolute inset-8 border-2 border-primary rounded-xl">
          <div className="absolute top-0 left-0 w-6 h-6 border-t-4 border-l-4 border-primary rounded-tl-xl" />
          <div className="absolute top-0 right-0 w-6 h-6 border-t-4 border-r-4 border-primary rounded-tr-xl" />
          <div className="absolute bottom-0 left-0 w-6 h-6 border-b-4 border-l-4 border-primary rounded-bl-xl" />
          <div className="absolute bottom-0 right-0 w-6 h-6 border-b-4 border-r-4 border-primary rounded-br-xl" />
        </div>
        
        {/* Scanning line animation */}
        <div className="absolute inset-8 overflow-hidden rounded-xl">
          <div className="absolute left-0 right-0 h-0.5 bg-primary/60 animate-[scan_2s_ease-in-out_infinite]" 
               style={{ animation: 'scan 2s ease-in-out infinite' }} />
        </div>
      </div>

      {/* Flashlight toggle */}
      <div className="mt-8 text-center">
        <Button variant="secondary" className="gap-2">
          <Flashlight className="w-4 h-4" />
          Turn on flashlight
        </Button>
      </div>

      {/* Manual entry option */}
      <div className="mt-8 pt-8 border-t border-border text-center">
        <p className="text-muted-foreground text-sm mb-4">Having trouble?</p>
        <Button variant="link">Enter code manually</Button>
      </div>

      <style>{`
        @keyframes scan {
          0%, 100% { top: 0; }
          50% { top: calc(100% - 2px); }
        }
      `}</style>
    </div>
  );
}
