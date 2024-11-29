import { useState, useEffect } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { ArrowLeft, MapPin, Building2, Clock, Settings, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserStore } from '@/lib/store';
import { SideNav } from './SideNav';
import { TrendingSidebar } from './TrendingSidebar';
import { SocialPost } from './SocialPost';
import { ProfilePicture } from './ProfilePicture';
import { formatDistanceToNow } from 'date-fns';
import { Switch } from '@/components/ui/switch';
import { useToast } from '@/hooks/use-toast';
import { FollowButton } from './FollowButton';

export function ProfilePage() {
  const navigate = useNavigate();
  const { username } = useParams();
  const [searchParams] = useSearchParams();
  const { toast } = useToast();
  const { currentUser, users, posts, updateUser, updateUserActivity } = useUserStore();
  const [activeTab, setActiveTab] = useState('posts');
  const [isEditing, setIsEditing] = useState(false);

  const viewedUser = username 
    ? users.find(u => u.username === username)
    : currentUser;

  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(tab);
    }
  }, [searchParams]);

  if (!viewedUser) {
    navigate('/dashboard/social');
    return null;
  }

  const isOwnProfile = currentUser?.id === viewedUser.id;
  const userPosts = posts.filter(post => post.userId === viewedUser.id);
  const displayName = viewedUser.franchiseName || viewedUser.username;

  const handleUpdateProfile = (updates: Partial<typeof viewedUser>) => {
    if (viewedUser) {
      updateUser(viewedUser.username, updates);
      setIsEditing(false);
      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully.",
      });
    }
  };

  const handleToggleOnline = () => {
    if (viewedUser) {
      updateUserActivity(viewedUser.username, !viewedUser.isOnline);
      toast({
        title: viewedUser.isOnline ? "Status: Offline" : "Status: Online",
        description: `You are now ${viewedUser.isOnline ? 'offline' : 'online'}`,
      });
    }
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
      <div className="flex-1 max-w-2xl space-y-6">
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/social')}
            className="text-muted-foreground hover:text-foreground group mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </Button>
        </div>

        {/* Profile Card */}
        <Card className="p-6">
          <div className="flex items-start justify-between mb-6">
            <div className="flex items-center gap-4">
              <ProfilePicture
                username={viewedUser.username}
                currentAvatar={viewedUser.avatar}
                onAvatarChange={(newAvatar) => handleUpdateProfile({ avatar: newAvatar })}
                size="lg"
                isEditable={isOwnProfile}
              />
              <div>
                <h1 className="text-2xl font-bold">{displayName}</h1>
                <p className="text-muted-foreground">@{viewedUser.username}</p>
                <div className="flex items-center gap-4 mt-2">
                  <span className="text-sm">
                    <strong>{viewedUser.followers?.length || 0}</strong> followers
                  </span>
                  <span className="text-sm">
                    <strong>{viewedUser.following?.length || 0}</strong> following
                  </span>
                  <span className="text-sm">
                    <strong>{viewedUser.teammates?.length || 0}</strong> teammates
                  </span>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-4">
              {isOwnProfile ? (
                <>
                  <div className="flex items-center gap-2">
                    <Switch
                      checked={viewedUser.isOnline}
                      onCheckedChange={handleToggleOnline}
                    />
                    <span className="text-sm font-medium">
                      {viewedUser.isOnline ? 'Online' : 'Offline'}
                    </span>
                  </div>
                  <Button onClick={() => setIsEditing(true)} className="gap-2">
                    <Edit className="h-4 w-4" />
                    Edit Profile
                  </Button>
                </>
              ) : (
                <FollowButton userId={viewedUser.id} />
              )}
            </div>
          </div>

          <div className="space-y-4">
            {viewedUser.bio && (
              <p className="text-sm">{viewedUser.bio}</p>
            )}
            <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
              {viewedUser.location && (
                <div className="flex items-center gap-2">
                  <MapPin className="h-4 w-4" />
                  {viewedUser.location}
                </div>
              )}
              <div className="flex items-center gap-2">
                <Building2 className="h-4 w-4" />
                {viewedUser.role === 'webmaster' ? 'Administrator' : 'Franchise Manager'}
              </div>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Active {formatDistanceToNow(new Date(viewedUser.lastActive), { addSuffix: true })}
              </div>
            </div>
          </div>
        </Card>

        {/* Profile Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="posts" className="flex-1">Posts</TabsTrigger>
            <TabsTrigger value="comments" className="flex-1">Comments</TabsTrigger>
            <TabsTrigger value="liked" className="flex-1">Liked</TabsTrigger>
          </TabsList>

          <TabsContent value="posts" className="mt-6 space-y-6">
            {userPosts.map((post) => (
              <SocialPost
                key={post.id}
                post={post}
                currentUser={currentUser}
                getUser={(userId) => users.find(u => u.id === userId)}
              />
            ))}
            {userPosts.length === 0 && (
              <Card className="p-8 text-center">
                <p className="text-lg font-medium mb-2">No posts yet</p>
                <p className="text-muted-foreground">
                  {isOwnProfile 
                    ? "Share your first post with the community!"
                    : `${displayName} hasn't posted anything yet.`}
                </p>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="comments" className="mt-6">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Comments will be implemented soon</p>
            </Card>
          </TabsContent>

          <TabsContent value="liked" className="mt-6">
            <Card className="p-8 text-center">
              <p className="text-muted-foreground">Liked posts will be implemented soon</p>
            </Card>
          </TabsContent>
        </Tabs>
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