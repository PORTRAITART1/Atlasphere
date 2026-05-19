import { useParams, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { PRODUCTS, addToCart, getUser } from '@/lib/store';
import { PiSDK } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';
import { Star, ShoppingCart, Shield, Clock, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';
import { useState } from 'react';

export default function ProductDetailPage() {
  const { id } = useParams();
  const product = PRODUCTS.find(p => p.id === id);
  const [paying, setPaying] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen bg-gray-950">
        <Navbar />
        <div className="max-w-7xl mx-auto px-4 py-16 text-center">
          <p className="text-gray-400 text-lg">Product not found</p>
          <Link to="/marketplace">
            <Button className="mt-4 bg-purple-600 hover:bg-purple-500 text-white">
              Back to Marketplace
            </Button>
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product);
    toast.success(`${product.title} added to cart`);
  };

  const handleBuyNow = async () => {
    const user = getUser();
    if (!user) {
      toast.error('Please connect with Pi Network first');
      return;
    }
    setPaying(true);
    try {
      await PiSDK.createPayment(
        { amount: product.price, memo: `Purchase: ${product.title}` },
        {
          onReadyForServerApproval: () => toast.info(t('payment.processing')),
          onReadyForServerCompletion: () => {
            toast.success(t('payment.success'));
            setPaying(false);
          },
          onCancel: () => {
            toast.info('Payment cancelled');
            setPaying(false);
          },
          onError: () => {
            toast.error(t('payment.failed'));
            setPaying(false);
          },
        }
      );
    } catch {
      toast.error(t('payment.failed'));
      setPaying(false);
    }
  };

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 3);

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Image */}
          <div className="rounded-xl overflow-hidden border border-purple-500/20">
            <img src={product.image} alt={product.title} className="w-full h-80 lg:h-96 object-cover" />
          </div>

          {/* Details */}
          <div>
            <Badge className="bg-purple-500/20 text-purple-300 mb-3">
              {t(`categories.${product.category}`)}
            </Badge>
            <h1 className="text-3xl font-bold text-white mb-4">{product.title}</h1>

            <div className="flex items-center gap-4 mb-4">
              <div className="flex items-center gap-1">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                <span className="text-amber-400 font-medium">{product.rating}</span>
                <span className="text-gray-500 text-sm">({product.reviews} {t('product.reviews')})</span>
              </div>
              <Badge variant="outline" className="border-green-500/50 text-green-400">
                {t('product.inStock')}
              </Badge>
            </div>

            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-amber-400">{product.price}</span>
              <span className="text-amber-400 text-xl">{t('common.pi')}</span>
            </div>

            <p className="text-gray-300 mb-6 leading-relaxed">{product.description}</p>

            {/* Seller info */}
            <div className="bg-gray-800/50 rounded-lg p-4 mb-6 border border-purple-500/20">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">{t('product.seller')}</p>
                  <p className="text-white font-medium">{product.seller}</p>
                </div>
                <div className="text-right">
                  <p className="text-gray-400 text-sm">{t('product.reputation')}</p>
                  <p className="text-green-400 font-medium">{product.sellerReputation}%</p>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3">
              <Button
                onClick={handleBuyNow}
                disabled={paying}
                size="lg"
                className="flex-1 bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-semibold"
              >
                {paying ? t('payment.processing') : t('product.buyNow')}
              </Button>
              <Button
                onClick={handleAddToCart}
                size="lg"
                variant="outline"
                className="border-purple-500/50 text-purple-300 hover:bg-purple-500/10"
              >
                <ShoppingCart className="h-4 w-4 mr-2" />
                {t('product.addToCart')}
              </Button>
            </div>

            {/* Trust badges */}
            <div className="flex gap-4 mt-6 pt-6 border-t border-purple-500/20">
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Shield className="h-4 w-4 text-green-400" />
                Buyer Protection
              </div>
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Clock className="h-4 w-4 text-blue-400" />
                Instant Delivery
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-xl font-bold text-white mb-6">Related Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {relatedProducts.map(p => (
                <Link key={p.id} to={`/product/${p.id}`}>
                  <div className="bg-gray-800/50 rounded-lg border border-purple-500/20 p-4 hover:border-purple-500/50 transition-all">
                    <img src={p.image} alt={p.title} className="w-full h-32 object-cover rounded-lg mb-3" />
                    <h3 className="text-white text-sm font-medium line-clamp-1">{p.title}</h3>
                    <p className="text-amber-400 font-bold mt-1">{p.price} π</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}