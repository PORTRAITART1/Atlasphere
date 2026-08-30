import { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ShieldAlert, LogIn, ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { t, useI18nRerender } from '@/lib/i18n';
import { getCurrentUser, subscribe } from '@/lib/pi-sdk';
import { isAdminUser } from '@/lib/admin';
import { useEffect, useState } from 'react';

interface AdminGuardProps {
  children: ReactNode;
}

/**
 * Restricts a page to administrator accounts.
 * Non-authenticated Pioneers are invited to sign in, authenticated non-admins get a
 * clear "insufficient permissions" screen instead of the protected content.
 */
export default function AdminGuard({ children }: AdminGuardProps) {
  useI18nRerender();
  const [, setUserTick] = useState(0);

  useEffect(() => subscribe(() => setUserTick((n) => n + 1)), []);

  const user = getCurrentUser();
  const allowed = isAdminUser();

  if (allowed) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <Card className="w-full max-w-md bg-slate-900/70 border-slate-700/60">
          <CardHeader className="text-center">
            <div className="mx-auto w-16 h-16 rounded-full bg-amber-500/15 flex items-center justify-center mb-4">
              <ShieldAlert className="h-8 w-8 text-amber-400" />
            </div>
            <CardTitle className="text-xl text-white">
              {t('set.admin_only_title')}
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-5 text-center">
            <p className="text-sm text-gray-400">
              {user ? t('set.admin_only_desc') : t('set.admin_login_desc')}
            </p>

            {user && (
              <div className="rounded-lg bg-slate-800/70 border border-slate-700/50 px-4 py-3 text-sm">
                <p className="text-gray-300">
                  {t('set.admin_current_account')}{' '}
                  <span className="font-medium text-white">@{user.username}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  {t('set.admin_role_standard')}
                </p>
              </div>
            )}

            <div className="space-y-2">
              {!user && (
                <Button asChild className="w-full bg-indigo-600 hover:bg-indigo-500 text-white">
                  <Link to="/dashboard">
                    <LogIn className="h-4 w-4 mr-2" />
                    {t('set.admin_login_action')}
                  </Link>
                </Button>
              )}
              <Button asChild variant="outline" className="w-full !bg-transparent hover:!bg-transparent text-gray-300 border-slate-600">
                <Link to="/">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  {t('set.admin_back_home')}
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      <Footer />
    </div>
  );
}