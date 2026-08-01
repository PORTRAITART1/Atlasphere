import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import {
  getClimateData,
  getEcoScore,
  getClimateHistory,
  getAirQualityLabel,
  type ClimateHistory,
} from '@/lib/eco-data';

function ScoreGauge({ score, rank, percentile }: { score: number; rank: string; percentile: number }) {
  const circumference = 2 * Math.PI * 60;
  const offset = circumference - (score / 1000) * circumference;

  return (
    <div className="flex flex-col items-center">
      <div className="relative w-36 h-36">
        <svg className="w-full h-full -rotate-90" viewBox="0 0 140 140">
          <circle cx="70" cy="70" r="60" fill="none" stroke="currentColor" strokeWidth="8" className="text-gray-700" />
          <circle
            cx="70" cy="70" r="60" fill="none" strokeWidth="8"
            stroke="url(#scoreGradient)"
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
          />
          <defs>
            <linearGradient id="scoreGradient" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="text-3xl font-bold text-white">{score}</span>
          <span className="text-xs text-gray-400">/1000</span>
        </div>
      </div>
      <p className="text-sm font-semibold text-emerald-400 mt-2">{rank}</p>
      <p className="text-xs text-gray-400">Top {100 - percentile}% des utilisateurs</p>
    </div>
  );
}

function MetricCard({ icon, label, value, unit, color, subtext }: { icon: string; label: string; value: string | number; unit?: string; color: string; subtext?: string }) {
  return (
    <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4 hover:border-emerald-500/30 transition-colors">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-lg">{icon}</span>
        <span className="text-xs text-gray-400">{label}</span>
      </div>
      <p className={`text-xl font-bold ${color}`}>
        {value}{unit && <span className="text-sm font-normal text-gray-400 ml-1">{unit}</span>}
      </p>
      {subtext && <p className="text-xs text-gray-500 mt-1">{subtext}</p>}
    </div>
  );
}

function MiniChart({ data, dataKey, color }: { data: ClimateHistory[]; dataKey: keyof ClimateHistory; color: string }) {
  const values = data.map((d) => Number(d[dataKey]));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const range = max - min || 1;
  const height = 60;
  const width = 200;

  const points = values.map((v, i) => {
    const x = (i / (values.length - 1)) * width;
    const y = height - ((v - min) / range) * height;
    return `${x},${y}`;
  }).join(' ');

  return (
    <svg viewBox={`0 0 ${width} ${height}`} className="w-full h-16" preserveAspectRatio="none">
      <polyline
        points={points}
        fill="none"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function BreakdownBar({ label, value, max, color }: { label: string; value: number; max: number; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-400 w-20">{label}</span>
      <div className="flex-1 h-2 bg-gray-700 rounded-full overflow-hidden">
        <div className={`h-full rounded-full ${color}`} style={{ width: `${(value / max) * 100}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-300 w-8 text-right">{value}</span>
    </div>
  );
}

export default function ClimateDashboard() {
  const climate = getClimateData();
  const ecoScore = getEcoScore();
  const history = getClimateHistory();
  const airLabel = getAirQualityLabel(climate.airQualityIndex);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-900">
      <Navbar />
      <main className="max-w-6xl mx-auto px-4 py-8">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            🌍 Climate Dashboard
          </h1>
          <p className="text-sm text-gray-400 mt-1">Suivi environnemental en temps réel et score écologique</p>
        </div>

        {/* Score + Breakdown */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="bg-gradient-to-br from-emerald-900/30 to-teal-900/20 border border-emerald-500/20 rounded-2xl p-6 flex flex-col items-center justify-center">
            <ScoreGauge score={ecoScore.total} rank={ecoScore.rank} percentile={ecoScore.percentile} />
          </div>
          <div className="md:col-span-2 bg-slate-800/40 border border-slate-700/50 rounded-2xl p-6">
            <h3 className="text-sm font-semibold text-gray-300 mb-4">Détail du Score Écologique</h3>
            <div className="space-y-3">
              <BreakdownBar label="Transport" value={ecoScore.breakdown.transport} max={100} color="bg-emerald-500" />
              <BreakdownBar label="Énergie" value={ecoScore.breakdown.energy} max={100} color="bg-cyan-500" />
              <BreakdownBar label="Déchets" value={ecoScore.breakdown.waste} max={100} color="bg-green-500" />
              <BreakdownBar label="Alimentation" value={ecoScore.breakdown.food} max={100} color="bg-amber-500" />
              <BreakdownBar label="Eau" value={ecoScore.breakdown.water} max={100} color="bg-blue-500" />
            </div>
          </div>
        </div>

        {/* Climate Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-6">
          <MetricCard icon={airLabel.emoji} label="Qualité de l'Air" value={climate.airQualityIndex} unit="AQI" color={airLabel.color} subtext={airLabel.label} />
          <MetricCard icon="🏭" label="CO₂" value={climate.co2Level} unit="ppm" color="text-orange-400" subtext="Niveau atmosphérique" />
          <MetricCard icon="🌡️" label="Température" value={climate.temperature} unit="°C" color="text-red-400" subtext="Locale actuelle" />
          <MetricCard icon="💧" label="Humidité" value={climate.humidity} unit="%" color="text-blue-400" subtext="Relative" />
          <MetricCard icon="☀️" label="UV Index" value={climate.uvIndex} color="text-yellow-400" subtext="Élevé" />
          <MetricCard icon="🌸" label="Pollen" value={climate.pollenLevel === 'low' ? 'Faible' : climate.pollenLevel === 'medium' ? 'Moyen' : 'Élevé'} color="text-pink-400" />
          <MetricCard icon="🚰" label="Qualité Eau" value={climate.waterQuality} unit="/100" color="text-cyan-400" subtext="Potable" />
          <MetricCard icon="🔊" label="Bruit" value={climate.noiseLevel} unit="dB" color="text-purple-400" subtext="Modéré" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h4 className="text-xs text-gray-400 mb-2">Qualité de l'Air (30j)</h4>
            <MiniChart data={history} dataKey="airQuality" color="#10b981" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{history[0]?.date.slice(5)}</span>
              <span>{history[history.length - 1]?.date.slice(5)}</span>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h4 className="text-xs text-gray-400 mb-2">CO₂ (30j)</h4>
            <MiniChart data={history} dataKey="co2" color="#f59e0b" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{history[0]?.date.slice(5)}</span>
              <span>{history[history.length - 1]?.date.slice(5)}</span>
            </div>
          </div>
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-4">
            <h4 className="text-xs text-gray-400 mb-2">Température (30j)</h4>
            <MiniChart data={history} dataKey="temperature" color="#ef4444" />
            <div className="flex justify-between text-xs text-gray-500 mt-1">
              <span>{history[0]?.date.slice(5)}</span>
              <span>{history[history.length - 1]?.date.slice(5)}</span>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}