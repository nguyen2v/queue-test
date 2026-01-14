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

// Mobile V1
import { MobileLayout } from "./components/mobile/MobileLayout";
import { MobileHome } from "./pages/mobile/MobileHome";
import { MobileQueueStatus } from "./pages/mobile/MobileQueueStatus";
import { MobileCheckIn } from "./pages/mobile/MobileCheckIn";
import { MobileQRScanner } from "./pages/mobile/MobileQRScanner";
import { MobileNotifications } from "./pages/mobile/MobileNotifications";
import { MobileProfile } from "./pages/mobile/MobileProfile";
import { LiveActivitiesDemo } from "./pages/mobile/LiveActivitiesDemo";

// Mobile V2
import { MobileV2Layout } from "./components/mobile/v2/MobileV2Layout";
import { MobileV2Home } from "./pages/mobile/v2/MobileV2Home";
import { MobileV2QueueStatus } from "./pages/mobile/v2/MobileV2QueueStatus";
import { MobileV2CheckIn } from "./pages/mobile/v2/MobileV2CheckIn";
import { MobileV2Messages } from "./pages/mobile/v2/MobileV2Messages";
import { MobileV2Appointments } from "./pages/mobile/v2/MobileV2Appointments";
import { MobileV2Profile } from "./pages/mobile/v2/MobileV2Profile";

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

          {/* Mobile Patient App Routes V1 */}
          <Route path="/mobile" element={<MobileLayout />}>
            <Route index element={<MobileHome />} />
            <Route path="queue" element={<MobileQueueStatus />} />
            <Route path="checkin" element={<MobileCheckIn />} />
            <Route path="scan" element={<MobileQRScanner />} />
            <Route path="notifications" element={<MobileNotifications />} />
            <Route path="profile" element={<MobileProfile />} />
            <Route path="live-activities" element={<LiveActivitiesDemo />} />
          </Route>

          {/* Mobile Patient App Routes V2 */}
          <Route path="/mobile/v2" element={<MobileV2Layout />}>
            <Route index element={<MobileV2Home />} />
            <Route path="queue" element={<MobileV2QueueStatus />} />
            <Route path="checkin" element={<MobileV2CheckIn />} />
            <Route path="messages" element={<MobileV2Messages />} />
            <Route path="appointments" element={<MobileV2Appointments />} />
            <Route path="profile" element={<MobileV2Profile />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
