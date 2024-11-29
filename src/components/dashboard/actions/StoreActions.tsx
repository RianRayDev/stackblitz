import { Store, Package2, Activity, MessageSquare, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface StoreActionsProps {
  onManageStore: () => void;
  onSocialFeed: () => void;
}

export function StoreActions({ onManageStore, onSocialFeed }: StoreActionsProps) {
  return (
    <div className="grid md:grid-cols-2 gap-6">
      <Card 
        className={cn(
          "relative overflow-hidden border-primary/50 cursor-pointer",
          "hover:shadow-lg hover:border-primary transition-all duration-200",
          "group"
        )}
        onClick={onManageStore}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent group-hover:from-primary/20 group-hover:via-primary/10 transition-colors" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Store className="h-5 w-5 text-primary" />
            Store Management
          </CardTitle>
          <CardDescription>
            Manage your inventory, orders, and store settings
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
        onClick={onSocialFeed}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-blue-500/5 to-transparent group-hover:from-blue-500/20 group-hover:via-blue-500/10 transition-colors" />
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5 text-blue-500" />
            Social Feed
          </CardTitle>
          <CardDescription>
            Connect and interact with other stations
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 rounded-lg bg-background/80">
              <div className="flex items-center gap-4 mb-4">
                <Users className="h-5 w-5 text-blue-500" />
                <div>
                  <h3 className="font-semibold">Community Updates</h3>
                  <p className="text-sm text-muted-foreground">
                    Stay connected with other stations
                  </p>
                </div>
              </div>
              <p className="text-sm text-muted-foreground">
                Share updates, news, and collaborate with other stations in the network
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
  );
}