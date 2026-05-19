import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getUser, subscribe as storeSubscribe, PRODUCTS } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Plus, Package, TrendingUp, DollarSign, Users, Store } from 'lucide-react';

export default function SellerPage() {
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
          <Store className="h-16 w-16 text-gray-600 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Start Selling on PiMarket</h2>
          <p className="text-gray-400 mb-6">Connect with Pi Network to access your seller dashboard.</p>
          <Link to="/">
            <Button className="bg-purple-600 hover:bg-purple-500 text-white">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  const myProducts = PRODUCTS.slice(0, 3); // Simulated seller products

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-3xl font-bold text-white">{t('seller.title')}</h1>
          <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white">
            <Plus className="h-4 w-4 mr-2" />
            {t('seller.addProduct')}
          </Button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {[
            { label: 'Total Revenue', value: '1,250 π', icon: DollarSign, color: 'text-amber-400' },
            { label: 'Active Listings', value: '8', icon: Package, color: 'text-purple-400' },
            { label: 'Total Orders', value: '42', icon: TrendingUp, color: 'text-green-400' },
            { label: 'Customers', value: '156', icon: Users, color: 'text-blue-400' },
          ].map((stat, i) => (
            <Card key={i} className="bg-gray-800/50 border-purple-500/20">
              <CardContent className="p-4 flex items-center gap-3">
                <div className={`w-10 h-10 rounded-lg bg-gray-900/50 flex items-center justify-center`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
                <div>
                  <p className="text-gray-400 text-xs">{stat.label}</p>
                  <p className="text-white font-bold text-lg">{stat.value}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Add Product Form */}
        <Card className="bg-gray-800/50 border-purple-500/20 mb-8">
          <CardHeader>
            <h3 className="text-lg font-bold text-white">Quick Add Product</h3>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Input placeholder="Product name" className="bg-gray-900/50 border-purple-500/30 text-white placeholder:text-gray-500" />
              <Input placeholder="Price in Pi" type="number" className="bg-gray-900/50 border-purple-500/30 text-white placeholder:text-gray-500" />
              <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                <Plus className="h-4 w-4 mr-2" />
                Add Listing
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* My Listings */}
        <Card className="bg-gray-800/50 border-purple-500/20">
          <CardHeader>
            <h3 className="text-lg font-bold text-white">{t('profile.listings')}</h3>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {myProducts.map(product => (
                <div key={product.id} className="flex items-center gap-4 p-3 bg-gray-900/50 rounded-lg">
                  <img src={product.image} alt={product.title} className="w-12 h-12 rounded-lg object-cover" />
                  <div className="flex-1 min-w-0">
                    <p className="text-white text-sm font-medium truncate">{product.title}</p>
                    <p className="text-gray-500 text-xs">{product.reviews} sales</p>
                  </div>
                  <Badge className="bg-green-500/20 text-green-400">Active</Badge>
                  <span className="text-amber-400 font-bold">{product.price} π</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  );
}