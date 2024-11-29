import { BarChart3, Clock, Package2, TrendingUp } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface StatItem {
  title: string;
  value: string;
  description: string;
  icon: React.ElementType;
  trend: string;
  color: string;
}

const stats: StatItem[] = [
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

export function StoreStats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="hover:shadow-md transition-all duration-200">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium">
                {stat.title}
              </CardTitle>
              <div className={`p-2 rounded-xl bg-background ${stat.color}`}>
                <Icon className="h-4 w-4" />
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
        );
      })}
    </div>
  );
}