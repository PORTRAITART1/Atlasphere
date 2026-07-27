import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { t, subscribeI18n } from '@/lib/i18n';

interface ApiEndpoint {
  method: 'GET' | 'POST' | 'PUT' | 'DELETE';
  path: string;
  description: string;
  auth: boolean;
  params?: { name: string; type: string; required: boolean; description: string }[];
  response?: string;
}

interface ApiSection {
  title: string;
  icon: string;
  description: string;
  endpoints: ApiEndpoint[];
}

const apiSections: ApiSection[] = [
  {
    title: 'Authentication',
    icon: '🔐',
    description: 'Pi Network authentication and user management',
    endpoints: [
      { method: 'POST', path: '/api/v1/pi-auth/verify', description: 'Verify Pi Network access token and create/update user profile', auth: false, params: [{ name: 'access_token', type: 'string', required: true, description: 'Pi Network access token from Pi.authenticate()' }], response: '{ user: { uid, username, roles }, token }' },
      { method: 'GET', path: '/api/v1/pi-auth/me', description: 'Get current authenticated user profile', auth: true, response: '{ uid, username, reputation_score, voting_weight }' },
    ],
  },
  {
    title: 'Projects / Proposals',
    icon: '📋',
    description: 'CRUD operations for governance proposals',
    endpoints: [
      { method: 'GET', path: '/api/v1/entities/projects/all', description: 'List all projects (public, no auth required)', auth: false, params: [{ name: 'query', type: 'JSON string', required: false, description: 'Filter conditions e.g. {"status":"voting"}' }, { name: 'sort', type: 'string', required: false, description: 'Sort field, prefix with - for DESC' }, { name: 'skip', type: 'integer', required: false, description: 'Pagination offset (default: 0)' }, { name: 'limit', type: 'integer', required: false, description: 'Page size (default: 20, max: 2000)' }], response: '{ items: Project[], total, skip, limit }' },
      { method: 'GET', path: '/api/v1/entities/projects', description: 'List my projects (authenticated)', auth: true, response: '{ items: Project[], total, skip, limit }' },
      { method: 'GET', path: '/api/v1/entities/projects/:id', description: 'Get project by ID', auth: true, response: 'Project' },
      { method: 'POST', path: '/api/v1/entities/projects', description: 'Create a new project/proposal', auth: true, params: [{ name: 'title', type: 'string', required: true, description: 'Project title' }, { name: 'description', type: 'string', required: true, description: 'Full description' }, { name: 'category', type: 'string', required: true, description: 'education|commerce|technology|social|environment' }, { name: 'budget', type: 'number', required: true, description: 'Funding goal in Pi' }], response: 'Project' },
      { method: 'PUT', path: '/api/v1/entities/projects/:id', description: 'Update a project (owner only)', auth: true, response: 'Project' },
      { method: 'DELETE', path: '/api/v1/entities/projects/:id', description: 'Delete a project (owner only)', auth: true, response: '{ message }' },
    ],
  },
  {
    title: 'Votes',
    icon: '🗳️',
    description: 'Voting on proposals with reputation-weighted system',
    endpoints: [
      { method: 'GET', path: '/api/v1/entities/votes/all', description: 'List all votes (public)', auth: false, params: [{ name: 'query', type: 'JSON string', required: false, description: 'Filter e.g. {"project_id":1}' }], response: '{ items: Vote[], total, skip, limit }' },
      { method: 'GET', path: '/api/v1/entities/votes', description: 'List my votes', auth: true, response: '{ items: Vote[], total, skip, limit }' },
      { method: 'POST', path: '/api/v1/entities/votes', description: 'Cast a vote on a project', auth: true, params: [{ name: 'project_id', type: 'integer', required: true, description: 'Project to vote on' }, { name: 'vote_type', type: 'string', required: true, description: 'for|against' }, { name: 'weight', type: 'number', required: true, description: 'Vote weight (based on reputation)' }, { name: 'pi_uid', type: 'string', required: true, description: 'Voter Pi UID' }], response: 'Vote' },
    ],
  },
  {
    title: 'Contributions',
    icon: '💰',
    description: 'Crowdfunding contributions to approved projects',
    endpoints: [
      { method: 'GET', path: '/api/v1/entities/contributions/all', description: 'List all contributions (public)', auth: false, response: '{ items: Contribution[], total, skip, limit }' },
      { method: 'GET', path: '/api/v1/entities/contributions', description: 'List my contributions', auth: true, response: '{ items: Contribution[], total, skip, limit }' },
      { method: 'POST', path: '/api/v1/entities/contributions', description: 'Create a contribution', auth: true, params: [{ name: 'project_id', type: 'integer', required: true, description: 'Project to fund' }, { name: 'amount', type: 'number', required: true, description: 'Amount in Pi' }, { name: 'pi_uid', type: 'string', required: true, description: 'Contributor Pi UID' }], response: 'Contribution' },
    ],
  },
  {
    title: 'Pi Payments',
    icon: '💎',
    description: 'Pi Network payment processing (U2A and A2U)',
    endpoints: [
      { method: 'POST', path: '/api/v1/pi-payments/approve', description: 'Server-side approval of a pending payment', auth: true, params: [{ name: 'paymentId', type: 'string', required: true, description: 'Pi payment identifier' }], response: '{ status, txid }' },
      { method: 'POST', path: '/api/v1/pi-payments/complete', description: 'Complete an approved payment', auth: true, params: [{ name: 'paymentId', type: 'string', required: true, description: 'Pi payment identifier' }, { name: 'txid', type: 'string', required: true, description: 'Transaction ID' }], response: '{ status, completed }' },
      { method: 'GET', path: '/api/v1/pi-payments/status/:paymentId', description: 'Check payment status', auth: true, response: '{ paymentId, status, amount }' },
    ],
  },
  {
    title: 'Notifications',
    icon: '🔔',
    description: 'User notification management',
    endpoints: [
      { method: 'GET', path: '/api/v1/entities/notifications', description: 'List my notifications', auth: true, response: '{ items: Notification[], total, skip, limit }' },
      { method: 'PUT', path: '/api/v1/entities/notifications/:id', description: 'Mark notification as read', auth: true, params: [{ name: 'read', type: 'boolean', required: true, description: 'Set to true' }], response: 'Notification' },
    ],
  },
  {
    title: 'Comments',
    icon: '💬',
    description: 'Discussion system for proposals',
    endpoints: [
      { method: 'GET', path: '/api/v1/entities/comments/all', description: 'List all comments (public)', auth: false, params: [{ name: 'query', type: 'JSON string', required: false, description: 'Filter e.g. {"project_id":1}' }], response: '{ items: Comment[], total, skip, limit }' },
      { method: 'POST', path: '/api/v1/entities/comments', description: 'Post a comment', auth: true, params: [{ name: 'project_id', type: 'integer', required: true, description: 'Project to comment on' }, { name: 'content', type: 'string', required: true, description: 'Comment text' }, { name: 'author_name', type: 'string', required: true, description: 'Display name' }], response: 'Comment' },
    ],
  },
];

const methodColors: Record<string, string> = {
  GET: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
  POST: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  PUT: 'bg-amber-500/20 text-amber-400 border-amber-500/30',
  DELETE: 'bg-red-500/20 text-red-400 border-red-500/30',
};

export default function ApiDocs() {
  const [, setLangTick] = useState(0);
  const [expandedSection, setExpandedSection] = useState<string | null>('Projects / Proposals');
  const [expandedEndpoint, setExpandedEndpoint] = useState<string | null>(null);

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
            📖 {t('api.title') || 'API Documentation'}
          </h1>
          <p className="text-gray-400">
            {t('api.subtitle') || 'Complete reference for the Atlasphere REST API'}
          </p>
          <div className="flex items-center gap-4 mt-4">
            <span className="text-xs px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              Base URL: /api/v1
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 border border-indigo-500/30">
              Format: JSON
            </span>
            <span className="text-xs px-3 py-1 rounded-full bg-amber-500/20 text-amber-400 border border-amber-500/30">
              Auth: Bearer Token
            </span>
          </div>
        </div>

        {/* Auth Info */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mb-8">
          <h2 className="text-lg font-semibold text-white mb-3">🔑 Authentication</h2>
          <p className="text-sm text-gray-400 mb-3">
            Most endpoints require authentication via Pi Network. Include the access token in the Authorization header:
          </p>
          <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm">
            <span className="text-gray-500">// Header</span>
            <br />
            <span className="text-emerald-400">Authorization</span>: <span className="text-amber-300">Bearer {'<pi_access_token>'}</span>
          </div>
          <p className="text-xs text-gray-500 mt-3">
            Endpoints marked with 🔓 require authentication. Public endpoints (marked ✅) can be accessed without a token.
          </p>
        </div>

        {/* API Sections */}
        <div className="space-y-4">
          {apiSections.map((section) => (
            <div key={section.title} className="bg-slate-800/40 border border-slate-700/50 rounded-xl overflow-hidden">
              {/* Section Header */}
              <button
                onClick={() => setExpandedSection(expandedSection === section.title ? null : section.title)}
                className="w-full flex items-center justify-between p-5 hover:bg-slate-700/20 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{section.icon}</span>
                  <div className="text-left">
                    <h3 className="text-white font-semibold">{section.title}</h3>
                    <p className="text-sm text-gray-400">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xs text-gray-500">{section.endpoints.length} endpoints</span>
                  <span className={`text-gray-400 transition-transform ${expandedSection === section.title ? 'rotate-180' : ''}`}>
                    ▼
                  </span>
                </div>
              </button>

              {/* Endpoints */}
              {expandedSection === section.title && (
                <div className="border-t border-slate-700/50 divide-y divide-slate-700/30">
                  {section.endpoints.map((endpoint) => {
                    const key = `${endpoint.method}-${endpoint.path}`;
                    const isExpanded = expandedEndpoint === key;
                    return (
                      <div key={key} className="px-5">
                        <button
                          onClick={() => setExpandedEndpoint(isExpanded ? null : key)}
                          className="w-full flex items-center gap-3 py-4 hover:opacity-80 transition-opacity"
                        >
                          <span className={`text-xs font-mono font-bold px-2 py-0.5 rounded border ${methodColors[endpoint.method]}`}>
                            {endpoint.method}
                          </span>
                          <span className="text-sm font-mono text-gray-300 flex-1 text-left">{endpoint.path}</span>
                          <span className="text-xs">{endpoint.auth ? '🔓' : '✅'}</span>
                        </button>

                        {isExpanded && (
                          <div className="pb-4 pl-16 space-y-3">
                            <p className="text-sm text-gray-400">{endpoint.description}</p>

                            {endpoint.params && endpoint.params.length > 0 && (
                              <div>
                                <p className="text-xs font-medium text-gray-300 mb-2">Parameters:</p>
                                <div className="bg-slate-900/60 rounded-lg overflow-hidden">
                                  <table className="w-full text-xs">
                                    <thead>
                                      <tr className="border-b border-slate-700/50">
                                        <th className="text-left p-2 text-gray-400">Name</th>
                                        <th className="text-left p-2 text-gray-400">Type</th>
                                        <th className="text-left p-2 text-gray-400">Required</th>
                                        <th className="text-left p-2 text-gray-400">Description</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {endpoint.params.map((param) => (
                                        <tr key={param.name} className="border-b border-slate-800/50">
                                          <td className="p-2 font-mono text-indigo-300">{param.name}</td>
                                          <td className="p-2 text-amber-300">{param.type}</td>
                                          <td className="p-2">{param.required ? <span className="text-red-400">Yes</span> : <span className="text-gray-500">No</span>}</td>
                                          <td className="p-2 text-gray-400">{param.description}</td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}

                            {endpoint.response && (
                              <div>
                                <p className="text-xs font-medium text-gray-300 mb-1">Response:</p>
                                <code className="text-xs bg-slate-900/60 px-3 py-1.5 rounded text-emerald-300 inline-block">
                                  {endpoint.response}
                                </code>
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Rate Limits */}
        <div className="bg-slate-800/40 border border-slate-700/50 rounded-xl p-6 mt-8">
          <h2 className="text-lg font-semibold text-white mb-3">⚡ Rate Limits & Best Practices</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Rate Limits</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Public endpoints: 100 requests/minute</li>
                <li>• Authenticated endpoints: 300 requests/minute</li>
                <li>• Write operations: 30 requests/minute</li>
                <li>• Payment endpoints: 10 requests/minute</li>
              </ul>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-300 mb-2">Best Practices</h3>
              <ul className="text-sm text-gray-400 space-y-1">
                <li>• Use pagination (skip/limit) for large datasets</li>
                <li>• Cache public data client-side</li>
                <li>• Handle 429 (Too Many Requests) with exponential backoff</li>
                <li>• Always verify payment status server-side</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}