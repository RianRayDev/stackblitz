import { useNavigate } from 'react-router-dom';
import { Store, MessageSquare, Package2, Activity, ExternalLink, Edit, Link } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from '@/lib/utils';

export function StoreDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();

  const handleStoreView = () => {
    if (currentUser?.franchiseName) {
      navigate(`/${currentUser.franchiseName}/store`);
    }
  };

  const handleStoreEdit = () => {
    navigate('/dashboard/store/edit');
  };

  const handlePublicStore = () => {
    if (currentUser?.franchiseName) {
      window.open(`/${currentUser.franchiseName}/store`, '_blank');
    }
  };

  const handleManageStore = () => {
    navigate('/dashboard/store');
  };

  const handleSocialFeed = () => {
    navigate('/dashboard/social');
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.franchiseName}
          </h1>
          <p className="text-muted-foreground">
            Here's what's happening with your store today
          </p>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button className="bg-primary/10 text-primary hover:bg-primary/20 gap-2">
              <Store className="h-4 w-4" />
              Store Options
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem onClick={handleStoreView}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Store
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStoreEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Store
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handlePublicStore}>
              <Link className="h-4 w-4 mr-2" />
              Public Store Link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className={cn(
            "relative overflow-hidden border-primary/50 cursor-pointer",
            "hover:shadow-lg hover:border-primary transition-all duration-200",
            "group"
          )}
          onClick={handleManageStore}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent group-hover:from-primary/20 group-hover:via-primary/10 transition-colors" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Store className="h-5 w-5 text-primary" />
              Store Management
            </CardTitle>
            <CardDescription>
              Manage your products, inventory, and store settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2 p-4 rounded-lg bg-background/80">
                  <Package2 className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold">Inventory</h3>
                  <p className="text-sm text-muted-foreground">156 products</p>
                </div>
                <div className="flex flex-col gap-2 p-4 rounded-lg bg-background/80">
                  <Activity className="h-5 w-5 text-orange-500" />
                  <h3 className="font-semibold">Orders</h3>
                  <p className="text-sm text-muted-foreground">12 pending</p>
                </div>
              </div>
              <Button 
                className="w-full group-hover:bg-primary/90 transition-colors"
              >
                Manage Store
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card 
          className="relative overflow-hidden border-blue-500/50 cursor-pointer hover:shadow-lg hover:border-blue-500 transition-all duration-200 group"
          onClick={handleSocialFeed}
        >
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent group-hover:from-blue-500/20 group-hover:via-blue-500/10 transition-colors" />
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-blue-500" />
              Social Feed
            </CardTitle>
            <CardDescription>
              Connect and interact with other franchises
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="p-4 rounded-lg bg-background/80">
                <p className="text-sm text-muted-foreground">
                  Share updates, news, and collaborate with other franchises in the network. Stay connected with the SNULI community.
                </p>
              </div>
              <Button 
                className="w-full bg-blue-500 hover:bg-blue-600 group-hover:bg-blue-600 transition-colors"
              >
                View Social Feed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
          <CardDescription>
            Latest updates from your store
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { text: "New order #1234 received from Reseller A", time: "2 minutes ago" },
              { text: "Inventory updated for Product SKU-789", time: "1 hour ago" },
              { text: "Shipment dispatched to Reseller B", time: "3 hours ago" },
              { text: "Low stock alert for Product SKU-456", time: "5 hours ago" }
            ].map((activity, index) => (
              <div key={index} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-4">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                  <p>{activity.text}</p>
                </div>
                <span className="text-muted-foreground">{activity.time}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}