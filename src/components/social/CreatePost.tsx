import { useState, useRef } from 'react';
import { ImagePlus, Link as LinkIcon, Loader2, X, Send, Sparkles } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function CreatePost() {
  const { currentUser, addPost } = useUserStore();
  const { toast } = useToast();
  const [content, setContent] = useState('');
  const [images, setImages] = useState<string[]>([]);
  const [link, setLink] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!currentUser) return null;

  const displayName = currentUser.stationName || currentUser.username;

  const handleImageUpload = (files: FileList | null) => {
    if (!files) return;
    Array.from(files).forEach((file) => {
      if (!file.type.startsWith('image/')) {
        toast({
          title: 'Invalid file type',
          description: 'Please upload only image files.',
          variant: 'destructive',
        });
        return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = () => {
    if (!currentUser || !content.trim()) return;

    const newPost = {
      userId: currentUser.id,
      content,
      images: images.length > 0 ? images : undefined,
    };

    addPost(newPost);
    setContent('');
    setImages([]);
    setLink('');
    setIsFocused(false);
    
    toast({
      title: 'Success',
      description: 'Your post has been published!',
    });
  };

  return (
    <div 
      className={cn(
        "rounded-lg border bg-card p-4 space-y-4",
        isDragging && "border-[#FFB080] bg-[#FFB080]/5",
        isFocused && "ring-2 ring-[#FFB080] ring-offset-2"
      )}
      onDrop={(e) => {
        e.preventDefault();
        setIsDragging(false);
        handleImageUpload(e.dataTransfer.files);
      }}
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={(e) => {
        e.preventDefault();
        setIsDragging(false);
      }}
    >
      <div className="flex gap-3">
        <Avatar className="w-10 h-10 ring-2 ring-[#FFB080]/10">
          {currentUser.avatar ? (
            <AvatarImage src={currentUser.avatar} alt={displayName} />
          ) : (
            <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080]">
              {displayName[0].toUpperCase()}
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex-1 space-y-4">
          <Textarea
            placeholder="What's on your mind?"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            className="min-h-[100px] resize-none focus-visible:ring-[#FFB080] text-lg border-none bg-transparent placeholder:text-muted-foreground/50"
          />

          {images.length > 0 && (
            <div className="grid grid-cols-2 gap-2">
              {images.map((image, index) => (
                <div key={index} className="relative group">
                  <img
                    src={image}
                    alt={`Upload ${index + 1}`}
                    className="w-full h-32 object-cover rounded-md"
                  />
                  <Button
                    variant="destructive"
                    size="icon"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => setImages(images.filter((_, i) => i !== index))}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          <div className="flex items-center gap-2">
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              multiple
              onChange={(e) => handleImageUpload(e.target.files)}
            />
            <Button
              variant="outline"
              size="sm"
              onClick={() => fileInputRef.current?.click()}
              className="group hover:bg-[#FFB080]/10 hover:text-[#FFB080] hover:border-[#FFB080]"
            >
              <ImagePlus className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" />
              Add Images
            </Button>

            <Button
              className="ml-auto gap-2 bg-[#FFB080] hover:bg-[#FFB080]/90"
              onClick={handleSubmit}
              disabled={!content.trim() || isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  Share
                </>
              )}
            </Button>
          </div>

          {isDragging && (
            <div className="text-center text-sm text-muted-foreground">
              Drop images here to upload
            </div>
          )}
        </div>
      </div>
    </div>
  );
}