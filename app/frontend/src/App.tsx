import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Proposals from './pages/Proposals';
import ProposalDetail from './pages/ProposalDetail';
import CreateProposal from './pages/CreateProposal';
import Funding from './pages/Funding';
import Dashboard from './pages/Dashboard';
import Quests from './pages/Quests';
import AuthCallback from './pages/AuthCallback';

const queryClient = new QueryClient();

const AppRoutes = () => (
  <Routes>
    <Route path="/" element={<Index />} />
    <Route path="/proposals" element={<Proposals />} />
    <Route path="/proposal/:id" element={<ProposalDetail />} />
    <Route path="/create" element={<CreateProposal />} />
    <Route path="/funding" element={<Funding />} />
    <Route path="/dashboard" element={<Dashboard />} />
    <Route path="/quests" element={<Quests />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
  </Routes>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
export { AppRoutes };