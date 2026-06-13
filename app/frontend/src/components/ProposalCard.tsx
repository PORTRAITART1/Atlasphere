import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { type Proposal, getStatusLabel, getStatusColor, getCategoryLabel } from '@/lib/store';

interface ProposalCardProps {
  proposal: Proposal;
  index?: number;
}

export default function ProposalCard({ proposal, index = 0 }: ProposalCardProps) {
  const votePercentage = proposal.totalVoters > 0 ? (proposal.votesFor / proposal.totalVoters) * 100 : 0;
  const fundingPercentage = proposal.fundingGoal > 0 ? (proposal.fundingRaised / proposal.fundingGoal) * 100 : 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{
        duration: 0.5,
        delay: index * 0.08,
        ease: [0.25, 0.46, 0.45, 0.94],
      }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
    >
      <Link
        to={`/proposal/${proposal.id}`}
        className="block bg-slate-800/50 border border-slate-700/50 rounded-xl p-5 hover:border-indigo-500/40 hover:bg-slate-800/80 transition-all group h-full"
      >
        <div className="flex items-start justify-between mb-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(proposal.status)}`}>
            {getStatusLabel(proposal.status)}
          </span>
          <span className="text-xs text-gray-500">{getCategoryLabel(proposal.category)}</span>
        </div>

        <h3 className="text-lg font-semibold text-white group-hover:text-indigo-300 transition-colors mb-2">
          {proposal.title}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-2 mb-4">{proposal.description}</p>

        <div className="flex items-center gap-2 mb-4">
          <span className="text-lg">{proposal.authorAvatar}</span>
          <span className="text-sm text-gray-400">{proposal.author}</span>
          <span className="text-xs text-gray-600 ml-auto">{proposal.createdAt}</span>
        </div>

        {(proposal.status === 'voting') && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>Votes: {proposal.totalVoters}</span>
              <span>{votePercentage.toFixed(0)}% Pour</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-emerald-500 to-emerald-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${votePercentage}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
              />
            </div>
          </div>
        )}

        {(proposal.status === 'funding' || proposal.status === 'funded' || proposal.status === 'completed') && (
          <div className="space-y-1.5">
            <div className="flex justify-between text-xs text-gray-400">
              <span>{proposal.fundingRaised.toLocaleString()} π / {proposal.fundingGoal.toLocaleString()} π</span>
              <span>{fundingPercentage.toFixed(0)}%</span>
            </div>
            <div className="w-full h-2 bg-slate-700 rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-gradient-to-r from-amber-500 to-amber-400 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(fundingPercentage, 100)}%` }}
                transition={{ duration: 0.8, delay: 0.3 + index * 0.08, ease: 'easeOut' }}
              />
            </div>
            <div className="text-xs text-gray-500">{proposal.contributors} contributeurs</div>
          </div>
        )}
      </Link>
    </motion.div>
  );
}