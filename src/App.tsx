import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster as SonnerToaster } from "@/components/ui/sonner";
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import ProviderAccessRoute from './components/ProviderAccessRoute';
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Calculator from "./pages/Calculator";
import Account from "./pages/Account";
import MyFeedback from "./pages/MyFeedback";
import FeedbackDetail from "./pages/FeedbackDetail";
import FindAProvider from "./pages/FindAProvider";
import RequestProviderAccess from "./pages/RequestProviderAccess";
import BuildingOfficials from "./pages/BuildingOfficials";
import Resources from "./pages/Resources";
import Faq from "./pages/Faq";
import AdminDashboard from "./pages/AdminDashboard";
import MunicipalDashboard from "./pages/MunicipalDashboard";
import TestUpload from "./pages/TestUpload";
import MockEditor from "./pages/MockEditor";
import NotFound from "./pages/NotFound";
import { useUserRole } from './hooks/useUserRole';
import { useAuth } from './hooks/useAuth';
import { supabase } from './integrations/supabase/client';
import { ThemeProvider } from './components/ThemeProvider';
import { TooltipProvider } from './components/ui/tooltip';

function App() {
  const { user, loading: authLoading } = useAuth();
  const { loading: roleLoading } = useUserRole();

  if (authLoading || roleLoading) {
    return <div className="h-screen w-full flex items-center justify-center"><p>Loading...</p></div>;
  }

  return (
    <ThemeProvider defaultTheme="system" storageKey="vite-ui-theme">
      <TooltipProvider>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/projects" element={<ProtectedRoute><Projects /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
            <Route path="/my-feedback" element={<ProtectedRoute><MyFeedback /></ProtectedRoute>} />
            <Route path="/feedback/:id" element={<ProtectedRoute><FeedbackDetail /></ProtectedRoute>} />
            <Route path="/find-a-provider" element={<ProtectedRoute><ProviderAccessRoute><FindAProvider /></ProviderAccessRoute></ProtectedRoute>} />
            <Route path="/request-provider-access" element={<ProtectedRoute><RequestProviderAccess /></ProtectedRoute>} />
            <Route path="/building-officials" element={<ProtectedRoute><BuildingOfficials /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
            <Route path="/faq" element={<ProtectedRoute><Faq /></ProtectedRoute>} />
            
            <Route path="/admin" element={<AdminRoute><AdminDashboard /></AdminRoute>} />
            <Route path="/municipal-dashboard" element={<AdminRoute><MunicipalDashboard /></AdminRoute>} />

            <Route path="/test-upload" element={<ProtectedRoute><TestUpload /></ProtectedRoute>} />
            <Route path="/mock-editor" element={<ProtectedRoute><MockEditor /></ProtectedRoute>} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
        <SonnerToaster />
      </TooltipProvider>
    </ThemeProvider>
  );
}

export default App;