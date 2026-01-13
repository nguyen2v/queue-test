import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import NotFound from "./pages/NotFound";
import DisplayScreen from "./pages/DisplayScreen";

// Admin
import { AdminLayout } from "./components/admin/AdminLayout";
import { AdminDashboard } from "./pages/admin/AdminDashboard";
import { QueueManagement } from "./pages/admin/QueueManagement";
import { ServicesPage } from "./pages/admin/ServicesPage";
import { StaffPage } from "./pages/admin/StaffPage";
import { AnalyticsPage } from "./pages/admin/AnalyticsPage";
import { SettingsPage } from "./pages/admin/SettingsPage";

// Mobile
import { MobileLayout } from "./components/mobile/MobileLayout";
import { MobileHome } from "./pages/mobile/MobileHome";
import { MobileQueueStatus } from "./pages/mobile/MobileQueueStatus";
import { MobileCheckIn } from "./pages/mobile/MobileCheckIn";
import { MobileQRScanner } from "./pages/mobile/MobileQRScanner";
import { MobileNotifications } from "./pages/mobile/MobileNotifications";
import { MobileProfile } from "./pages/mobile/MobileProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          {/* Redirect root to admin */}
          <Route path="/" element={<Navigate to="/admin" replace />} />

          {/* Public Display Screen */}
          <Route path="/display" element={<DisplayScreen />} />

          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="queue" element={<QueueManagement />} />
            <Route path="services" element={<ServicesPage />} />
            <Route path="staff" element={<StaffPage />} />
            <Route path="analytics" element={<AnalyticsPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>

          {/* Mobile Patient App Routes */}
          <Route path="/mobile" element={<MobileLayout />}>
            <Route index element={<MobileHome />} />
            <Route path="queue" element={<MobileQueueStatus />} />
            <Route path="checkin" element={<MobileCheckIn />} />
            <Route path="scan" element={<MobileQRScanner />} />
            <Route path="notifications" element={<MobileNotifications />} />
            <Route path="profile" element={<MobileProfile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
