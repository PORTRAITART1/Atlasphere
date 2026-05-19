import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Search, Shield, Zap, Users, TrendingUp, ArrowRight } from 'lucide-react';

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const featuredProducts = PRODUCTS.slice(0, 4);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 via-gray-950 to-amber-900/20" />
        <div className="absolute inset-0">
          <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }} />
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
          <div className="text-center max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 bg-purple-500/10 border border-purple-500/30 rounded-full px-4 py-1.5 mb-6">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span className="text-purple-300 text-sm">Pi Network Mainnet Live</span>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold text-white mb-6 leading-tight">
              {t('hero.title')}{' '}
              <span className="bg-gradient-to-r from-purple-400 to-amber-400 bg-clip-text text-transparent">
                for Pioneers
              </span>
            </h1>
            <p className="text-lg text-gray-400 mb-8 max-w-2xl mx-auto">
              {t('hero.subtitle')}
            </p>

            {/* Search Bar */}
            <div className="flex gap-2 max-w-lg mx-auto mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder={t('search.placeholder')}
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  className="pl-10 bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-500 focus:border-purple-400"
                />
              </div>
              <Button className="bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-500 hover:to-purple-600 text-white">
                <Search className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/marketplace">
                <Button size="lg" className="bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-semibold px-8">
                  {t('hero.cta')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
              <Link to="/seller">
                <Button size="lg" variant="outline" className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10 hover:text-white px-8">
                  {t('hero.secondary')}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Stats */}
      <section className="border-y border-purple-500/20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {[
              { label: t('stats.pioneers'), value: '47,000+', icon: Users },
              { label: t('stats.transactions'), value: '125,000+', icon: TrendingUp },
              { label: t('stats.products'), value: '8,500+', icon: Zap },
              { label: t('stats.volume'), value: '2.4M π', icon: Shield },
            ].map((stat, i) => (
              <div key={i} className="text-center">
                <stat.icon className="h-6 w-6 text-purple-400 mx-auto mb-2" />
                <div className="text-2xl md:text-3xl font-bold text-white">{stat.value}</div>
                <div className="text-gray-400 text-sm mt-1">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl font-bold text-white mb-8">{t('categories.all')}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              title: t('categories.digital'),
              image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bbbpyaagpq/category-digital-goods.png',
              count: '3,200+ items',
              color: 'from-blue-600/20 to-purple-600/20',
            },
            {
              title: t('categories.physical'),
              image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bcnqaaagqa/category-physical-goods.png',
              count: '2,800+ items',
              color: 'from-green-600/20 to-teal-600/20',
            },
            {
              title: t('categories.services'),
              image: 'https://mgx-backend-cdn.metadl.com/generate/images/317314/2026-05-18/o2bbvliaagpa/category-services-freelance.png',
              count: '2,500+ items',
              color: 'from-purple-600/20 to-pink-600/20',
            },
          ].map((cat, i) => (
            <Link to={`/marketplace?category=${['digital', 'physical', 'services'][i]}`} key={i}>
              <div className={`relative rounded-xl overflow-hidden group cursor-pointer border border-purple-500/20 hover:border-purple-500/50 transition-all`}>
                <img src={cat.image} alt={cat.title} className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-500" />
                <div className={`absolute inset-0 bg-gradient-to-t ${cat.color} to-gray-900/80`} />
                <div className="absolute bottom-4 left-4">
                  <h3 className="text-white font-bold text-lg">{cat.title}</h3>
                  <p className="text-gray-300 text-sm">{cat.count}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl font-bold text-white">Featured Products</h2>
          <Link to="/marketplace">
            <Button variant="ghost" className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10">
              View All <ArrowRight className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="bg-gray-900/50 border-y border-purple-500/20 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-white text-center mb-12">How It Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { step: '1', title: 'Connect', desc: 'Authenticate with your Pi Network account to access the marketplace.', icon: Users },
              { step: '2', title: 'Browse & Buy', desc: 'Explore products and services from verified Pioneers worldwide.', icon: Search },
              { step: '3', title: 'Pay with Pi', desc: 'Complete transactions securely using Pi cryptocurrency.', icon: Shield },
            ].map((item, i) => (
              <div key={i} className="text-center p-6">
                <div className="w-14 h-14 rounded-full bg-gradient-to-br from-purple-500 to-amber-400 flex items-center justify-center mx-auto mb-4">
                  <item.icon className="h-6 w-6 text-white" />
                </div>
                <h3 className="text-white font-semibold text-lg mb-2">{item.title}</h3>
                <p className="text-gray-400 text-sm">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}