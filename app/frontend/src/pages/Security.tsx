import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, useI18nRerender } from '@/lib/i18n';

interface SecurityFeature {
  icon: string;
  titleKey: string;
  descKey: string;
  detailKeys: string[];
}

const securityFeatures: SecurityFeature[] = [
  { icon: '🔐', titleKey: 'sec.f1t', descKey: 'sec.f1d', detailKeys: ['sec.f1_1', 'sec.f1_2', 'sec.f1_3', 'sec.f1_4'] },
  { icon: '🛡️', titleKey: 'sec.f2t', descKey: 'sec.f2d', detailKeys: ['sec.f2_1', 'sec.f2_2', 'sec.f2_3', 'sec.f2_4'] },
  { icon: '📜', titleKey: 'sec.f3t', descKey: 'sec.f3d', detailKeys: ['sec.f3_1', 'sec.f3_2', 'sec.f3_3', 'sec.f3_4'] },
  { icon: '🗳️', titleKey: 'sec.f4t', descKey: 'sec.f4d', detailKeys: ['sec.f4_1', 'sec.f4_2', 'sec.f4_3', 'sec.f4_4'] },
  { icon: '💰', titleKey: 'sec.f5t', descKey: 'sec.f5d', detailKeys: ['sec.f5_1', 'sec.f5_2', 'sec.f5_3', 'sec.f5_4'] },
  { icon: '🔍', titleKey: 'sec.f6t', descKey: 'sec.f6d', detailKeys: ['sec.f6_1', 'sec.f6_2', 'sec.f6_3', 'sec.f6_4'] },
];

interface AuditLog {
  date: string;
  eventKey: string;
  status: 'passed' | 'info' | 'resolved';
}

const auditLogs: AuditLog[] = [
  { date: '2026-06-25', eventKey: 'sec.a1', status: 'passed' },
  { date: '2026-06-20', eventKey: 'sec.a2', status: 'passed' },
  { date: '2026-06-15', eventKey: 'sec.a3', status: 'info' },
  { date: '2026-06-10', eventKey: 'sec.a4', status: 'resolved' },
  { date: '2026-06-05', eventKey: 'sec.a5', status: 'resolved' },
  { date: '2026-05-30', eventKey: 'sec.a6', status: 'passed' },
  { date: '2026-05-25', eventKey: 'sec.a7', status: 'info' },
];

const statusColors: Record<string, string> = {
  passed: 'bg-emerald-500/20 text-emerald-400',
  info: 'bg-blue-500/20 text-blue-400',
  resolved: 'bg-amber-500/20 text-amber-400',
};

const statusKeys: Record<string, string> = {
  passed: 'sec.st_passed',
  info: 'sec.st_info',
  resolved: 'sec.st_resolved',
};

export default function Security() {
  useI18nRerender();

  const trustBadges = [
    { icon: '✅', labelKey: 'sec.b_verified', valueKey: 'sec.b_platform' },
    { icon: '🔒', labelKey: null, label: 'TLS 1.3', valueKey: 'sec.b_encrypted' },
    { icon: '📊', labelKey: 'sec.b_uptime', value: '99.9%' },
    { icon: '🛡️', labelKey: 'sec.b_audited', valueKey: 'sec.b_monthly' },
  ] as { icon: string; labelKey?: string | null; label?: string; valueKey?: string; value?: string }[];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            🛡️ {t('sec.title')}
          </h1>
          <p className="text-gray-400">{t('sec.subtitle')}</p>
        </div>

        {/* Trust Badges */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {trustBadges.map((badge, i) => (
            <div key={i} className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 text-center">
              <span className="text-2xl block mb-1">{badge.icon}</span>
              <p className="text-xs text-gray-400">{badge.labelKey ? t(badge.labelKey) : badge.label}</p>
              <p className="text-sm font-medium text-white">{badge.valueKey ? t(badge.valueKey) : badge.value}</p>
            </div>
          ))}
        </div>

        {/* Security Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {securityFeatures.map((feature) => (
            <div key={feature.titleKey} className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{feature.icon}</span>
                <div>
                  <h3 className="text-white font-semibold">{t(feature.titleKey)}</h3>
                  <p className="text-xs text-gray-400">{t(feature.descKey)}</p>
                </div>
              </div>
              <ul className="space-y-2">
                {feature.detailKeys.map((detailKey) => (
                  <li key={detailKey} className="flex items-start gap-2 text-sm text-gray-300">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    {t(detailKey)}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Audit Log */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-4">📋 {t('sec.audit_h')}</h2>
          <div className="space-y-3">
            {auditLogs.map((log, i) => (
              <div key={i} className="flex items-center gap-4 p-3 bg-slate-800/30 rounded-lg">
                <span className="text-xs text-gray-500 font-mono min-w-[90px]">{log.date}</span>
                <span className="flex-1 text-sm text-gray-300">{t(log.eventKey)}</span>
                <span className={`text-xs px-2 py-0.5 rounded-full whitespace-nowrap ${statusColors[log.status]}`}>
                  {t(statusKeys[log.status])}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Responsible Disclosure */}
        <div className="bg-indigo-600/10 border border-indigo-500/20 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">🐛 {t('sec.disc_h')}</h2>
          <p className="text-sm text-gray-400 mb-4">{t('sec.disc_p')}</p>
          <div className="flex flex-wrap gap-3">
            <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 border border-slate-700">
              ⏱️ {t('sec.disc_1')}
            </div>
            <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 border border-slate-700">
              🏆 {t('sec.disc_2')}
            </div>
            <div className="text-xs px-3 py-1.5 rounded-lg bg-slate-800 text-gray-300 border border-slate-700">
              🤝 {t('sec.disc_3')}
            </div>
          </div>
        </div>

        {/* Data Handling */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6">
          <h2 className="text-lg font-semibold text-white mb-4">📊 {t('sec.data_h')}</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4">
              <span className="text-3xl block mb-2">🎯</span>
              <h3 className="text-sm font-medium text-white mb-1">{t('sec.d1t')}</h3>
              <p className="text-xs text-gray-400">{t('sec.d1d')}</p>
            </div>
            <div className="text-center p-4">
              <span className="text-3xl block mb-2">🔐</span>
              <h3 className="text-sm font-medium text-white mb-1">{t('sec.d2t')}</h3>
              <p className="text-xs text-gray-400">{t('sec.d2d')}</p>
            </div>
            <div className="text-center p-4">
              <span className="text-3xl block mb-2">🚫</span>
              <h3 className="text-sm font-medium text-white mb-1">{t('sec.d3t')}</h3>
              <p className="text-xs text-gray-400">{t('sec.d3d')}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}