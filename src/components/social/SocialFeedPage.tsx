import { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { formatDistanceToNow } from 'date-fns';
import { useUserStore } from "@/lib/store";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { CreatePost } from './CreatePost';
import { SocialPost } from './SocialPost';
import { SideNav } from './SideNav';
import { TrendingSidebar } from './TrendingSidebar';
import { useToast } from '@/hooks/use-toast';

export function SocialFeedPage() {
  const { toast } = useToast();
  const { currentUser, users, posts = [] } = useUserStore();
  const [displayedPosts, setDisplayedPosts] = useState(10);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setDisplayedPosts((prev) => Math.min(prev + 10, posts.length));
    }
  }, [inView, posts.length]);

  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SideNav />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl mx-auto">
        {/* Create Post */}
        {currentUser && <CreatePost />}

        {/* Posts Feed */}
        <div className="space-y-6 mt-6">
          {posts.slice(0, displayedPosts).map((post) => (
            <SocialPost
              key={post.id}
              post={post}
              currentUser={currentUser}
              getUser={getUser}
            />
          ))}

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