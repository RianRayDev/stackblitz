import { Users, MessageSquare, Activity, Store, TrendingUp, Package2, Clock, RefreshCw } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useUserStore, useFranchiseStats } from '@/lib/store';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

export function DashboardHome() {
  const navigate = useNavigate();
  const { users } = useUserStore();
  const { stats, lastRefresh, refreshStats, isLoading } = useFranchiseStats();
  const activeUsers = users.filter(user => user.isActive);

  useEffect(() => {
    refreshStats();
  }, [refreshStats]);

  const dashboardStats = [
    {
      id: 'total-franchises',
      title: "Total Franchises",
      value: stats.totalFranchises.toString(),
      description: "Active distribution points",
      icon: Store,
      trend: `${stats.onlineFranchises} online now`,
      color: "primary"
    },
    {
      id: 'total-orders',
      title: "Total Orders",
      value: "1,234",
      description: "Across all franchises",
      icon: Clock,
      trend: "+12% vs last month",
      color: "blue"
    },
    {
      id: 'total-inventory',
      title: "Total Inventory",
      value: "45,678",
      description: "Products in system",
      icon: Package2,
      trend: "+23% growth",
      color: "green"
    },
    {
      id: 'monthly-revenue',
      title: "Monthly Revenue",
      value: "₱2.1M",
      description: "All franchises combined",
      icon: TrendingUp,
      trend: "+15% vs last month",
      color: "orange"
    }
  ];

  const features = [
    {
      id: 'user-management',
      title: "User Management",
      description: "Manage franchises and system access",
      icon: Users,
      path: "/dashboard/users",
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      id: 'social-feed',
      title: "Social Feed",
      description: "Connect and share with your team",
      icon: MessageSquare,
      path: "/dashboard/social",
      color: "text-blue-500",
      bgColor: "bg-blue-50",
    },
  ];

  const getColorClasses = (colorName: string) => {
    switch (colorName) {
      case 'primary':
        return {
          bg: 'bg-primary/10',
          text: 'text-primary',
          trend: 'text-primary'
        };
      case 'blue':
        return {
          bg: 'bg-blue-50',
          text: 'text-blue-500',
          trend: 'text-blue-500'
        };
      case 'green':
        return {
          bg: 'bg-green-50',
          text: 'text-green-500',
          trend: 'text-green-500'
        };
      case 'orange':
        return {
          bg: 'bg-orange-50',
          text: 'text-orange-500',
          trend: 'text-orange-500'
        };
      default:
        return {
          bg: 'bg-gray-50',
          text: 'text-gray-500',
          trend: 'text-gray-500'
        };
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="container px-4 sm:px-6 lg:px-8 mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="flex justify-between items-center mb-4">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Welcome to SNULI Hub
              </h1>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshStats}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isLoading && "animate-spin"
                )} />
                Refresh Stats
              </Button>
            </div>
            <div className="text-sm text-muted-foreground mb-4">
              {lastRefresh && (
                <p>Last updated {formatDistanceToNow(new Date(lastRefresh), { addSuffix: true })}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid gap-6">
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>Monthly Performance Overview</CardTitle>
            <CardDescription>Revenue and order trends across all franchises</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-[400px] flex items-center justify-center text-muted-foreground">
              Line chart showing revenue and orders will be implemented here
            </div>
          </CardContent>
        </Card>

        <div className="grid gap-6 md:grid-cols-2">
          <Card className="bg-gradient-to-br from-primary/5 via-primary/10 to-background">
            <CardHeader>
              <CardTitle>Revenue Distribution</CardTitle>
              <CardDescription>Top performing franchises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Pie chart showing revenue distribution will be implemented here
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-blue-50/50 via-blue-50/30 to-background">
            <CardHeader>
              <CardTitle>Product Performance</CardTitle>
              <CardDescription>Best-selling products across franchises</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px] flex items-center justify-center text-muted-foreground">
                Bar chart showing product performance will be implemented here
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {dashboardStats.map((stat) => {
          const colors = getColorClasses(stat.color);
          return (
            <Card key={stat.id} className="hover:shadow-lg transition-all duration-200">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`p-2 rounded-xl ${colors.bg} ${colors.text}`}>
                  <stat.icon className="h-4 w-4" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
                <div className="flex items-center justify-between mt-1">
                  <p className="text-xs text-muted-foreground">
                    {stat.description}
                  </p>
                  <p className={`text-xs font-medium ${colors.trend}`}>
                    {stat.trend}
                  </p>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Access & Active Franchises */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl flex items-center gap-2">
              <Activity className="w-5 h-5 text-primary" />
              Active Franchises
            </CardTitle>
            <CardDescription>
              {stats.activeFranchises} franchises currently active
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ScrollArea className="h-[300px] pr-4">
              <div className="space-y-4">
                {users
                  .filter(u => u.role === 'distributing_franchise')
                  .sort((a, b) => {
                    // Sort online users first, then by last active date
                    if (a.isOnline && !b.isOnline) return -1;
                    if (!a.isOnline && b.isOnline) return 1;
                    return new Date(b.lastActive).getTime() - new Date(a.lastActive).getTime();
                  })
                  .map((user) => (
                    <div 
                      key={user.id}
                      className="flex items-center justify-between p-3 rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <Avatar>
                          <AvatarFallback>
                            {user.username[0].toUpperCase()}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-medium">{user.franchiseName}</p>
                          <p className="text-sm text-muted-foreground">@{user.username}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        {user.isActive ? (
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                            </span>
                            <span className="text-sm text-green-600 font-medium">Active</span>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2">
                            <span className="relative flex h-3 w-3">
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300"></span>
                            </span>
                            <span className="text-sm text-muted-foreground">
                              {user.lastActive ? formatDistanceToNow(new Date(user.lastActive), { addSuffix: true }) : 'Inactive'}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                {users.filter(u => u.role === 'distributing_franchise').length === 0 && (
                  <div className="text-center py-8 text-muted-foreground">
                    <Store className="h-12 w-12 mx-auto mb-4 opacity-50" />
                    <p className="text-lg font-medium">No franchises yet</p>
                    <p className="text-sm">Add franchises to see them here</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        <div className="space-y-6">
          {features.map((feature) => (
            <Card 
              key={feature.id}
              className="group hover:shadow-lg transition-all duration-200 cursor-pointer"
              onClick={() => navigate(feature.path)}
            >
              <CardHeader>
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${feature.bgColor} ${feature.color} group-hover:scale-110 transition-transform duration-200`}>
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <CardTitle className="text-xl">{feature.title}</CardTitle>
                    <CardDescription>{feature.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
}