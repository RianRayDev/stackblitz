import { formatDistanceToNow } from 'date-fns';
import { Reply, MoreVertical, Trash2, Star, Pin } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { LikeButton } from './LikeButton';
import { cn } from '@/lib/utils';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Comment, Reply as ReplyType, User } from '@/lib/store';
import { useState } from 'react';

interface CommentThreadProps {
  postId: string;
  comment: Comment;
  currentUser: User | null;
  getUser: (userId: string) => User | undefined;
  onReply: (commentId: string, content: string) => void;
  onDeleteComment: (commentId: string) => void;
  onLikeComment: (commentId: string) => void;
  onDeleteReply: (commentId: string, replyId: string) => void;
  onLikeReply: (commentId: string, replyId: string) => void;
}

export function CommentThread({
  postId,
  comment,
  currentUser,
  getUser,
  onReply,
  onDeleteComment,
  onLikeComment,
  onDeleteReply,
  onLikeReply,
}: CommentThreadProps) {
  const [replyContent, setReplyContent] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const commentAuthor = getUser(comment.userId);
  const isWebmaster = currentUser?.role === 'webmaster';

  if (!commentAuthor) return null;

  const displayName = commentAuthor.stationName || commentAuthor.username;

  const handleReply = () => {
    if (!replyContent.trim()) return;
    onReply(comment.id, replyContent);
    setReplyContent('');
    setIsReplying(false);
  };

  const handleLikeComment = () => {
    if (currentUser) {
      onLikeComment(comment.id);
    }
  };

  return (
    <div className="comment-thread">
      <div className="flex space-x-3 group">
        <Avatar className="w-8 h-8 ring-2 ring-primary/10">
          {commentAuthor.avatar ? (
            <AvatarImage src={commentAuthor.avatar} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080] text-xs">
              {displayName[0].toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted/50 rounded-lg p-3 group-hover:bg-muted/70 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{displayName}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                </span>
              </div>
              {(currentUser?.id === comment.userId || isWebmaster) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isWebmaster && (
                      <>
                        <DropdownMenuItem className="text-primary">
                          <Star className="h-4 w-4 mr-2" />
                          Highlight Comment
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-primary">
                          <Pin className="h-4 w-4 mr-2" />
                          Pin Comment
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={() => onDeleteComment(comment.id)}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="text-sm mt-1">{comment.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <LikeButton
              size="sm"
              isLiked={currentUser ? comment.likes.includes(currentUser.id) : false}
              count={comment.likes.length}
              onLike={handleLikeComment}
            />
            <Button
              variant="ghost"
              size="sm"
              className="h-6 px-2 text-xs text-muted-foreground hover:text-[#FFB080] group"
              onClick={() => setIsReplying(!isReplying)}
            >
              <Reply className="h-3 w-3 mr-1 group-hover:translate-x-1 transition-transform" />
              Reply
            </Button>
          </div>

          {isReplying && currentUser && (
            <div className="flex space-x-2 mt-2">
              <Input
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                placeholder="Write a reply..."
                className="flex-1 h-8 text-sm focus-visible:ring-[#FFB080]"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleReply();
                  }
                }}
              />
              <Button
                size="sm"
                className="h-8 bg-[#FFB080] hover:bg-[#FFB080]/90 group"
                onClick={handleReply}
                disabled={!replyContent.trim()}
              >
                <Reply className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          )}

          {comment.replies.length > 0 && (
            <div className="mt-2 space-y-3">
              {comment.replies.map((reply) => (
                <ReplyThread
                  key={reply.id}
                  reply={reply}
                  currentUser={currentUser}
                  getUser={getUser}
                  onDelete={() => onDeleteReply(comment.id, reply.id)}
                  onLike={() => onLikeReply(comment.id, reply.id)}
                  isWebmaster={isWebmaster}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface ReplyThreadProps {
  reply: ReplyType;
  currentUser: User | null;
  getUser: (userId: string) => User | undefined;
  onDelete: () => void;
  onLike: () => void;
  isWebmaster: boolean;
}

function ReplyThread({ reply, currentUser, getUser, onDelete, onLike, isWebmaster }: ReplyThreadProps) {
  const replyAuthor = getUser(reply.userId);
  if (!replyAuthor) return null;

  const displayName = replyAuthor.stationName || replyAuthor.username;

  const handleLike = () => {
    if (currentUser) {
      onLike();
    }
  };

  return (
    <div className="reply-thread">
      <div className="flex space-x-3 group">
        <Avatar className="w-6 h-6 ring-2 ring-primary/10">
          {replyAuthor.avatar ? (
            <AvatarImage src={replyAuthor.avatar} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080] text-xs">
              {displayName[0].toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1">
          <div className="bg-muted/30 rounded-lg p-2 group-hover:bg-muted/50 transition-colors">
            <div className="flex justify-between items-start">
              <div className="flex items-center gap-2">
                <p className="font-semibold text-sm">{displayName}</p>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(reply.createdAt), { addSuffix: true })}
                </span>
              </div>
              {(currentUser?.id === reply.userId || isWebmaster) && (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-6 w-6 opacity-0 group-hover:opacity-100"
                    >
                      <MoreVertical className="h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    {isWebmaster && (
                      <>
                        <DropdownMenuItem className="text-primary">
                          <Star className="h-4 w-4 mr-2" />
                          Highlight Reply
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                      </>
                    )}
                    <DropdownMenuItem
                      className="text-destructive"
                      onClick={onDelete}
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Delete
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              )}
            </div>
            <p className="text-sm mt-1">{reply.content}</p>
          </div>
          <div className="flex items-center gap-4 mt-1">
            <LikeButton
              size="sm"
              isLiked={currentUser ? reply.likes.includes(currentUser.id) : false}
              count={reply.likes.length}
              onLike={handleLike}
            />
          </div>
        </div>
      </div>
    </div>
  );
}