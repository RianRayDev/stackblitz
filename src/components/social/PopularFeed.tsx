import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { useUserStore } from '@/lib/store';
import { Post } from '@/lib/store';
import { CreatePost } from './CreatePost';
import { SocialPost } from './SocialPost';
import { Card } from '@/components/ui/card';
import { Zap, Clock, TrendingUp, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { SideNav } from './SideNav';
import { TrendingSidebar } from './TrendingSidebar';

type TimeFilter = 'now' | 'today' | 'all';

interface PopularFeedProps {
  timeFilter: TimeFilter;
}

export function PopularFeed({ timeFilter }: PopularFeedProps) {
  const navigate = useNavigate();
  const { posts, users, currentUser } = useUserStore();
  const [displayedPosts, setDisplayedPosts] = useState(10);
  const { ref, inView } = useInView();

  // Filter and sort posts based on timeFilter
  const getFilteredPosts = () => {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());

    let filteredPosts = [...posts];

    // Apply time filter
    switch (timeFilter) {
      case 'now':
        // Posts from the last 3 hours
        filteredPosts = filteredPosts.filter(post => {
          const postDate = new Date(post.createdAt);
          const hoursDiff = (now.getTime() - postDate.getTime()) / (1000 * 60 * 60);
          return hoursDiff <= 3;
        });
        break;
      case 'today':
        // Posts from today
        filteredPosts = filteredPosts.filter(post => {
          const postDate = new Date(post.createdAt);
          return postDate >= today;
        });
        break;
      // 'all' shows all posts
    }

    // Calculate engagement score (likes + comments)
    const getEngagementScore = (post: Post) => {
      const likesWeight = 1;
      const commentsWeight = 2;
      return (post.likes.length * likesWeight) + (post.comments.length * commentsWeight);
    };

    // Sort by engagement score
    return filteredPosts.sort((a, b) => getEngagementScore(b) - getEngagementScore(a));
  };

  const filteredPosts = getFilteredPosts();

  useEffect(() => {
    if (inView) {
      setDisplayedPosts((prev) => Math.min(prev + 10, filteredPosts.length));
    }
  }, [inView, filteredPosts.length]);

  const getHeaderContent = () => {
    switch (timeFilter) {
      case 'now':
        return {
          icon: Zap,
          title: "Popular Now",
          description: "Trending in the last 3 hours"
        };
      case 'today':
        return {
          icon: Clock,
          title: "Today's Top Posts",
          description: "Most engaging posts today"
        };
      case 'all':
        return {
          icon: TrendingUp,
          title: "All Time Best",
          description: "Most popular posts of all time"
        };
    }
  };

  const header = getHeaderContent();
  const HeaderIcon = header.icon;

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SideNav />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl mx-auto space-y-6">
        {/* Back Button */}
        <Button 
          variant="ghost" 
          onClick={() => navigate('/dashboard/social')}
          className="text-muted-foreground hover:text-foreground group mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
          Back to Feed
        </Button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="h-10 w-10 rounded-full bg-[#FFB080]/10 flex items-center justify-center">
            <HeaderIcon className="h-5 w-5 text-[#FFB080]" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">{header.title}</h1>
            <p className="text-muted-foreground">{header.description}</p>
          </div>
        </div>

        {/* Create Post */}
        {currentUser && <CreatePost />}

        {/* Posts Feed */}
        <div className="space-y-6">
          {filteredPosts.slice(0, displayedPosts).map((post) => (
            <SocialPost
              key={post.id}
              post={post}
              currentUser={currentUser}
              getUser={(userId) => users.find(u => u.id === userId)}
            />
          ))}

          {filteredPosts.length === 0 && (
            <Card className="p-8 text-center">
              <p className="text-lg font-medium mb-2">No posts yet</p>
              <p className="text-muted-foreground">
                {timeFilter === 'now' 
                  ? "There are no trending posts in the last 3 hours." 
                  : timeFilter === 'today'
                  ? "No posts have been made today."
                  : "Start engaging with posts to see them here!"}
              </p>
            </Card>
          )}

          {/* Load More Trigger */}
          <div ref={ref} className="h-4" />
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="hidden xl:block w-80 shrink-0">
        <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <TrendingSidebar />
        </div>
      </div>
    </div>
  );
}