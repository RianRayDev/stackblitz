import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Plus, 
  Package2, 
  Star,
  Edit,
  Trash2,
  ArrowLeft,
  Store
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useStore, useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { ProductForm } from './forms/ProductForm';

export function StoreManagement() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { currentUser } = useUserStore();
  const { products, addProduct, updateProduct, deleteProduct, setFeaturedProduct, loadProducts } = useStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  useEffect(() => {
    loadProducts(currentUser?.franchiseId).catch(error => {
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      });
    });
  }, [loadProducts, currentUser?.franchiseId, toast]);

  const handleAddProduct = async (data: any) => {
    if (!currentUser?.permissions.canAddProducts) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to add products",
        variant: "destructive"
      });
      return;
    }

    try {
      await addProduct({
        ...data,
        createdBy: currentUser.id,
        franchiseId: currentUser.franchiseId
      });
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "Product added successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to add product",
        variant: "destructive",
      });
    }
  };

  const handleEditProduct = async (data: any) => {
    if (!currentUser?.permissions.canEditProducts) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to edit products",
        variant: "destructive"
      });
      return;
    }

    if (selectedProduct) {
      try {
        await updateProduct(selectedProduct.id, data);
        setIsEditDialogOpen(false);
        setSelectedProduct(null);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to update product",
          variant: "destructive",
        });
      }
    }
  };

  const handleDeleteProduct = async () => {
    if (!currentUser?.permissions.canDeleteProducts) {
      toast({
        title: "Permission Denied",
        description: "You don't have permission to delete products",
        variant: "destructive"
      });
      return;
    }

    if (selectedProduct) {
      try {
        await deleteProduct(selectedProduct.id);
        setIsDeleteDialogOpen(false);
        setSelectedProduct(null);
        toast({
          title: "Success",
          description: "Product deleted successfully",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        });
      }
    }
  };

  const handleSetFeatured = async (product: any) => {
    try {
      await setFeaturedProduct(product.id);
      toast({
        title: "Success",
        description: "Featured product updated successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to update featured product",
        variant: "destructive",
      });
    }
  };

  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/')}
          className="gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Dashboard
        </Button>
        {currentUser?.permissions.canAddProducts && (
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        )}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold flex items-center gap-2">
            <Store className="h-6 w-6 text-primary" />
            Store Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex justify-between items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                placeholder="Search products..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredProducts.map((product) => (
              <Card 
                key={product.id}
                className="group hover:shadow-lg transition-all duration-200"
              >
                <div className="relative">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-48 object-cover rounded-t-lg"
                  />
                  <div className="absolute top-2 left-2 flex gap-2">
                    {product.isFeatured && (
                      <Badge className="bg-primary text-primary-foreground">
                        Featured
                      </Badge>
                    )}
                    {product.tags?.map((tag) => (
                      <Badge 
                        key={tag}
                        variant="secondary"
                        className="bg-white/90 backdrop-blur-sm"
                      >
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{product.name}</h3>
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="text-sm">{product.rating}</span>
                    </div>
                  </div>
                  <p className="text-muted-foreground text-sm mb-4">
                    {product.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="font-bold text-lg">₱{product.price.toLocaleString()}</p>
                    <p className="text-sm text-muted-foreground">
                      Stock: {product.stock}
                    </p>
                  </div>
                  <div className="mt-4 flex gap-2">
                    {currentUser?.permissions.canEditProducts && (
                      <Button
                        variant="outline"
                        className="flex-1"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsEditDialogOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </Button>
                    )}
                    {currentUser?.permissions.canDeleteProducts && (
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsDeleteDialogOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    )}
                    {!product.isFeatured && (
                      <Button
                        variant="secondary"
                        size="icon"
                        onClick={() => handleSetFeatured(product)}
                      >
                        <Star className="h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Product</DialogTitle>
          </DialogHeader>
          <ProductForm onSubmit={handleAddProduct} />
        </DialogContent>
      </Dialog>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
          </DialogHeader>
          <ProductForm 
            onSubmit={handleEditProduct} 
            defaultValues={selectedProduct} 
          />
        </DialogContent>
      </Dialog>

      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteProduct}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}