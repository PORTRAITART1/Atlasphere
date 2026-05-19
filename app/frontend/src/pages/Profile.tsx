import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUser, subscribe as storeSubscribe, TRANSACTIONS } from '@/lib/store';
import { t } from '@/lib/i18n';
import { User, Wallet, Star, Clock, ArrowUpRight, ArrowDownLeft } from 'lucide-react';

export default function ProfilePage() {
  const [user, setUser] = useState(getUser());

  useEffect(() => {
    const unsub = storeSubscribe(() => setUser(getUser()));
    return unsub;
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="max-w-4xl mx-auto px-4 py-16 text-center">
          <User className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Connect to View Profile</h2>
          <p className="text-gray-400 mb-6">Please authenticate with Pi Network to access your profile.</p>
          <Link to="/">
            <Button className="bg-purple-600 hover:bg-purple-500 text-white">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-white mb-8">{t('profile.title')}</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Profile Card */}
          <Card className="bg-gray-800/50 border-purple-500/20">
            <CardContent className="p-6 text-center">
              <div className="w-20 h-20 rounded-full bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center mx-auto mb-4">
                <span className="text-white text-2xl font-bold">{user.username.charAt(0)}</span>
              </div>
              <h2 className="text-xl font-bold text-white">{user.username}</h2>
              <p className="text-gray-400 text-sm mt-1">Pioneer since {user.joinedDate}</p>
              <Badge className="mt-3 bg-purple-500/20 text-purple-300">Pioneer Pro</Badge>

              <div className="mt-6 space-y-4">
                <div>
                  <p className="text-gray-400 text-sm">{t('profile.reputation')}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <Progress value={user.reputation} className="flex-1 h-2" />
                    <span className="text-green-400 font-medium text-sm">{user.reputation}%</span>
                  </div>
                </div>
                <div className="bg-gray-900/50 rounded-lg p-4">
                  <p className="text-gray-400 text-sm">{t('profile.balance')}</p>
                  <div className="flex items-center justify-center gap-1 mt-1">
                    <Wallet className="h-5 w-5 text-amber-400" />
                    <span className="text-2xl font-bold text-amber-400">{user.piBalance}</span>
                    <span className="text-amber-400">π</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions */}
          <div className="lg:col-span-2">
            <Card className="bg-gray-800/50 border-purple-500/20">
              <CardHeader>
                <h3 className="text-lg font-bold text-white">{t('profile.transactions')}</h3>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {TRANSACTIONS.map(tx => (
                    <div key={tx.id} className="flex items-center gap-3 p-3 bg-gray-900/50 rounded-lg">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                        tx.type === 'sale' ? 'bg-green-500/20' : tx.type === 'subscription' ? 'bg-purple-500/20' : 'bg-blue-500/20'
                      }`}>
                        {tx.type === 'sale' ? (
                          <ArrowDownLeft className="h-4 w-4 text-green-400" />
                        ) : (
                          <ArrowUpRight className="h-4 w-4 text-blue-400" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-white text-sm font-medium truncate">{tx.item}</p>
                        <div className="flex items-center gap-2">
                          <Clock className="h-3 w-3 text-gray-500" />
                          <span className="text-gray-500 text-xs">{tx.date}</span>
                          <Badge variant="outline" className={`text-xs ${
                            tx.status === 'completed' ? 'border-green-500/50 text-green-400' : 'border-yellow-500/50 text-yellow-400'
                          }`}>
                            {tx.status}
                          </Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`font-medium ${tx.type === 'sale' ? 'text-green-400' : 'text-amber-400'}`}>
                          {tx.type === 'sale' ? '+' : '-'}{tx.amount} π
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <div className="grid grid-cols-3 gap-4 mt-6">
              <Card className="bg-gray-800/50 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <Star className="h-5 w-5 text-amber-400 mx-auto mb-1" />
                  <p className="text-white font-bold">4.8</p>
                  <p className="text-gray-500 text-xs">Avg Rating</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <ArrowUpRight className="h-5 w-5 text-blue-400 mx-auto mb-1" />
                  <p className="text-white font-bold">12</p>
                  <p className="text-gray-500 text-xs">Purchases</p>
                </CardContent>
              </Card>
              <Card className="bg-gray-800/50 border-purple-500/20">
                <CardContent className="p-4 text-center">
                  <ArrowDownLeft className="h-5 w-5 text-green-400 mx-auto mb-1" />
                  <p className="text-white font-bold">8</p>
                  <p className="text-gray-500 text-xs">Sales</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
}