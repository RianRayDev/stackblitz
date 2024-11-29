import { useEffect, useRef, useState } from "react";
import { useInView } from "react-intersection-observer";
import { formatDistanceToNow } from "date-fns";
import { Heart, MessageCircle, Trash2, Send } from "lucide-react";
import { useUserStore } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";

export function SocialFeed() {
  const { currentUser, posts, users, addPost, deletePost, likePost, addComment } = useUserStore();
  const [newPost, setNewPost] = useState("");
  const [newComments, setNewComments] = useState<{ [key: string]: string }>({});
  const [displayedPosts, setDisplayedPosts] = useState(10);
  const { ref, inView } = useInView();

  useEffect(() => {
    if (inView) {
      setDisplayedPosts((prev) => Math.min(prev + 10, posts.length));
    }
  }, [inView, posts.length]);

  const handlePost = () => {
    if (!currentUser || !newPost.trim()) return;

    const post = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      content: newPost,
      createdAt: new Date().toISOString(),
      likes: [],
      comments: [],
    };

    addPost(post);
    setNewPost("");
  };

  const handleComment = (postId: string) => {
    if (!currentUser || !newComments[postId]?.trim()) return;

    const comment = {
      id: crypto.randomUUID(),
      userId: currentUser.id,
      content: newComments[postId],
      createdAt: new Date().toISOString(),
    };

    addComment(postId, comment);
    setNewComments((prev) => ({ ...prev, [postId]: "" }));
  };

  const getUser = (userId: string) => {
    return users.find((user) => user.id === userId);
  };

  return (
    <div className="w-full max-w-3xl mx-auto p-4 space-y-6">
      {currentUser && (
        <Card className="p-4">
          <div className="flex gap-4">
            <Avatar className="w-10 h-10">
              <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                {currentUser.username[0].toUpperCase()}
              </div>
            </Avatar>
            <div className="flex-1 space-y-2">
              <Input
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full"
              />
              <Button onClick={handlePost} className="w-full">
                Post
              </Button>
            </div>
          </div>
        </Card>
      )}

      <ScrollArea className="h-[600px] pr-4">
        <div className="space-y-4">
          {posts.slice(0, displayedPosts).map((post) => {
            const author = getUser(post.userId);
            if (!author) return null;

            return (
              <Card key={post.id} className="p-4 space-y-4">
                <div className="flex items-center gap-2">
                  <Avatar className="w-8 h-8">
                    <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground">
                      {author.username[0].toUpperCase()}
                    </div>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{author.username}</p>
                    <p className="text-sm text-muted-foreground">
                      {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                  {currentUser?.id === post.userId && (
                    <Button
                      variant="ghost"
                      size="icon"
                      className="ml-auto"
                      onClick={() => deletePost(post.id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  )}
                </div>

                <p className="text-lg">{post.content}</p>

                <div className="flex items-center gap-4">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                    onClick={() => currentUser && likePost(post.id, currentUser.id)}
                  >
                    <Heart
                      className={`w-4 h-4 ${
                        currentUser && post.likes.includes(currentUser.id)
                          ? "fill-primary text-primary"
                          : ""
                      }`}
                    />
                    {post.likes.length}
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="flex items-center gap-1"
                  >
                    <MessageCircle className="w-4 h-4" />
                    {post.comments.length}
                  </Button>
                </div>

                {currentUser && (
                  <div className="flex gap-2">
                    <Input
                      value={newComments[post.id] || ""}
                      onChange={(e) =>
                        setNewComments((prev) => ({
                          ...prev,
                          [post.id]: e.target.value,
                        }))
                      }
                      placeholder="Write a comment..."
                      className="flex-1"
                    />
                    <Button
                      size="icon"
                      onClick={() => handleComment(post.id)}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                )}

                {post.comments.length > 0 && (
                  <div className="space-y-2 pl-8">
                    {post.comments.map((comment) => {
                      const commentAuthor = getUser(comment.userId);
                      if (!commentAuthor) return null;

                      return (
                        <div key={comment.id} className="flex items-start gap-2">
                          <Avatar className="w-6 h-6">
                            <div className="w-full h-full flex items-center justify-center bg-primary text-primary-foreground text-xs">
                              {commentAuthor.username[0].toUpperCase()}
                            </div>
                          </Avatar>
                          <div className="flex-1">
                            <p className="font-semibold text-sm">
                              {commentAuthor.username}
                            </p>
                            <p className="text-sm">{comment.content}</p>
                            <p className="text-xs text-muted-foreground">
                              {formatDistanceToNow(new Date(comment.createdAt), {
                                addSuffix: true,
                              })}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </Card>
            );
          })}
          <div ref={ref} className="h-4" />
        </div>
      </ScrollArea>
    </div>
  );
}