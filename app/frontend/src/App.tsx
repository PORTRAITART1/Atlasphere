import { lazy, Suspense, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { TooltipProvider } from '@/components/ui/tooltip';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import FeedbackForm from '@/components/FeedbackForm';
import EcoChatbot from '@/components/EcoChatbot';
import { autoAuthenticate, isInPiBrowser } from '@/lib/pi-sdk';
import { applyTheme } from '@/lib/theme';

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
const EcoWallet = lazy(() => import('./pages/EcoWallet'));
const ClimateDashboard = lazy(() => import('./pages/ClimateDashboard'));
const EcoMarket = lazy(() => import('./pages/EcoMarket'));
const Predictions = lazy(() => import('./pages/Predictions'));
const EcoNFT = lazy(() => import('./pages/EcoNFT'));
const Messages = lazy(() => import('./pages/Messages'));
const ProjectTracking = lazy(() => import('./pages/ProjectTracking'));
const Badges = lazy(() => import('./pages/Badges'));
const Community = lazy(() => import('./pages/Community'));
const EcoSensors = lazy(() => import('./pages/EcoSensors'));
const LifestyleOptimizer = lazy(() => import('./pages/LifestyleOptimizer'));
const EcoPremium = lazy(() => import('./pages/EcoPremium'));
const EcoLeaderboard = lazy(() => import('./pages/EcoLeaderboard'));
const EcoApi = lazy(() => import('./pages/EcoApi'));
const NotificationSettings = lazy(() => import('./pages/NotificationSettings'));
const CustomDashboard = lazy(() => import('./pages/CustomDashboard'));
const Rewards = lazy(() => import('./pages/Rewards'));
const QuadraticVoting = lazy(() => import('./pages/QuadraticVoting'));
const Committees = lazy(() => import('./pages/Committees'));
const Treasury = lazy(() => import('./pages/Treasury'));
const IoTAnomalies = lazy(() => import('./pages/IoTAnomalies'));
const Guilds = lazy(() => import('./pages/Guilds'));
const Seasons = lazy(() => import('./pages/Seasons'));
const CarbonCredits = lazy(() => import('./pages/CarbonCredits'));
const IPFSStorage = lazy(() => import('./pages/IPFSStorage'));
const ReferralPage = lazy(() => import('./pages/Referral'));
const Partners = lazy(() => import('./pages/Partners'));
const EcoAdsPage = lazy(() => import('./pages/EcoAds'));
const UserProfile = lazy(() => import('./pages/UserProfile'));
const MarketingDownload = lazy(() => import('./pages/MarketingDownload'));
const ValidationKey = lazy(() => import('./pages/ValidationKey'));

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
      <Route path="/eco-wallet" element={<EcoWallet />} />
      <Route path="/climate" element={<ClimateDashboard />} />
      <Route path="/eco-market" element={<EcoMarket />} />
      <Route path="/predictions" element={<Predictions />} />
      <Route path="/eco-nft" element={<EcoNFT />} />
      <Route path="/messages" element={<Messages />} />
      <Route path="/project-tracking" element={<ProjectTracking />} />
      <Route path="/badges" element={<Badges />} />
      <Route path="/community" element={<Community />} />
      <Route path="/eco-sensors" element={<EcoSensors />} />
      <Route path="/lifestyle" element={<LifestyleOptimizer />} />
      <Route path="/eco-premium" element={<EcoPremium />} />
      <Route path="/eco-leaderboard" element={<EcoLeaderboard />} />
      <Route path="/eco-api" element={<EcoApi />} />
      <Route path="/notification-settings" element={<NotificationSettings />} />
      <Route path="/my-dashboard" element={<CustomDashboard />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/quadratic-voting" element={<QuadraticVoting />} />
      <Route path="/committees" element={<Committees />} />
      <Route path="/treasury" element={<Treasury />} />
      <Route path="/iot-anomalies" element={<IoTAnomalies />} />
      <Route path="/guilds" element={<Guilds />} />
      <Route path="/seasons" element={<Seasons />} />
      <Route path="/carbon-credits" element={<CarbonCredits />} />
      <Route path="/ipfs-storage" element={<IPFSStorage />} />
      <Route path="/referral" element={<ReferralPage />} />
      <Route path="/partners" element={<Partners />} />
      <Route path="/eco-ads" element={<EcoAdsPage />} />
      <Route path="/profile" element={<UserProfile />} />
      <Route path="/marketing-download" element={<MarketingDownload />} />
      <Route path="/validation-key.txt" element={<ValidationKey />} />
    </Routes>
  </Suspense>
);

const App = () => {
  useEffect(() => {
    // Apply saved theme on mount
    applyTheme();
    // Auto-authenticate if inside Pi Browser to detect Pioneer's username immediately
    if (isInPiBrowser()) {
      autoAuthenticate().catch((err) => {
        console.warn('[Atlasphere] Auto-authentication skipped:', err);
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
          <EcoChatbot />
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
export { AppRoutes };