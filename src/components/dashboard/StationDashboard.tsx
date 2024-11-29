import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Package, 
  Users, 
  MessageSquare,
  TrendingUp,
  Clock,
  Package2,
  Store,
  ExternalLink,
  BarChart3,
  Activity,
  Edit,
  Plus
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useUserStore } from '@/lib/store';
import { cn } from '@/lib/utils';

export function StationDashboard() {
  const navigate = useNavigate();
  const { currentUser } = useUserStore();

  const handleStoreView = () => {
    if (currentUser?.stationName) {
      navigate(`/${currentUser.stationName}/store`);
    }
  };

  const handleStoreEdit = () => {
    navigate('/dashboard/store/edit');
  };

  const handleStoreManage = () => {
    navigate('/dashboard/store');
  };

  const handleSocialFeed = () => {
    navigate('/dashboard/social');
  };

  const stats = [
    {
      title: "Today's Revenue",
      value: "₱24,563",
      description: "Daily earnings from sales",
      icon: BarChart3,
      trend: "+12% from yesterday",
      color: "text-primary"
    },
    {
      title: "Active Orders",
      value: "12",
      description: "Orders being processed",
      icon: Clock,
      trend: "+2 new orders",
      color: "text-orange-500"
    },
    {
      title: "Total Products",
      value: "156",
      description: "Available in store",
      icon: Package2,
      trend: "24 low stock",
      color: "text-blue-500"
    },
    {
      title: "Monthly Sales",
      value: "₱284,742",
      description: "Revenue this month",
      icon: TrendingUp,
      trend: "+18% vs last month",
      color: "text-green-500"
    }
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Welcome back, {currentUser?.stationName}
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
              View as Customer
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleStoreEdit}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Store
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, index) => (
          <Card key={index} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-background ${stat.color}`}>
                <stat.icon className="h-4 w-4" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="flex items-center justify-between mt-1">
                <p className="text-xs text-muted-foreground">
                  {stat.description}
                </p>
                <p className={`text-xs font-medium ${stat.color}`}>
                  {stat.trend}
                </p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Actions */}
      <div className="grid md:grid-cols-2 gap-6">
        <Card 
          className={cn(
            "relative overflow-hidden border-primary/50 cursor-pointer",
            "hover:shadow-lg hover:border-primary transition-all duration-200",
            "group"
          )}
          onClick={handleStoreManage}
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
          onClick={handleSocialFeed}
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