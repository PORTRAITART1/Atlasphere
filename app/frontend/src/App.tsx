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
import Escrow from './pages/Escrow';
import Reputation from './pages/Reputation';
import AuthCallback from './pages/AuthCallback';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Subscriptions from './pages/Subscriptions';

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
    <Route path="/subscriptions" element={<Subscriptions />} />
    <Route path="/escrow/:id" element={<Escrow />} />
    <Route path="/reputation" element={<Reputation />} />
    <Route path="/auth/callback" element={<AuthCallback />} />
    <Route path="/privacy" element={<Privacy />} />
    <Route path="/terms" element={<Terms />} />
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