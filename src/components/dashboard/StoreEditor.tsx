import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Search, 
  Filter, 
  ChevronDown,
  Edit,
  Save,
  ImagePlus,
  Upload,
  Plus,
  X
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';

// Using the same mock data as StorePage
const products = [
  {
    id: '1',
    name: 'Premium Soya Milk',
    price: 120,
    image: 'https://images.unsplash.com/photo-1600788907416-456578634209?auto=format&fit=crop&q=80&w=1000',
    category: 'Beverages',
    rating: 4.8,
    reviews: 128,
    stock: 50,
    tags: ['Best Seller', 'Organic'],
  },
  // Add more products...
];

const categories = ['All', 'Beverages', 'Food', 'Supplements', 'Health & Wellness'];

const defaultBanners = [
  'https://images.unsplash.com/photo-1615485290382-441e4d049cb5?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1622484211148-77e86a2b98ce?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1516211697506-8360dbcfe9a4?auto=format&fit=crop&q=80&w=2000',
  'https://images.unsplash.com/photo-1613843433065-819a04a47a09?auto=format&fit=crop&q=80&w=2000'
];

export function StoreEditor() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUserStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [storeName, setStoreName] = useState(currentUser?.stationName || '');
  const [storeDescription, setStoreDescription] = useState('Discover our premium selection of natural and healthy soya products');
  const [bannerImage, setBannerImage] = useState(defaultBanners[0]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [isBannerDialogOpen, setIsBannerDialogOpen] = useState(false);
  const [selectedBanner, setSelectedBanner] = useState(bannerImage);

  const handleSave = () => {
    setIsEditing(false);
    toast({
      title: "Changes saved",
      description: "Your store has been updated successfully.",
    });
  };

  const handleBannerUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedBanner(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBannerSelect = (banner: string) => {
    setSelectedBanner(banner);
  };

  const handleBannerConfirm = () => {
    setBannerImage(selectedBanner);
    setIsBannerDialogOpen(false);
    toast({
      title: "Banner updated",
      description: "Your store banner has been updated successfully.",
    });
  };

  return (
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} className="gap-2">
              <Save className="h-4 w-4" />
              Save Changes
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="gap-2">
            <Edit className="h-4 w-4" />
            Edit Store
          </Button>
        )}
      </div>

      {/* Hero Section - Matches StorePage exactly */}
      <section className="relative h-[300px] -mx-4">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/90 to-primary/70">
          <img
            src={bannerImage}
            alt="Store Banner"
            className="w-full h-full object-cover mix-blend-overlay"
          />
          {isEditing && (
            <Button
              variant="secondary"
              className="absolute bottom-4 right-4 gap-2"
              onClick={() => setIsBannerDialogOpen(true)}
            >
              <ImagePlus className="h-4 w-4" />
              Change Banner
            </Button>
          )}
        </div>
        <div className="relative h-full container mx-auto flex flex-col items-center justify-center text-white text-center px-4">
          {isEditing ? (
            <div className="space-y-4 w-full max-w-2xl">
              <Input
                value={storeName}
                onChange={(e) => setStoreName(e.target.value)}
                className="text-4xl font-bold text-center bg-transparent border-white/20 text-white placeholder:text-white/60"
                placeholder="Enter Store Name"
              />
              <Textarea
                value={storeDescription}
                onChange={(e) => setStoreDescription(e.target.value)}
                className="text-lg bg-transparent border-white/20 text-white placeholder:text-white/60 resize-none"
                placeholder="Enter store description"
              />
            </div>
          ) : (
            <>
              <h1 className="text-4xl md:text-5xl font-bold mb-4">
                Welcome to {storeName} Store
              </h1>
              <p className="text-lg md:text-xl max-w-2xl">
                {storeDescription}
              </p>
            </>
          )}
        </div>
      </section>

      {/* Banner Selection Dialog */}
      <Dialog open={isBannerDialogOpen} onOpenChange={setIsBannerDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Change Store Banner</DialogTitle>
            <DialogDescription>
              Choose from our collection or upload your own banner image
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Upload Section */}
            <div className="flex items-center gap-4">
              <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                accept="image/*"
                onChange={handleBannerUpload}
              />
              <Button 
                variant="outline" 
                onClick={() => fileInputRef.current?.click()}
                className="gap-2"
              >
                <Upload className="h-4 w-4" />
                Upload Image
              </Button>
              <p className="text-sm text-muted-foreground">
                Recommended size: 2000x600 pixels
              </p>
            </div>

            {/* Default Banners Grid */}
            <div className="grid grid-cols-2 gap-4">
              {defaultBanners.map((banner, index) => (
                <div
                  key={index}
                  className={cn(
                    "relative aspect-[3/1] cursor-pointer overflow-hidden rounded-lg border-2",
                    selectedBanner === banner ? "border-primary" : "border-transparent"
                  )}
                  onClick={() => handleBannerSelect(banner)}
                >
                  <img
                    src={banner}
                    alt={`Banner option ${index + 1}`}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                  {selectedBanner === banner && (
                    <div className="absolute inset-0 bg-primary/20" />
                  )}
                </div>
              ))}
            </div>

            {/* Preview */}
            {selectedBanner && (
              <div className="space-y-2">
                <h3 className="font-medium">Preview</h3>
                <div className="relative aspect-[3/1] rounded-lg overflow-hidden">
                  <img
                    src={selectedBanner}
                    alt="Banner preview"
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
                onClick={() => setIsBannerDialogOpen(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleBannerConfirm}
                disabled={!selectedBanner}
              >
                Apply Banner
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Search and Filters - Matches StorePage exactly */}
      <div className="flex flex-col md:flex-row gap-4 items-center">
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
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-[180px]">
              <ChevronDown className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="popular">Most Popular</SelectItem>
              <SelectItem value="newest">Newest</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Product Grid - Matches StorePage with edit controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {/* Add New Product Card - Only shown in edit mode */}
        {isEditing && (
          <Card 
            className="group cursor-pointer hover:shadow-lg transition-all duration-200 flex flex-col items-center justify-center aspect-square"
            onClick={() => navigate('/dashboard/store')}
          >
            <div className="p-8 text-center">
              <div className="h-12 w-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Plus className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Add New Product</h3>
              <p className="text-sm text-muted-foreground">
                Click to add a new product to your store
              </p>
            </div>
          </Card>
        )}

        {/* Product Cards - Match StorePage exactly with edit overlay */}
        {products.map((product) => (
          <Card 
            key={product.id}
            className="group cursor-pointer hover:shadow-lg transition-all duration-200"
          >
            <div className="relative overflow-hidden">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-200"
              />
              <div className="absolute top-2 left-2 flex gap-2">
                {product.tags.map((tag) => (
                  <Badge 
                    key={tag}
                    variant="secondary"
                    className={cn(
                      "bg-white/90 backdrop-blur-sm",
                      tag === 'Best Seller' && "text-orange-600",
                      tag === 'Organic' && "text-green-600"
                    )}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
              {isEditing && (
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <Button
                    variant="secondary"
                    onClick={() => navigate('/dashboard/store')}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Product
                  </Button>
                </div>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">
                {product.name}
              </h3>
              <div className="flex items-center justify-between mt-2">
                <p className="text-lg font-bold">₱{product.price}</p>
                <div className="flex items-center gap-1 text-sm text-muted-foreground">
                  <span>⭐ {product.rating}</span>
                  <span>({product.reviews})</span>
                </div>
              </div>
              <div className="mt-4">
                <Button 
                  className="w-full group-hover:bg-primary/90"
                  onClick={() => {
                    if (isEditing) {
                      navigate('/dashboard/store');
                    } else {
                      navigate(`/store/product/${product.id}`);
                    }
                  }}
                >
                  {isEditing ? 'Edit Product' : 'View Details'}
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}