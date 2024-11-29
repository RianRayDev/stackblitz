import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Star, 
  Truck, 
  Shield, 
  Package, 
  MessageCircle,
  ChevronRight,
  MinusCircle,
  PlusCircle,
  ShoppingCart,
  Heart,
  Share,
  Check
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { useStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';

export function ProductPage() {
  const navigate = useNavigate();
  const { productId } = useParams();
  const { products } = useStore();
  const { toast } = useToast();
  const [selectedImage, setSelectedImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [isWishlist, setIsWishlist] = useState(false);

  const product = products.find(p => p.id === productId);

  useEffect(() => {
    if (!product) {
      navigate('/store');
      toast({
        title: "Product Not Found",
        description: "The requested product could not be found.",
        variant: "destructive"
      });
    }
  }, [product, navigate, toast]);

  if (!product) return null;

  const benefits = [
    {
      icon: Truck,
      title: 'Fast Delivery',
      description: 'Free shipping on orders above ₱1,000'
    },
    {
      icon: Shield,
      title: 'Quality Guarantee',
      description: '100% satisfaction guaranteed'
    },
    {
      icon: Package,
      title: 'Secure Packaging',
      description: 'Professional packaging for safety'
    }
  ];

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    toast({
      title: "Added to Cart",
      description: `${quantity} ${quantity > 1 ? 'items' : 'item'} added to your cart`,
    });
  };

  const handleToggleWishlist = () => {
    setIsWishlist(!isWishlist);
    toast({
      title: isWishlist ? "Removed from Wishlist" : "Added to Wishlist",
      description: isWishlist 
        ? "Product has been removed from your wishlist" 
        : "Product has been added to your wishlist",
    });
  };

  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    toast({
      title: "Link Copied",
      description: "Product link has been copied to clipboard",
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-muted-foreground mb-8">
        <Button 
          variant="ghost" 
          size="sm" 
          className="gap-2"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Store
        </Button>
        <ChevronRight className="h-4 w-4" />
        <span>{product.category}</span>
        <ChevronRight className="h-4 w-4" />
        <span className="text-foreground">{product.name}</span>
      </div>

      <div className="grid md:grid-cols-2 gap-8 mb-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square overflow-hidden rounded-lg border bg-white">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="flex gap-4">
            {[product.image].map((image, index) => (
              <button
                key={index}
                onClick={() => setSelectedImage(index)}
                className={cn(
                  "relative aspect-square w-20 overflow-hidden rounded-lg border bg-white",
                  selectedImage === index && "ring-2 ring-primary"
                )}
              >
                <img
                  src={image}
                  alt={`${product.name} ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Product Info */}
        <div className="space-y-8">
          <div>
            <div className="flex items-start justify-between">
              <div>
                <div className="flex gap-2 mb-2">
                  {product.isFeatured && (
                    <Badge className="bg-primary text-primary-foreground">
                      Featured
                    </Badge>
                  )}
                  {product.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className={cn(
                        tag === 'Best Seller' && "bg-orange-100 text-orange-700",
                        tag === 'Organic' && "bg-green-100 text-green-700"
                      )}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
                <h1 className="text-3xl font-bold">{product.name}</h1>
                <div className="flex items-center gap-4 mt-2">
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={cn(
                          "h-5 w-5",
                          i < Math.floor(product.rating)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-200"
                        )}
                      />
                    ))}
                    <span className="ml-2 text-sm text-muted-foreground">
                      ({product.reviews} reviews)
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold">₱{product.price.toLocaleString()}</p>
                <p className="text-sm text-muted-foreground">
                  {product.stock} units available
                </p>
              </div>
            </div>

            <p className="mt-4 text-muted-foreground">
              {product.description}
            </p>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mt-8">
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <MinusCircle className="h-4 w-4" />
              </Button>
              <span className="text-lg font-medium w-12 text-center">
                {quantity}
              </span>
              <Button
                variant="outline"
                size="icon"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stock}
              >
                <PlusCircle className="h-4 w-4" />
              </Button>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 mt-8">
              <Button 
                size="lg" 
                className="flex-1 text-lg"
                onClick={handleAddToCart}
              >
                <ShoppingCart className="mr-2 h-5 w-5" />
                Add to Cart - ₱{(product.price * quantity).toLocaleString()}
              </Button>
              <Button
                variant="outline"
                size="lg"
                className={cn(
                  "transition-colors",
                  isWishlist && "bg-pink-50 text-pink-600 border-pink-200"
                )}
                onClick={handleToggleWishlist}
              >
                <Heart className={cn(
                  "h-5 w-5",
                  isWishlist && "fill-pink-600"
                )} />
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={handleShare}
              >
                <Share className="h-5 w-5" />
              </Button>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-3 gap-4">
            {benefits.map((benefit) => (
              <Card key={benefit.title} className="p-4 text-center">
                <benefit.icon className="h-6 w-6 mx-auto mb-2 text-primary" />
                <h3 className="font-medium">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {benefit.description}
                </p>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <Tabs defaultValue="features" className="mt-12">
        <TabsList className="w-full justify-start">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="specifications">Specifications</TabsTrigger>
          <TabsTrigger value="reviews">
            Reviews
            <Badge variant="secondary" className="ml-2">
              {product.reviews}
            </Badge>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="features" className="mt-6">
          <ul className="grid md:grid-cols-2 gap-4">
            {product.features?.map((feature, index) => (
              <li key={index} className="flex items-center gap-2">
                <Check className="h-5 w-5 text-green-500" />
                {feature}
              </li>
            ))}
          </ul>
        </TabsContent>
        <TabsContent value="specifications" className="mt-6">
          <dl className="grid md:grid-cols-2 gap-4">
            <div className="flex flex-col">
              <dt className="text-sm font-medium text-muted-foreground">Category</dt>
              <dd className="text-foreground">{product.category}</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-sm font-medium text-muted-foreground">Stock</dt>
              <dd className="text-foreground">{product.stock} units</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-sm font-medium text-muted-foreground">Rating</dt>
              <dd className="text-foreground">{product.rating} out of 5</dd>
            </div>
            <div className="flex flex-col">
              <dt className="text-sm font-medium text-muted-foreground">Reviews</dt>
              <dd className="text-foreground">{product.reviews} customer reviews</dd>
            </div>
          </dl>
        </TabsContent>
        <TabsContent value="reviews" className="mt-6">
          <Card>
            <ScrollArea className="h-[400px]">
              <div className="p-4">
                Reviews will be implemented here
              </div>
            </ScrollArea>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}