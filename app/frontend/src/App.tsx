import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedbackForm from '@/components/FeedbackForm';
import { autoAuthenticate, isInPiBrowser } from '@/lib/pi-sdk';

// Lazy-loaded pages for performance
const Index = lazy(() => import('./pages/Index'));
const Proposals = lazy(() => import('./pages/Proposals'));
const ProposalDetail = lazy(() => import('./pages/ProposalDetail'));
const CreateProposal = lazy(() => import('./pages/CreateProposal'));
const Funding = lazy(() => import('./pages/Funding'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Quests = lazy(() => import('./pages/Quests'));
const Escrow = lazy(() => import('./pages/Escrow'));
const Reputation = lazy(() => import('./pages/Reputation'));
const ApiDocs = lazy(() => import('./pages/ApiDocs'));
const Security = lazy(() => import('./pages/Security'));
const Admin = lazy(() => import('./pages/Admin'));
const Delegation = lazy(() => import('./pages/Delegation'));
const Analytics = lazy(() => import('./pages/Analytics'));
const ProjectMap = lazy(() => import('./pages/ProjectMap'));
const AuthCallback = lazy(() => import('./pages/AuthCallback'));
const Privacy = lazy(() => import('./pages/Privacy'));
const Terms = lazy(() => import('./pages/Terms'));
const Subscriptions = lazy(() => import('./pages/Subscriptions'));
const Settings = lazy(() => import('./pages/Settings'));

const queryClient = new QueryClient();

function PageLoader() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900 flex items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
        <p className="text-sm text-gray-400">Loading...</p>
      </div>
    </div>
  );
}

const AppRoutes = () => (
  <Suspense fallback={<PageLoader />}>
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/proposals" element={<Proposals />} />
      <Route path="/proposal/:id" element={<ProposalDetail />} />
      <Route path="/create" element={<CreateProposal />} />
      <Route path="/funding" element={<Funding />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/quests" element={<Quests />} />
      <Route path="/subscriptions" element={<Subscriptions />} />
      <Route path="/escrow/:id" element={<Escrow />} />
      <Route path="/reputation" element={<Reputation />} />
      <Route path="/api-docs" element={<ApiDocs />} />
      <Route path="/security" element={<Security />} />
      <Route path="/admin" element={<Admin />} />
      <Route path="/delegation" element={<Delegation />} />
      <Route path="/analytics" element={<Analytics />} />
      <Route path="/map" element={<ProjectMap />} />
      <Route path="/auth/callback" element={<AuthCallback />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/settings" element={<Settings />} />
    </Routes>
  </Suspense>
);

const App = () => {
  useEffect(() => {
    // Auto-authenticate if inside Pi Browser to detect Pioneer's username immediately
    if (isInPiBrowser()) {
      autoAuthenticate().catch((err) => {
        console.warn('[PoliGov] Auto-authentication skipped:', err);
      });
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <BrowserRouter>
          <AppRoutes />
          <FeedbackForm />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
export { AppRoutes };