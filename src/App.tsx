import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Dashboard2 from "./pages/Dashboard2";
import Calculator from "./pages/Calculator";
import ProjectDetail from "./pages/ProjectDetail";
import MockEditor from "./pages/MockEditor";
import TestUpload from "./pages/TestUpload";
import ProtectedRoute from "./components/ProtectedRoute";
import NotFound from "./pages/NotFound";
import FaqPage from "./pages/Faq";
import BuildingOfficialsPage from "./pages/BuildingOfficials";
import ResourcesPage from "./pages/Resources";
import AccountPage from "./pages/Account";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider delayDuration={0}>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/dashboard1" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
            <Route path="/dashboard" element={<ProtectedRoute><Dashboard2 /></ProtectedRoute>} />
            <Route path="/calculator" element={<ProtectedRoute><Calculator /></ProtectedRoute>} />
            <Route path="/project/:id" element={<ProtectedRoute><ProjectDetail /></ProtectedRoute>} />
            <Route path="/test-upload" element={<ProtectedRoute><TestUpload /></ProtectedRoute>} />
            <Route path="/editor" element={<MockEditor />} />
            <Route path="/faq" element={<ProtectedRoute><FaqPage /></ProtectedRoute>} />
            <Route path="/building-officials" element={<ProtectedRoute><BuildingOfficialsPage /></ProtectedRoute>} />
            <Route path="/resources" element={<ProtectedRoute><ResourcesPage /></ProtectedRoute>} />
            <Route path="/account" element={<ProtectedRoute><AccountPage /></ProtectedRoute>} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;