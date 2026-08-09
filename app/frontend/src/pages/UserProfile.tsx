import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCurrentUser, logout, subscribe, type PiUser } from '@/lib/pi-sdk';
import { getUserProfile } from '@/lib/advanced-features';
import { t } from '@/lib/i18n';
import { User, Award, Vote, Coins, Leaf, Database, Users, Flame, Shield, LogOut, Camera } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function UserProfile() {
  const [user, setUser] = useState<PiUser | null>(getCurrentUser());
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const profile = getUserProfile();

  useEffect(() => {
    return subscribe(() => setUser(getCurrentUser()));
  }, []);

  // Load saved avatar from localStorage
  useEffect(() => {
    const savedAvatar = localStorage.getItem('atlasphere_avatar');
    if (savedAvatar) {
      setAvatarUrl(savedAvatar);
    }
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) return;

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      setAvatarUrl(dataUrl);
      localStorage.setItem('atlasphere_avatar', dataUrl);
    };
    reader.readAsDataURL(file);
  };

  const xpPct = (profile.xp / profile.xpNext) * 100;
  const displayName = user?.username || profile.username;

  const statCards = [
    { label: t('profile.reputation'), value: user?.reputation || profile.reputation, icon: <Award className="w-4 h-4" />, color: 'text-amber-400' },
    { label: t('profile.proposals'), value: user?.proposalsCreated || profile.proposals, icon: <Vote className="w-4 h-4" />, color: 'text-indigo-400' },
    { label: t('profile.votes'), value: user?.votescast || profile.votes, icon: <Vote className="w-4 h-4" />, color: 'text-cyan-400' },
    { label: t('profile.contributions'), value: user?.contributions || profile.contributions, icon: <Coins className="w-4 h-4" />, color: 'text-emerald-400' },
    { label: 'NFTs', value: profile.nfts, icon: <Database className="w-4 h-4" />, color: 'text-purple-400' },
    { label: t('profile.referrals'), value: profile.referrals, icon: <Users className="w-4 h-4" />, color: 'text-orange-400' },
    { label: 'Streak', value: `${user?.streakDays || profile.streak}j`, icon: <Flame className="w-4 h-4" />, color: 'text-red-400' },
    { label: t('profile.carbon_offset'), value: `${profile.carbonOffset}t`, icon: <Leaf className="w-4 h-4" />, color: 'text-green-400' },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="container mx-auto px-4 pt-24 pb-12">
        {/* Profile Header */}
        <div className="bg-gradient-to-br from-indigo-900/40 to-purple-900/30 border border-indigo-500/30 rounded-2xl p-8 mb-8">
          <div className="flex items-center gap-6">
            {/* Avatar with upload capability */}
            <div className="relative group cursor-pointer" onClick={handleAvatarClick}>
              <div className="w-20 h-20 rounded-full bg-indigo-500/20 border-2 border-indigo-500/50 flex items-center justify-center text-4xl overflow-hidden">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="Avatar" className="w-full h-full object-cover" />
                ) : (
                  <span>{profile.avatar}</span>
                )}
              </div>
              {/* Overlay on hover */}
              <div className="absolute inset-0 rounded-full bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <Camera className="w-6 h-6 text-white" />
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                className="hidden"
              />
            </div>

            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <h1 className="text-2xl font-bold text-white">@{displayName}</h1>
                <span className="text-xs bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded-full">
                  Niv. {user?.level || profile.level}
                </span>
                {user?.kycVerified && (
                  <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded-full">✓ KYC</span>
                )}
              </div>
              <p className="text-sm text-indigo-300">{profile.title}</p>
              <p className="text-xs text-gray-500 mt-1">{t('profile.member_since')} {user?.joinedDate || profile.joinedAt}</p>

              {/* XP Bar */}
              <div className="mt-3 max-w-md">
                <div className="flex justify-between text-xs mb-1">
                  <span className="text-gray-400">XP</span>
                  <span className="text-indigo-300">{profile.xp.toLocaleString()} / {profile.xpNext.toLocaleString()}</span>
                </div>
                <div className="h-2.5 bg-gray-700 rounded-full overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full" style={{ width: `${xpPct}%` }} />
                </div>
              </div>
            </div>
          </div>

          {/* Balances */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6">
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-emerald-400">{profile.ecoBalance}</p>
              <p className="text-xs text-gray-500">ECO</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-amber-400">{user?.piBalance?.toFixed(1) || profile.piBalance} π</p>
              <p className="text-xs text-gray-500">Pi</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-purple-400">{profile.badges}/{profile.totalBadges}</p>
              <p className="text-xs text-gray-500">Badges</p>
            </div>
            <div className="bg-black/20 rounded-xl p-3 text-center">
              <p className="text-lg font-bold text-cyan-400">{profile.dataShared}</p>
              <p className="text-xs text-gray-500">{t('profile.data_shared')}</p>
            </div>
          </div>

          {/* Disconnect Button */}
          <div className="mt-6 flex justify-end">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20 hover:text-red-300 transition-all duration-200 font-medium text-sm"
            >
              <LogOut className="w-4 h-4" />
              <span>{t('profile.logout')}</span>
            </button>
          </div>
        </div>

        {/* Guild Info */}
        <div className="bg-slate-900/60 border border-white/10 rounded-xl p-5 mb-8 flex items-center gap-4">
          <Shield className="w-8 h-8 text-emerald-400" />
          <div>
            <h3 className="text-sm font-semibold text-white">{profile.guild}</h3>
            <p className="text-xs text-gray-400">{t('profile.role')}: {profile.guildRole}</p>
          </div>
          <Link to="/guilds" className="ml-auto text-xs text-indigo-400 hover:text-indigo-300 transition-colors">
            {t('profile.view_guild')} →
          </Link>
        </div>

        {/* Stats Grid */}
        <h2 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
          <User className="w-5 h-5 text-indigo-400" />
          {t('profile.statistics')}
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-8">
          {statCards.map((stat) => (
            <div key={stat.label} className="bg-slate-900/60 border border-white/10 rounded-xl p-4 text-center hover:border-indigo-500/20 transition-all">
              <div className={`flex justify-center mb-2 ${stat.color}`}>{stat.icon}</div>
              <p className={`text-xl font-bold ${stat.color}`}>{stat.value}</p>
              <p className="text-xs text-gray-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Quick Links */}
        <h2 className="text-lg font-bold text-white mb-4">{t('profile.quick_access')}</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[
            { path: '/rewards', label: `🎁 ${t('profile.rewards')}`, desc: 'XP & actions' },
            { path: '/badges', label: `🏅 Badges`, desc: 'Achievements' },
            { path: '/referral', label: `👥 ${t('profile.referral')}`, desc: t('profile.invite_friends') },
            { path: '/eco-wallet', label: `💰 ${t('profile.wallet')}`, desc: 'ECO & Pi' },
            { path: '/ipfs-storage', label: `💾 ${t('profile.storage')}`, desc: t('profile.my_data') },
            { path: '/my-dashboard', label: `📊 ${t('profile.my_board')}`, desc: 'Dashboard' },
          ].map((link) => (
            <Link key={link.path} to={link.path} className="bg-slate-900/60 border border-white/10 rounded-xl p-4 hover:border-indigo-500/20 transition-all block">
              <p className="text-sm font-medium text-white">{link.label}</p>
              <p className="text-xs text-gray-500">{link.desc}</p>
            </Link>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}