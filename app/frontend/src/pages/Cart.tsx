import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { getCart, removeFromCart, getCartTotal, clearCart, getUser, subscribe as storeSubscribe } from '@/lib/store';
import { PiSDK } from '@/lib/pi-sdk';
import { t } from '@/lib/i18n';
import { Trash2, ShoppingBag, ArrowLeft } from 'lucide-react';
import { toast } from 'sonner';

export default function CartPage() {
  const [cart, setCart] = useState(getCart());
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const unsub = storeSubscribe(() => {
      setCart([...getCart()]);
    });
    return unsub;
  }, []);

  const total = getCartTotal();

  const handleCheckout = async () => {
    const user = getUser();
    if (!user) {
      toast.error('Please connect with Pi Network first');
      return;
    }
    if (cart.length === 0) return;

    setPaying(true);
    try {
      await PiSDK.createPayment(
        { amount: total, memo: `Cart purchase: ${cart.length} items` },
        {
          onReadyForServerApproval: () => toast.info(t('payment.processing')),
          onReadyForServerCompletion: () => {
            toast.success(t('payment.success'));
            clearCart();
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

  return (
    <div className="min-h-screen bg-gray-950">
      <Navbar />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Link to="/marketplace" className="inline-flex items-center gap-2 text-purple-400 hover:text-purple-300 mb-6 text-sm">
          <ArrowLeft className="h-4 w-4" />
          Continue Shopping
        </Link>

        <h1 className="text-3xl font-bold text-white mb-8">{t('cart.title')}</h1>

        {cart.length === 0 ? (
          <div className="text-center py-16">
            <ShoppingBag className="h-16 w-16 text-gray-600 mx-auto mb-4" />
            <p className="text-gray-400 text-lg mb-4">{t('cart.empty')}</p>
            <Link to="/marketplace">
              <Button className="bg-purple-600 hover:bg-purple-500 text-white">
                {t('hero.cta')}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {cart.map(item => (
              <div key={item.product.id} className="flex items-center gap-4 bg-gray-800/50 rounded-lg p-4 border border-purple-500/20">
                <img src={item.product.image} alt={item.product.title} className="w-20 h-20 object-cover rounded-lg" />
                <div className="flex-1 min-w-0">
                  <h3 className="text-white font-medium truncate">{item.product.title}</h3>
                  <p className="text-gray-400 text-sm">{t('product.seller')}: {item.product.seller}</p>
                  <p className="text-gray-500 text-sm">Qty: {item.quantity}</p>
                </div>
                <div className="text-right">
                  <p className="text-amber-400 font-bold">{item.product.price * item.quantity} π</p>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFromCart(item.product.id)}
                    className="text-red-400 hover:text-red-300 hover:bg-red-500/10 mt-1"
                  >
                    <Trash2 className="h-4 w-4 mr-1" />
                    {t('cart.remove')}
                  </Button>
                </div>
              </div>
            ))}

            {/* Summary */}
            <div className="bg-gray-900/50 rounded-xl p-6 border border-purple-500/20 mt-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-gray-400">{t('cart.total')}</span>
                <span className="text-2xl font-bold text-amber-400">{total} π</span>
              </div>
              <Button
                onClick={handleCheckout}
                disabled={paying}
                className="w-full bg-gradient-to-r from-purple-600 to-amber-500 hover:from-purple-500 hover:to-amber-400 text-white font-semibold h-12"
              >
                {paying ? t('payment.processing') : t('cart.checkout')}
              </Button>
              <p className="text-gray-500 text-xs text-center mt-3">
                Secured by Pi Network blockchain
              </p>
            </div>
          </div>
        )}
      </div>

      <Footer />
    </div>
  );
}