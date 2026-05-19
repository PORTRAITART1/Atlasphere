import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Product, addToCart } from '@/lib/store';
import { t } from '@/lib/i18n';
import { Star, ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product);
    toast.success(`${product.title} added to cart`);
  };

  const categoryColors = {
    digital: 'bg-blue-500/20 text-blue-300',
    physical: 'bg-green-500/20 text-green-300',
    services: 'bg-purple-500/20 text-purple-300',
  };

  return (
    <Link to={`/product/${product.id}`}>
      <Card className="bg-gray-800/50 border-purple-500/20 hover:border-purple-500/50 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10 overflow-hidden group">
        <div className="relative overflow-hidden">
          <img
            src={product.image}
            alt={product.title}
            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Badge className={`absolute top-3 left-3 ${categoryColors[product.category]}`}>
            {t(`categories.${product.category}`)}
          </Badge>
        </div>
        <CardContent className="p-4">
          <h3 className="text-white font-semibold text-sm line-clamp-2 mb-2 group-hover:text-purple-300 transition-colors">
            {product.title}
          </h3>
          <div className="flex items-center gap-1 mb-2">
            <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
            <span className="text-amber-400 text-xs font-medium">{product.rating}</span>
            <span className="text-gray-500 text-xs">({product.reviews} {t('product.reviews')})</span>
          </div>
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-1">
              <span className="text-amber-400 font-bold text-lg">{product.price}</span>
              <span className="text-amber-400 text-sm">{t('common.pi')}</span>
            </div>
            <Button
              size="sm"
              onClick={handleAddToCart}
              className="bg-purple-600 hover:bg-purple-500 text-white h-8 px-3"
            >
              <ShoppingCart className="h-3.5 w-3.5" />
            </Button>
          </div>
          <p className="text-gray-500 text-xs mt-2">
            {t('product.seller')}: {product.seller}
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}