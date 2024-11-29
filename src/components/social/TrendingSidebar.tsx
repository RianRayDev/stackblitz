import { TrendingUp, Users, UserPlus, BarChart, Hash, MessageCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useUserStore } from '@/lib/store';

const trendingTopics = [
  { tag: 'ProductLaunch', posts: 245, isHot: true },
  { tag: 'SalesStrategy', posts: 189, isHot: true },
  { tag: 'MarketingTips', posts: 156 },
  { tag: 'CustomerSuccess', posts: 134 },
];

const suggestedUsers = [
  { name: 'Station Alpha', role: 'Distribution Hub', isActive: true },
  { name: 'Station Beta', role: 'Regional Center', isActive: true },
  { name: 'Station Gamma', role: 'Local Branch' },
];

const engagementStats = [
  { label: 'Active Users', value: '156', trend: '+12%' },
  { label: 'Daily Posts', value: '45', trend: '+8%' },
];

export function TrendingSidebar() {
  const { currentUser, users, posts } = useUserStore();
  const isWebmaster = currentUser?.role === 'webmaster';

  // Calculate real-time stats for webmaster
  const getEngagementStats = () => {
    const activeUsers = users.filter(u => u.isOnline).length;
    const dailyPosts = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      const today = new Date();
      return postDate.getDate() === today.getDate() &&
             postDate.getMonth() === today.getMonth() &&
             postDate.getFullYear() === today.getFullYear();
    }).length;

    const yesterdayPosts = posts.filter(post => {
      const postDate = new Date(post.createdAt);
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      return postDate.getDate() === yesterday.getDate() &&
             postDate.getMonth() === yesterday.getMonth() &&
             postDate.getFullYear() === yesterday.getFullYear();
    }).length;

    const postsTrend = yesterdayPosts ? `${Math.round((dailyPosts - yesterdayPosts) / yesterdayPosts * 100)}%` : '+0%';

    return [
      { label: 'Active Users', value: activeUsers.toString(), trend: '+12%' },
      { label: 'Daily Posts', value: dailyPosts.toString(), trend: postsTrend }
    ];
  };

  const currentStats = isWebmaster ? getEngagementStats() : [];

  return (
    <div className="space-y-6 pl-6 pr-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
        <Input
          placeholder="Search posts..."
          className="pl-10"
        />
      </div>

      {/* Trending Topics */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#FFB080]" />
            Trending Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trendingTopics.map((topic) => (
            <Button
              key={topic.tag}
              variant="ghost"
              className="w-full justify-between hover:bg-[#FFB080]/10 hover:text-[#FFB080] px-3 h-auto py-2"
            >
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-[#FFB080]" />
                <span className="font-medium">{topic.tag}</span>
                {topic.isHot && (
                  <span className="px-1.5 py-0.5 rounded-full bg-[#FFB080]/10 text-[#FFB080] text-xs">
                    Hot 🔥
                  </span>
                )}
              </div>
              <span className="text-sm text-muted-foreground">{topic.posts}</span>
            </Button>
          ))}
        </CardContent>
      </Card>

      {/* Active Connections */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Users className="h-5 w-5 text-[#FFB080]" />
            Active Now
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {suggestedUsers.map((user) => (
            <div key={user.name} className="flex items-center justify-between group">
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080]">
                      {user.name[0]}
                    </AvatarFallback>
                  </Avatar>
                  {user.isActive && (
                    <span className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>
                <div>
                  <p className="font-medium text-sm group-hover:text-[#FFB080] transition-colors">
                    {user.name}
                  </p>
                  <p className="text-xs text-muted-foreground">{user.role}</p>
                </div>
              </div>
              <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 hover:text-[#FFB080]">
                <MessageCircle className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Today's Activity - Only visible to webmaster */}
      {isWebmaster && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg flex items-center gap-2">
              <BarChart className="h-5 w-5 text-[#FFB080]" />
              Today's Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {currentStats.map((stat) => (
                <div key={stat.label} className="space-y-1">
                  <p className="text-2xl font-bold text-[#FFB080]">{stat.value}</p>
                  <div className="flex items-center gap-1">
                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                    <span className="text-xs text-green-500">{stat.trend}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}