import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Grid,
  List,
  Star,
  Package,
  Shield,
  Clock,
  CheckCircle,
  ShoppingCart,
  Plus,
  Minus,
  Sparkles
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useStore } from '@/lib/store';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';

const categories = ['All', 'Beverages', 'Food', 'Supplements', 'Health & Wellness'];

export function StorePage() {
  const { franchiseName } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { products, loadProducts, setFeaturedProduct } = useStore();
  
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const initializeStore = async () => {
      await loadProducts();
      // Set first product as featured if none is featured
      if (products.length > 0 && !products.some(p => p.isFeatured)) {
        try {
          await setFeaturedProduct(products[0].id);
        } catch (error) {
          console.error('Failed to set default featured product:', error);
        }
      }
    };

    initializeStore();
  }, [loadProducts, products, setFeaturedProduct]);

  const handleQuantityChange = (delta: number) => {
    const newQuantity = quantity + delta;
    if (newQuantity >= 1 && newQuantity <= 100) {
      setQuantity(newQuantity);
    }
  };

  const handleSetFeatured = async (productId: string) => {
    try {
      await setFeaturedProduct(productId);
      toast({
        title: "Featured Product Updated",
        description: "The featured product has been updated successfully.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured product.",
        variant: "destructive",
      });
    }
  };

  const featuredProduct = products.find(p => p.isFeatured);
  
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative h-[300px] md:h-[400px] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-600/90 to-blue-800/90">
          <img
            src="https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=2000"
            alt="Store Banner"
            className="w-full h-full object-cover mix-blend-overlay"
          />
        </div>
        <div className="relative h-full container mx-auto flex flex-col items-center justify-center text-white text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold mb-6 tracking-tight">
            Welcome to {franchiseName}
          </h1>
          <p className="text-lg md:text-xl max-w-2xl text-white/90">
            Your trusted source for premium SNULI Soy products
          </p>
        </div>
      </section>

      {/* Featured Product */}
      {featuredProduct && (
        <div className="container mx-auto px-4 -mt-20 relative z-10">
          <Card className="bg-gradient-to-br from-blue-50 to-white border-blue-100 overflow-hidden">
            <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-blue-100/50 to-transparent" />
            <div className="flex flex-col md:flex-row gap-8 p-8 relative">
              <div className="md:w-1/3">
                <div className="relative aspect-square rounded-2xl overflow-hidden shadow-2xl transform transition-transform hover:scale-105">
                  <img
                    src={featuredProduct.image}
                    alt={featuredProduct.name}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-blue-500 text-white hover:bg-blue-600 uppercase tracking-wider text-xs font-semibold px-3 py-1">
                      Featured Product
                    </Badge>
                  </div>
                </div>
              </div>
              <div className="md:w-2/3 space-y-6">
                <div>
                  <h2 className="text-3xl font-bold text-blue-900 mb-2">
                    {featuredProduct.name}
                  </h2>
                  <p className="text-blue-600 text-lg mb-6">
                    {featuredProduct.description}
                  </p>
                  <div className="grid sm:grid-cols-2 gap-6">
                    {featuredProduct.features?.map((feature, index) => (
                      <div key={index} className="flex items-center gap-3 bg-white/50 p-4 rounded-xl">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <Package className="h-5 w-5 text-blue-500" />
                        </div>
                        <div>
                          <span className="block font-semibold">{feature}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-4 pt-4">
                  <div>
                    <p className="text-4xl font-bold text-blue-900">₱{(featuredProduct.price * quantity).toLocaleString()}</p>
                    <p className="text-green-600 font-medium">₱{featuredProduct.price.toLocaleString()} per case</p>
                  </div>
                  <div className="flex items-center gap-4 ml-auto">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(-1)}
                        disabled={quantity <= 1}
                      >
                        <Minus className="h-4 w-4" />
                      </Button>
                      <span className="w-12 text-center font-semibold">{quantity}</span>
                      <Button
                        variant="outline"
                        size="icon"
                        onClick={() => handleQuantityChange(1)}
                        disabled={quantity >= 100}
                      >
                        <Plus className="h-4 w-4" />
                      </Button>
                    </div>
                    <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                      <ShoppingCart className="h-5 w-5 mr-2" />
                      Buy Now
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </div>
      )}

      {/* Product Catalog */}
      <div className="container mx-auto px-4 py-16">
        <h2 className="text-3xl font-bold mb-8">Our Products</h2>
        
        <div className="flex flex-col md:flex-row gap-4 items-center mb-8">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <div className="flex gap-4 w-full md:w-auto">
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-[180px]">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('grid')}
              >
                <Grid className="h-4 w-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'outline'}
                size="icon"
                onClick={() => setViewMode('list')}
              >
                <List className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        <div className={cn(
          "grid gap-6",
          viewMode === 'grid' ? "grid-cols-1 md:grid-cols-3 lg:grid-cols-4" : "grid-cols-1"
        )}>
          {filteredProducts.map((product) => (
            <Card 
              key={product.id}
              className={cn(
                "group cursor-pointer hover:shadow-lg transition-all duration-200",
                viewMode === 'list' && "flex"
              )}
            >
              <div className={cn(
                "relative overflow-hidden",
                viewMode === 'list' && "w-48"
              )}>
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
                />
                <div className="absolute top-2 left-2 flex gap-2">
                  {product.isFeatured && (
                    <Badge className="bg-blue-500 text-white">Featured</Badge>
                  )}
                  {product.tags.map((tag) => (
                    <Badge 
                      key={tag}
                      variant="secondary"
                      className={cn(
                        "bg-white/90 backdrop-blur-sm",
                        tag === 'Best Seller' && "text-orange-600",
                        tag === 'Wholesale' && "text-blue-600"
                      )}
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
              <div className={cn(
                "p-4",
                viewMode === 'list' && "flex-1"
              )}>
                <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                  {product.name}
                </h3>
                <div className="flex items-center justify-between mt-2">
                  <p className="text-lg font-bold">₱{product.price.toLocaleString()}</p>
                  <div className="flex items-center gap-1 text-sm text-muted-foreground">
                    <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    <span>{product.rating}</span>
                    <span>({product.reviews})</span>
                  </div>
                </div>
                {viewMode === 'list' && (
                  <p className="mt-2 text-muted-foreground">
                    {product.description}
                  </p>
                )}
                <div className="mt-4 flex gap-2">
                  <Button className="flex-1">
                    <ShoppingCart className="mr-2 h-4 w-4" />
                    Add to Cart
                  </Button>
                  {!product.isFeatured && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleSetFeatured(product.id)}
                      className="hover:bg-blue-50 hover:text-blue-600"
                    >
                      <Sparkles className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}