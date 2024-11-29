import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { 
  MessageCircle, 
  Trash2, 
  Send, 
  Pin,
  Star,
  MoreVertical,
  Share
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LikeButton } from './LikeButton';
import { CommentThread } from './CommentThread';
import { FollowButton } from './FollowButton';
import { useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from '@/components/ui/dropdown-menu';

interface Post {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
  comments: Comment[];
  images?: string[];
  link?: {
    url: string;
    title?: string;
    description?: string;
    image?: string;
  };
}

interface Comment {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
  replies: Reply[];
}

interface Reply {
  id: string;
  userId: string;
  content: string;
  createdAt: string;
  likes: string[];
}

interface User {
  id: string;
  username: string;
  franchiseName?: string;
  avatar?: string;
  role: string;
}

interface SocialPostProps {
  post: Post;
  currentUser: User | null;
  getUser: (userId: string) => User | undefined;
}

export function SocialPost({ post, currentUser, getUser }: SocialPostProps) {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { 
    deletePost, 
    likePost, 
    addComment, 
    deleteComment, 
    likeComment, 
    addReply, 
    deleteReply, 
    likeReply 
  } = useUserStore();

  const author = getUser(post.userId);
  if (!author) return null;

  const displayName = author.franchiseName || author.username;

  // Calculate total comments including replies
  const totalComments = post.comments.reduce((total, comment) => {
    return total + 1 + comment.replies.length;
  }, 0);

  const handleDeletePost = () => {
    deletePost(post.id);
    toast({
      title: "Post deleted",
      description: "Your post has been deleted successfully.",
    });
  };

  const handleLikePost = () => {
    if (currentUser) {
      likePost(post.id, currentUser.id);
    }
  };

  const handleAddComment = (content: string) => {
    if (currentUser) {
      addComment(post.id, {
        userId: currentUser.id,
        content,
      });
    }
  };

  return (
    <Card className="group">
      <CardContent className="pt-6">
        {/* Post Header */}
        <div className="flex justify-between items-start mb-4">
          <div 
            className="flex items-center gap-3 cursor-pointer group/author"
            onClick={() => navigate(`/dashboard/social/profile/${author.username}`)}
          >
            <Avatar className="w-10 h-10 ring-2 ring-primary/10 transition-transform group-hover/author:scale-105">
              {author.avatar ? (
                <AvatarImage src={author.avatar} alt={displayName} />
              ) : (
                <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080]">
                  {displayName[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold group-hover/author:text-[#FFB080] transition-colors">
                {displayName}
              </h3>
              <p className="text-sm text-muted-foreground">
                {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
              </p>
            </div>
          </div>

          {(currentUser?.id === post.userId || currentUser?.role === 'webmaster') && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="opacity-0 group-hover:opacity-100 transition-opacity"
                >
                  <MoreVertical className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {currentUser.role === 'webmaster' && (
                  <>
                    <DropdownMenuItem>
                      <Pin className="h-4 w-4 mr-2" />
                      Pin Post
                    </DropdownMenuItem>
                    <DropdownMenuItem>
                      <Star className="h-4 w-4 mr-2" />
                      Mark as Featured
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                  </>
                )}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={handleDeletePost}
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>

        {/* Post Content */}
        <p className="text-lg mb-4">{post.content}</p>

        {/* Post Images */}
        {post.images && post.images.length > 0 && (
          <div className="grid grid-cols-2 gap-2 mb-4">
            {post.images.map((image, index) => (
              <img
                key={index}
                src={image}
                alt={`Post image ${index + 1}`}
                className="rounded-lg w-full h-48 object-cover"
              />
            ))}
          </div>
        )}

        {/* Link Preview */}
        {post.link && (
          <a
            href={post.link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block mb-4"
          >
            <div className="border rounded-lg overflow-hidden hover:bg-muted/50 transition-colors">
              {post.link.image && (
                <img
                  src={post.link.image}
                  alt={post.link.title || 'Link preview'}
                  className="w-full h-48 object-cover"
                />
              )}
              <div className="p-4">
                <h4 className="font-semibold mb-1">{post.link.title}</h4>
                <p className="text-sm text-muted-foreground">
                  {post.link.description}
                </p>
                <p className="text-sm text-[#FFB080] mt-2">{post.link.url}</p>
              </div>
            </div>
          </a>
        )}

        {/* Post Actions */}
        <div className="flex items-center gap-4 mb-4">
          <LikeButton
            isLiked={currentUser ? post.likes.includes(currentUser.id) : false}
            count={post.likes.length}
            onLike={handleLikePost}
          />
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-[#FFB080] hover:bg-[#FFB080]/10"
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            {totalComments} Comments
          </Button>
          {currentUser && currentUser.id !== author.id && (
            <FollowButton userId={author.id} variant="ghost" size="sm" />
          )}
          <Button
            variant="ghost"
            size="sm"
            className="text-muted-foreground hover:text-[#FFB080] hover:bg-[#FFB080]/10 ml-auto"
          >
            <Share className="h-4 w-4 mr-2" />
            Share
          </Button>
        </div>

        {/* Comments */}
        <div className="space-y-4">
          {post.comments.map((comment) => (
            <CommentThread
              key={comment.id}
              postId={post.id}
              comment={comment}
              currentUser={currentUser}
              getUser={getUser}
              onReply={(commentId, content) =>
                addReply(post.id, commentId, {
                  userId: currentUser!.id,
                  content,
                })
              }
              onDeleteComment={(commentId) =>
                deleteComment(post.id, commentId)
              }
              onLikeComment={(commentId) =>
                likeComment(post.id, commentId, currentUser!.id)
              }
              onDeleteReply={(commentId, replyId) =>
                deleteReply(post.id, commentId, replyId)
              }
              onLikeReply={(commentId, replyId) =>
                likeReply(post.id, commentId, replyId, currentUser!.id)
              }
            />
          ))}
        </div>

        {/* Add Comment */}
        {currentUser && (
          <div className="flex items-center gap-3 mt-4">
            <Avatar className="w-8 h-8">
              {currentUser.avatar ? (
                <AvatarImage src={currentUser.avatar} alt={currentUser.username} />
              ) : (
                <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080]">
                  {currentUser.username[0].toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div className="flex-1 flex gap-2">
              <Input
                placeholder="Write a comment..."
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    const content = e.currentTarget.value.trim();
                    if (content) {
                      handleAddComment(content);
                      e.currentTarget.value = '';
                    }
                  }
                }}
                className="flex-1"
              />
              <Button 
                size="icon" 
                className="shrink-0 bg-[#FFB080] hover:bg-[#FFB080]/90"
                onClick={(e) => {
                  const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                  const content = input.value.trim();
                  if (content) {
                    handleAddComment(content);
                    input.value = '';
                  }
                }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}