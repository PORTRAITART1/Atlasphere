import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import ProductCard from '@/components/ProductCard';
import { PRODUCTS } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Search, SlidersHorizontal } from 'lucide-react';

export default function MarketplacePage() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState(initialCategory);
  const [sortBy, setSortBy] = useState('popular');

  const filteredProducts = useMemo(() => {
    let results = PRODUCTS;

    if (category !== 'all') {
      results = results.filter(p => p.category === category);
    }

    if (search) {
      const q = search.toLowerCase();
      results = results.filter(
        p =>
          p.title.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.tags.some(tag => tag.includes(q))
      );
    }

    switch (sortBy) {
      case 'price-low':
        results = [...results].sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        results = [...results].sort((a, b) => b.price - a.price);
        break;
      case 'rating':
        results = [...results].sort((a, b) => b.rating - a.rating);
        break;
      default:
        results = [...results].sort((a, b) => b.reviews - a.reviews);
    }

    return results;
  }, [search, category, sortBy]);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">{t('nav.marketplace')}</h1>
          <p className="text-gray-400">Discover products and services from Pioneers around the world</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-4 mb-8 p-4 bg-gray-900/50 rounded-xl border border-purple-500/20">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder={t('search.placeholder')}
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="pl-10 bg-gray-800/50 border-purple-500/30 text-white placeholder:text-gray-500"
            />
          </div>
          <Select value={category} onValueChange={setCategory}>
            <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-purple-500/30 text-white">
              <SlidersHorizontal className="h-4 w-4 mr-2 text-gray-400" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-purple-500/30">
              <SelectItem value="all" className="text-gray-200">{t('categories.all')}</SelectItem>
              <SelectItem value="digital" className="text-gray-200">{t('categories.digital')}</SelectItem>
              <SelectItem value="physical" className="text-gray-200">{t('categories.physical')}</SelectItem>
              <SelectItem value="services" className="text-gray-200">{t('categories.services')}</SelectItem>
            </SelectContent>
          </Select>
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-full md:w-48 bg-gray-800/50 border-purple-500/30 text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="bg-gray-800 border-purple-500/30">
              <SelectItem value="popular" className="text-gray-200">Most Popular</SelectItem>
              <SelectItem value="rating" className="text-gray-200">Highest Rated</SelectItem>
              <SelectItem value="price-low" className="text-gray-200">Price: Low to High</SelectItem>
              <SelectItem value="price-high" className="text-gray-200">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Results */}
        <div className="flex items-center justify-between mb-4">
          <p className="text-gray-400 text-sm">{filteredProducts.length} products found</p>
          <div className="flex gap-2">
            {category !== 'all' && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setCategory('all')}
                className="text-purple-400 hover:text-purple-300 hover:bg-purple-500/10"
              >
                Clear filters ×
              </Button>
            )}
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <p className="text-gray-400 text-lg">No products found matching your criteria</p>
            <Button
              variant="ghost"
              className="mt-4 text-purple-400 hover:text-purple-300"
              onClick={() => { setSearch(''); setCategory('all'); }}
            >
              Clear all filters
            </Button>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}