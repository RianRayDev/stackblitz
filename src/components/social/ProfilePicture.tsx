import { useState, useRef } from 'react';
import { Check, Upload, Image as ImageIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import { useToast } from '@/hooks/use-toast';
import { useUserStore } from '@/lib/store';

// Pre-made avatar options using DiceBear API
const avatarStyles = [
  'adventurer',
  'avataaars',
  'big-ears',
  'bottts',
  'croodles',
  'fun-emoji',
  'icons',
  'lorelei',
  'micah',
  'miniavs',
  'personas',
  'pixel-art',
];

interface ProfilePictureProps {
  username: string;
  currentAvatar?: string;
  onAvatarChange: (newAvatar: string) => void;
  size?: 'sm' | 'md' | 'lg';
  isEditable?: boolean;
}

export function ProfilePicture({ 
  username, 
  currentAvatar, 
  onAvatarChange,
  size = 'md',
  isEditable = true
}: ProfilePictureProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const { toast } = useToast();
  const { updateAvatar } = useUserStore();
  const [selectedStyle, setSelectedStyle] = useState(currentAvatar?.split('/')[5] || 'avataaars');
  const [isOpen, setIsOpen] = useState(false);
  const [customImage, setCustomImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getAvatarUrl = (style: string) => {
    return `https://api.dicebear.com/7.x/${style}/svg?seed=${username}`;
  };

  const handleStyleSelect = (style: string) => {
    setSelectedStyle(style);
    const newAvatarUrl = getAvatarUrl(style);
    onAvatarChange(newAvatarUrl);
    updateAvatar(username, newAvatarUrl);
    toast({
      title: "Avatar Updated",
      description: "Your profile picture has been updated successfully.",
    });
  };

  const handleCustomImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast({
          title: "File too large",
          description: "Please select an image under 5MB",
          variant: "destructive"
        });
        return;
      }

      const reader = new FileReader();
      reader.onloadend = () => {
        const result = reader.result as string;
        setCustomImage(result);
        onAvatarChange(result);
        updateAvatar(username, result);
        setIsOpen(false);
        toast({
          title: "Avatar Updated",
          description: "Your profile picture has been updated successfully.",
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleClick = () => {
    if (isEditable) {
      setIsOpen(true);
    } else {
      // Check if we're already on a profile page
      const isProfilePage = location.pathname.includes('/dashboard/social/profile/');
      
      // If we're already on a profile page, just update the username in the URL
      if (isProfilePage) {
        navigate(`/dashboard/social/profile/${username}`);
      } else {
        // If we're not on a profile page, navigate to the profile with posts tab active
        navigate(`/dashboard/social/profile/${username}?tab=posts`);
      }
    }
  };

  const sizeClasses = {
    sm: 'h-10 w-10',
    md: 'h-16 w-16',
    lg: 'h-24 w-24'
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button 
          variant="ghost" 
          className={cn(
            "p-0 rounded-full hover:opacity-90 relative group cursor-pointer",
            sizeClasses[size]
          )}
          onClick={handleClick}
        >
          <Avatar className={cn("w-full h-full ring-2 ring-[#FFB080]/10", sizeClasses[size])}>
            {currentAvatar ? (
              <AvatarImage src={currentAvatar} alt={username} />
            ) : (
              <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080]">
                {username[0].toUpperCase()}
              </AvatarFallback>
            )}
          </Avatar>
          {isEditable && (
            <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <Upload className="h-5 w-5 text-white" />
            </div>
          )}
        </Button>
      </DialogTrigger>

      {isEditable && (
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Change Profile Picture</DialogTitle>
          </DialogHeader>

          <Tabs defaultValue="preset" className="mt-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="preset">Preset Avatars</TabsTrigger>
              <TabsTrigger value="custom">Custom Image</TabsTrigger>
            </TabsList>

            <TabsContent value="preset" className="mt-4">
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                {avatarStyles.map((style) => {
                  const avatarUrl = getAvatarUrl(style);
                  const isSelected = style === selectedStyle && !customImage;

                  return (
                    <Button
                      key={style}
                      variant="ghost"
                      className={cn(
                        "p-2 h-auto flex flex-col items-center gap-2 relative hover:bg-[#FFB080]/10",
                        isSelected && "ring-2 ring-[#FFB080] bg-[#FFB080]/5"
                      )}
                      onClick={() => handleStyleSelect(style)}
                    >
                      <Avatar className="w-16 h-16">
                        <AvatarImage src={avatarUrl} alt={style} />
                        <AvatarFallback 
                          className="bg-[#FFB080]/10"
                          style={{ 
                            backgroundImage: `url(${avatarUrl})`,
                            backgroundSize: 'cover'
                          }}
                        />
                      </Avatar>
                      <span className="text-xs font-medium capitalize">
                        {style.replace('-', ' ')}
                      </span>
                      {isSelected && (
                        <div className="absolute top-2 right-2 bg-[#FFB080] rounded-full p-0.5">
                          <Check className="h-3 w-3 text-white" />
                        </div>
                      )}
                    </Button>
                  );
                })}
              </div>
            </TabsContent>

            <TabsContent value="custom" className="mt-4">
              <div className="flex flex-col items-center justify-center p-6 border-2 border-dashed rounded-lg">
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={handleCustomImageUpload}
                />
                <ImageIcon className="h-8 w-8 text-muted-foreground mb-2" />
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a custom profile picture
                </p>
                <Button 
                  onClick={() => fileInputRef.current?.click()}
                  className="bg-[#FFB080] hover:bg-[#FFB080]/90"
                >
                  Choose Image
                </Button>
                <p className="text-xs text-muted-foreground mt-2">
                  Maximum file size: 5MB
                </p>
              </div>
            </TabsContent>
          </Tabs>

          <DialogFooter>
            <Button
              variant="ghost"
              onClick={() => setIsOpen(false)}
            >
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      )}
    </Dialog>
  );
}