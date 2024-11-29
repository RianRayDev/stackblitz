import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShoppingBag, 
  Calendar,
  Package2,
  ArrowRight,
  Store
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useStore, useCustomerStore, useUserStore } from '@/lib/store';
import { formatDistanceToNow } from 'date-fns';

export function CustomerDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();
  const { purchases, loadPurchases } = useCustomerStore();
  const { products } = useStore();

  useEffect(() => {
    if (currentUser) {
      loadPurchases(currentUser.id).catch(console.error);
    }
  }, [currentUser, loadPurchases]);

  const getProduct = (productId: string) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
        <p className="text-muted-foreground">
          View your recent purchases and order history
        </p>
      </div>

      {/* Quick Stats */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Purchases
            </CardTitle>
            <ShoppingBag className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{purchases.length}</div>
            <p className="text-xs text-muted-foreground">
              Lifetime orders
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Recent Orders
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {purchases.filter(p => {
                const date = new Date(p.purchaseDate.seconds * 1000);
                const daysDiff = (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
                return daysDiff <= 30;
              }).length}
            </div>
            <p className="text-xs text-muted-foreground">
              In the last 30 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">
              Total Spent
            </CardTitle>
            <Package2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ₱{purchases.reduce((total, p) => total + p.totalPrice, 0).toLocaleString()}
            </div>
            <p className="text-xs text-muted-foreground">
              Lifetime spending
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Recent Purchases */}
      <Card>
        <CardHeader className="flex items-center justify-between">
          <CardTitle>Recent Purchases</CardTitle>
          <Button variant="outline" onClick={() => navigate('/store')}>
            <Store className="h-4 w-4 mr-2" />
            Browse Store
          </Button>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-4">
              {purchases.length > 0 ? (
                purchases.map((purchase) => {
                  const product = getProduct(purchase.productId);
                  if (!product) return null;

                  return (
                    <div 
                      key={purchase.id}
                      className="flex items-center justify-between p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="w-16 h-16 rounded-md object-cover"
                        />
                        <div>
                          <h3 className="font-semibold">{product.name}</h3>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <span>Qty: {purchase.quantity}</span>
                            <span>Total: ₱{purchase.totalPrice.toLocaleString()}</span>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(purchase.purchaseDate.seconds * 1000), { addSuffix: true })}
                          </p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="ml-auto"
                        onClick={() => navigate(`/store/product/${product.id}`)}
                      >
                        View Product
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    </div>
                  );
                })
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <ShoppingBag className="h-12 w-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No purchases yet</p>
                  <p className="text-sm">Start shopping to see your purchase history here</p>
                  <Button 
                    variant="outline" 
                    className="mt-4"
                    onClick={() => navigate('/store')}
                  >
                    Browse Products
                  </Button>
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
}