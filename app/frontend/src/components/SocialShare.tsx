import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface SocialShareProps {
  title: string;
  description?: string;
  url?: string;
  className?: string;
}

export default function SocialShare({ title, description, url, className = '' }: SocialShareProps) {
  const [showTooltip, setShowTooltip] = useState(false);
  const shareUrl = url || window.location.href;
  const shareText = description ? `${title} — ${description}` : title;

  const shareLinks = [
    {
      name: 'Twitter/X',
      icon: '𝕏',
      color: 'hover:bg-black hover:text-white',
      getUrl: () => `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`,
    },
    {
      name: 'WhatsApp',
      icon: '📱',
      color: 'hover:bg-green-600 hover:text-white',
      getUrl: () => `https://wa.me/?text=${encodeURIComponent(`${shareText}\n${shareUrl}`)}`,
    },
    {
      name: 'Telegram',
      icon: '✈️',
      color: 'hover:bg-blue-500 hover:text-white',
      getUrl: () => `https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareText)}`,
    },
    {
      name: 'Copier',
      icon: '📋',
      color: 'hover:bg-indigo-600 hover:text-white',
      getUrl: () => '',
      action: async () => {
        await navigator.clipboard.writeText(shareUrl);
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
      },
    },
  ];

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <span className="text-xs text-gray-400 mr-1">Partager :</span>
      {shareLinks.map((link) => (
        <div key={link.name} className="relative">
          {link.action ? (
            <Button
              variant="ghost"
              size="sm"
              onClick={link.action}
              className={`w-8 h-8 p-0 rounded-full bg-slate-700/50 border border-slate-600/50 text-sm ${link.color} transition-all`}
              title={link.name}
            >
              {link.icon}
            </Button>
          ) : (
            <a
              href={link.getUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className={`inline-flex items-center justify-center w-8 h-8 rounded-full bg-slate-700/50 border border-slate-600/50 text-sm ${link.color} transition-all`}
              title={link.name}
            >
              {link.icon}
            </a>
          )}
          <AnimatePresence>
            {link.name === 'Copier' && showTooltip && (
              <motion.span
                className="absolute -top-8 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-xs px-2 py-1 rounded whitespace-nowrap"
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
              >
                Copié !
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}