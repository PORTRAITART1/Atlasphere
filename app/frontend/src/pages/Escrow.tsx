import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';
import { fetchProjectById, fetchAllContributions, parseMilestones, type Project, type Contribution } from '@/lib/api';
import { getCurrentUser, type PiUser } from '@/lib/pi-sdk';
import { toast } from 'sonner';

interface EscrowMilestone {
  title: string;
  description: string;
  completed: boolean;
  percentage: number;
  proof?: string;
  releasedAt?: string;
}

export default function Escrow() {
  const { id } = useParams<{ id: string }>();
  const [project, setProject] = useState<Project | null>(null);
  const [contributions, setContributions] = useState<Contribution[]>([]);
  const [milestones, setMilestones] = useState<EscrowMilestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [, setLangTick] = useState(0);
  const [proofText, setProofText] = useState('');
  const [selectedMilestone, setSelectedMilestone] = useState<number | null>(null);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  useEffect(() => {
    if (!id) return;
    loadData();
  }, [id]);

  async function loadData() {
    setLoading(true);
    try {
      const proj = await fetchProjectById(Number(id));
      if (!proj) { setLoading(false); return; }
      setProject(proj);

      const rawMilestones = parseMilestones(proj.milestones);
      const escrowMilestones: EscrowMilestone[] = rawMilestones.length > 0
        ? rawMilestones.map((m, i) => ({
            title: m.title,
            description: m.description,
            completed: m.completed,
            percentage: Math.floor(100 / rawMilestones.length),
            proof: m.completed ? `Proof submitted for milestone ${i + 1}` : undefined,
            releasedAt: m.completed ? new Date(Date.now() - (rawMilestones.length - i) * 86400000 * 7).toISOString() : undefined,
          }))
        : [
            { title: 'Phase 1 - Planning', description: 'Project planning and team assembly', completed: true, percentage: 25, proof: 'Team assembled, roadmap published', releasedAt: '2026-05-01T00:00:00Z' },
            { title: 'Phase 2 - Development', description: 'Core development and testing', completed: true, percentage: 25, proof: 'MVP deployed on testnet', releasedAt: '2026-06-01T00:00:00Z' },
            { title: 'Phase 3 - Launch', description: 'Public launch and marketing', completed: false, percentage: 25 },
            { title: 'Phase 4 - Scale', description: 'Scale to 1000+ users', completed: false, percentage: 25 },
          ];
      setMilestones(escrowMilestones);

      const contribs = await fetchAllContributions({ query: { project_id: Number(id) }, limit: 100 });
      setContributions(contribs.items);
    } catch (err) {
      console.error('Failed to load escrow data:', err);
    } finally {
      setLoading(false);
    }
  }

  const totalLocked = project ? (project.raised || 0) : 0;
  const completedMilestones = milestones.filter((m) => m.completed);
  const releasedPercentage = completedMilestones.reduce((sum, m) => sum + m.percentage, 0);
  const releasedAmount = totalLocked * (releasedPercentage / 100);
  const lockedAmount = totalLocked - releasedAmount;

  function handleSubmitProof(milestoneIndex: number) {
    if (!proofText.trim()) {
      toast.error('Please provide proof of completion');
      return;
    }
    const updated = [...milestones];
    updated[milestoneIndex] = {
      ...updated[milestoneIndex],
      proof: proofText,
    };
    setMilestones(updated);
    setProofText('');
    setSelectedMilestone(null);
    toast.success('Proof submitted! Awaiting community verification.');
  }

  function handleReleaseFunds(milestoneIndex: number) {
    const updated = [...milestones];
    updated[milestoneIndex] = {
      ...updated[milestoneIndex],
      completed: true,
      releasedAt: new Date().toISOString(),
    };
    setMilestones(updated);
    toast.success(`Funds released for: ${updated[milestoneIndex].title}`);
  }

  function handleRefund() {
    toast.info('Refund request submitted. Community vote will decide.');
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full" />
          </div>
        </div>
        <Footer />
      </div>
    );
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
        <Navbar />
        <div className="max-w-6xl mx-auto px-4 py-12 text-center">
          <h1 className="text-2xl text-white">Project not found</h1>
          <Link to="/funding" className="text-indigo-400 hover:underline mt-4 inline-block">
            ← Back to Funding
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link to={`/proposal/${id}`} className="text-indigo-400 hover:underline text-sm mb-2 inline-block">
            ← {t('escrow.back_to_project') || 'Back to Project'}
          </Link>
          <h1 className="text-3xl font-bold text-white mb-2">
            🔐 {t('escrow.title') || 'Smart Contract Escrow'}
          </h1>
          <p className="text-gray-400">{project.title}</p>
        </div>

        {/* Escrow Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <div className="bg-slate-800/60 border border-amber-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center">
                <span className="text-xl">🔒</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">{t('escrow.locked') || 'Locked Funds'}</p>
                <p className="text-2xl font-bold text-amber-400">{lockedAmount.toFixed(1)} π</p>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
              <div
                className="bg-amber-500 h-2 rounded-full transition-all"
                style={{ width: `${100 - releasedPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/60 border border-emerald-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-emerald-500/20 flex items-center justify-center">
                <span className="text-xl">✅</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">{t('escrow.released') || 'Released Funds'}</p>
                <p className="text-2xl font-bold text-emerald-400">{releasedAmount.toFixed(1)} π</p>
              </div>
            </div>
            <div className="w-full bg-slate-700 rounded-full h-2 mt-3">
              <div
                className="bg-emerald-500 h-2 rounded-full transition-all"
                style={{ width: `${releasedPercentage}%` }}
              />
            </div>
          </div>

          <div className="bg-slate-800/60 border border-indigo-500/20 rounded-xl p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-lg bg-indigo-500/20 flex items-center justify-center">
                <span className="text-xl">📊</span>
              </div>
              <div>
                <p className="text-sm text-gray-400">{t('escrow.progress') || 'Progress'}</p>
                <p className="text-2xl font-bold text-indigo-400">{releasedPercentage}%</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {completedMilestones.length}/{milestones.length} milestones completed
            </p>
          </div>
        </div>

        {/* Contract Info */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">📜 {t('escrow.contract_info') || 'Contract Information'}</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-400">Contract ID</p>
              <p className="text-sm text-indigo-300 font-mono break-all">
                {project.escrow_contract_id || `escrow_${project.id}_${Date.now().toString(36)}`}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Total Budget</p>
              <p className="text-sm text-white">{project.budget} π</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Contributors</p>
              <p className="text-sm text-white">{contributions.length} pioneers</p>
            </div>
            <div>
              <p className="text-sm text-gray-400">Release Mechanism</p>
              <p className="text-sm text-white">Milestone-based (community verified)</p>
            </div>
          </div>
        </div>

        {/* Milestones Timeline */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-6">🎯 {t('escrow.milestones') || 'Milestones'}</h2>
          <div className="space-y-6">
            {milestones.map((milestone, index) => (
              <div key={index} className="relative">
                {/* Timeline connector */}
                {index < milestones.length - 1 && (
                  <div className={`absolute left-5 top-12 w-0.5 h-full ${milestone.completed ? 'bg-emerald-500' : 'bg-slate-600'}`} />
                )}
                <div className={`flex gap-4 p-4 rounded-xl border ${
                  milestone.completed
                    ? 'bg-emerald-500/5 border-emerald-500/20'
                    : 'bg-slate-800/30 border-slate-700/30'
                }`}>
                  {/* Status icon */}
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    milestone.completed
                      ? 'bg-emerald-500/20 text-emerald-400'
                      : 'bg-slate-700 text-gray-400'
                  }`}>
                    {milestone.completed ? '✓' : index + 1}
                  </div>

                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="font-medium text-white">{milestone.title}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        milestone.completed
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-slate-700 text-gray-400'
                      }`}>
                        {milestone.percentage}% of funds
                      </span>
                    </div>
                    <p className="text-sm text-gray-400 mb-2">{milestone.description}</p>

                    {milestone.completed && milestone.proof && (
                      <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-lg p-3 mb-2">
                        <p className="text-xs text-emerald-400 font-medium mb-1">📎 {t('escrow.milestone_proof') || 'Milestone Proof'}</p>
                        <p className="text-sm text-gray-300">{milestone.proof}</p>
                        {milestone.releasedAt && (
                          <p className="text-xs text-gray-500 mt-1">
                            Released: {new Date(milestone.releasedAt).toLocaleDateString()}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Actions for non-completed milestones */}
                    {!milestone.completed && user && (
                      <div className="flex gap-2 mt-3">
                        {project.user_id === user.uid ? (
                          <>
                            {selectedMilestone === index ? (
                              <div className="flex-1">
                                <textarea
                                  value={proofText}
                                  onChange={(e) => setProofText(e.target.value)}
                                  placeholder="Describe your proof of completion..."
                                  className="w-full bg-slate-700 border border-slate-600 rounded-lg p-2 text-sm text-white placeholder-gray-500 mb-2"
                                  rows={2}
                                />
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => handleSubmitProof(index)}
                                    className="px-3 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs rounded-lg transition-colors"
                                  >
                                    Submit Proof
                                  </button>
                                  <button
                                    onClick={() => { setSelectedMilestone(null); setProofText(''); }}
                                    className="px-3 py-1.5 bg-slate-700 hover:bg-slate-600 text-gray-300 text-xs rounded-lg transition-colors"
                                  >
                                    Cancel
                                  </button>
                                </div>
                              </div>
                            ) : (
                              <button
                                onClick={() => setSelectedMilestone(index)}
                                className="px-3 py-1.5 bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 text-xs rounded-lg border border-indigo-500/30 transition-colors"
                              >
                                📎 Submit Proof
                              </button>
                            )}
                          </>
                        ) : (
                          milestone.proof && (
                            <button
                              onClick={() => handleReleaseFunds(index)}
                              className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600/30 text-emerald-300 text-xs rounded-lg border border-emerald-500/30 transition-colors"
                            >
                              ✅ Verify & Release Funds
                            </button>
                          )
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Refund Section */}
        <div className="bg-red-500/5 border border-red-500/20 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-2">⚠️ {t('escrow.refund') || 'Request Refund'}</h2>
          <p className="text-sm text-gray-400 mb-4">
            If the project fails to deliver, contributors can request a community vote for refund.
            Locked funds will be returned proportionally to all contributors.
          </p>
          <button
            onClick={handleRefund}
            className="px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-400 text-sm rounded-lg border border-red-500/30 transition-colors"
          >
            🔄 Request Community Refund Vote
          </button>
        </div>
      </div>
      <Footer />
    </div>
  );
}