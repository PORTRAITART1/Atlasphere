import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';

interface SecurityFeature {
  icon: string;
  title: string;
  description: string;
  details: string[];
}

const securityFeatures: SecurityFeature[] = [
  {
    icon: '🔐',
    title: 'Pi Network Authentication',
    description: 'Secure identity verification through Pi Network SDK',
    details: [
      'OAuth 2.0 based authentication via Pi Platform API',
      'Access tokens verified server-side against Pi /v2/me endpoint',
      'No passwords stored - authentication delegated to Pi Network',
      'Session tokens with automatic expiration and refresh',
    ],
  },
  {
    icon: '🛡️',
    title: 'Data Encryption',
    description: 'End-to-end protection for all data in transit and at rest',
    details: [
      'TLS 1.3 encryption for all API communications',
      'AES-256 encryption for sensitive data at rest',
      'Secure key management with regular rotation',
      'HTTPS enforced on all endpoints',
    ],
  },
  {
    icon: '📜',
    title: 'Smart Contract Security',
    description: 'Escrow contracts with multi-signature verification',
    details: [
      'Milestone-based fund release prevents misuse',
      'Community verification required before fund release',
      'Automatic refund mechanism for failed projects',
      'Soroban smart contracts audited for vulnerabilities',
    ],
  },
  {
    icon: '🗳️',
    title: 'Voting Integrity',
    description: 'Tamper-proof voting with reputation-weighted system',
    details: [
      'One vote per user per proposal (enforced server-side)',
      'Reputation-weighted votes prevent Sybil attacks',
      'Vote records are immutable once cast',
      'Quorum and threshold requirements for governance decisions',
    ],
  },
  {
    icon: '💰',
    title: 'Payment Security',
    description: 'Pi Network payment processing with server-side verification',
    details: [
      'All payments approved and completed server-side',
      'Transaction IDs verified against Pi blockchain',
      'Escrow system holds funds until milestones met',
      'Automatic rollback on payment failures',
    ],
  },
  {
    icon: '🔍',
    title: 'Transparency & Auditing',
    description: 'Full visibility into platform operations',
    details: [
      'All votes and contributions publicly visible',
      'Project funding progress tracked in real-time',
      'Milestone completion proofs publicly verifiable',
      'Open governance - all decisions made by community vote',
    ],
  },
];

interface AuditLog {
  date: string;
  event: string;
  status: 'passed' | 'info' | 'resolved';
}

const auditLogs: AuditLog[] = [
  { date: '2026-06-25', event: 'Security audit - Smart contract escrow module', status: 'passed' },
  { date: '2026-06-20', event: 'Penetration testing - API endpoints', status: 'passed' },
  { date: '2026-06-15', event: 'SSL certificate renewal', status: 'info' },
  { date: '2026-06-10', event: 'Rate limiting implemented on payment endpoints', status: 'resolved' },
  { date: '2026-06-05', event: 'CORS policy hardened for production', status: 'resolved' },
  { date: '2026-05-30', event: 'Initial security review - Authentication flow', status: 'passed' },
  { date: '2026-05-25', event: 'Platform launch - Security baseline established', status: 'info' },
];

const statusColors: Record<string, string> = {
  passed: 'bg-emerald-500/20 text-emerald-400',
  info: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-amber-500/20 text-amber-400',
};

export default function Security() {
  const [, setLangTick] = useState(0);

  useEffect(() => {
    return subscribeI18n(() => setLangTick((n) => n + 1));
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🛡️ {t('security.title') || 'Security & Transparency'}
          </h1>
          <p className="text-gray-400">
            {t('security.subtitle') || 'How we protect your data, funds, and governance integrity'}
          </p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {[
            { icon: '✅', label: 'Pi Verified', value: 'Platform' },
            { icon: '🔒', label: 'TLS 1.3', value: 'Encrypted' },
            { icon: '📊', label: 'Uptime', value: '99.9%' },
            { icon: '🛡️', label: 'Audited', value: 'Monthly' },
          ].map((badge) => (
            <div key={badge.label} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <p className="text-xs text-gray-400">{badge.label}</p>
              <p className="text-sm font-medium text-white">{badge.value}</p>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {securityFeatures.map((feature) => (
            <div key={feature.title} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="text-white font-semibold">{feature.title}</h3>
                  <p className="text-xs text-gray-400">{feature.description}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {feature.details.map((detail, i) => (
                  <li key={i} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {detail}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Audit Log */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">📋 Security Audit Log</h2>
          <div className="space-y-3">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
                <span className="text-xs text-gray-500 font-mono min-w-[90px]">{log.date}</span>
                <span className="flex-1 text-sm text-gray-300">{log.event}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[log.status]}`}>
                  {log.status}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible Disclosure */}
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">🐛 Responsible Disclosure</h2>
          <p className="text-sm text-gray-400 mb-4">
            Found a security vulnerability? We appreciate responsible disclosure. Please report security issues through our community channels on Pi Network.
          </p>
          <div className="flex flex-wrap gap-3">
            <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 border border-slate-700">
              ⏱️ Response within 24 hours
            </div>
            <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 border border-slate-700">
              🏆 Bug bounty rewards in Pi
            </div>
            <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 border border-slate-700">
              🤝 Hall of Fame recognition
            </div>
          </div>
        </div>

        {/* Data Handling */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📊 Data Handling Principles</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <span className="text-3xl block mb-2">🎯</span>
              <h3 className="text-sm font-medium text-white mb-1">Minimal Collection</h3>
              <p className="text-xs text-gray-400">We only collect data necessary for platform operation</p>
            </div>
            <div className="text-center p-4">
              <span className="text-3xl block mb-2">🔐</span>
              <h3 className="text-sm font-medium text-white mb-1">Secure Storage</h3>
              <p className="text-xs text-gray-400">All data encrypted at rest with industry-standard algorithms</p>
            </div>
            <div className="text-center p-4">
              <span className="text-3xl block mb-2">🚫</span>
              <h3 className="text-sm font-medium text-white mb-1">No Third-Party Sharing</h3>
              <p className="text-xs text-gray-400">Your data is never sold or shared with external parties</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}