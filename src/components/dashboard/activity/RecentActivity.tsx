import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

interface Activity {
  text: string;
  time: string;
}

const activities: Activity[] = [
  { text: "New order #1234 received from Reseller A", time: "2 minutes ago" },
  { text: "Inventory updated for Product SKU-789", time: "1 hour ago" },
  { text: "Shipment dispatched to Reseller B", time: "3 hours ago" },
  { text: "Low stock alert for Product SKU-456", time: "5 hours ago" }
];

export function RecentActivity() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activities</CardTitle>
        <CardDescription>
          Latest updates from your store
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {activities.map((activity, index) => (
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
  );
}