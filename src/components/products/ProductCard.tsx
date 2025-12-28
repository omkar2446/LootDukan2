import { Product } from '@/types/product';
import { ExternalLink, TrendingUp, Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';

interface ProductCardProps {
  product: Product;
}

const storeLogos: Record<string, string> = {
  'Amazon': '🛒',
  'Flipkart': '🛍️',
  'Myntra': '📦',
  'Ajio': '👔',
  'Meesho': '🎁',
};

export function ProductCard({ product }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  return (
    <Card className="group relative overflow-hidden border-0 shadow-card hover:shadow-soft transition-all duration-300 hover:-translate-y-1">
      {/* Discount Badge */}
      <div className="absolute top-3 left-3 z-10">
        <Badge className="gradient-secondary text-secondary-foreground font-bold shadow-lg">
          {Math.round(product.discount_percent)}% OFF
        </Badge>
      </div>

      {/* Featured/Trending Badges */}
      {product.is_trending && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className="bg-card/90 backdrop-blur-sm border-primary text-primary">
            <TrendingUp className="h-3 w-3 mr-1" />
            Trending
          </Badge>
        </div>
      )}
      
      {product.is_featured && !product.is_trending && (
        <div className="absolute top-3 right-3 z-10">
          <Badge variant="outline" className="bg-card/90 backdrop-blur-sm border-warning text-warning">
            <Star className="h-3 w-3 mr-1" />
            Featured
          </Badge>
        </div>
      )}

      {/* Image */}
      <div className="relative aspect-square overflow-hidden bg-muted">
        <img
          src={product.image_url}
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
      </div>

      <CardContent className="p-4 space-y-3">
        {/* Store */}
        <div className="flex items-center gap-2">
          <span className="text-lg">{storeLogos[product.store_name] || '🏪'}</span>
          <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
            {product.store_name}
          </span>
        </div>

        {/* Product Name */}
        <h3 className="font-medium text-foreground line-clamp-2 min-h-[2.5rem] group-hover:text-primary transition-colors">
          {product.name}
        </h3>

        {/* Price */}
        <div className="flex items-baseline gap-2">
          <span className="text-xl font-bold text-foreground">
            {formatPrice(product.discounted_price)}
          </span>
          <span className="text-sm text-muted-foreground line-through">
            {formatPrice(product.original_price)}
          </span>
        </div>

        {/* Savings */}
        <p className="text-xs text-success font-medium">
          You save {formatPrice(product.original_price - product.discounted_price)}
        </p>

        {/* Buy Button */}
        <Button 
          className="w-full gradient-primary hover:opacity-90 transition-opacity gap-2 shadow-lg"
          asChild
        >
          <a href={product.affiliate_link} target="_blank" rel="noopener noreferrer">
            Buy Now
            <ExternalLink className="h-4 w-4" />
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
