import { useState, useRef, useEffect } from 'react';
import { UserPlus, Users, Check, HeartHandshake } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useUserStore } from '@/lib/store';
import { useToast } from '@/hooks/use-toast';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

interface FollowButtonProps {
  userId: string;
  size?: 'sm' | 'default';
  variant?: 'default' | 'ghost';
}

export function FollowButton({ userId, size = 'default', variant = 'default' }: FollowButtonProps) {
  const { currentUser, isFollowing, isTeammate, followUser, unfollowUser, teamUpUser, unteamUser } = useUserStore();
  const { toast } = useToast();
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout>();

  const isFollowed = currentUser ? isFollowing(currentUser.id, userId) : false;
  const isTeamedUp = currentUser ? isTeammate(currentUser.id, userId) : false;

  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  const handleFollow = () => {
    if (!currentUser) return;

    setIsAnimating(true);
    setShowTooltip(true);

    if (isFollowed) {
      unfollowUser(currentUser.id, userId);
    } else {
      followUser(currentUser.id, userId);
    }

    toast({
      title: isFollowed ? "Unfollowed" : "Following",
      description: isFollowed ? "You are no longer following this distributing franchise" : "You are now following this distributing franchise",
    });

    tooltipTimeout.current = setTimeout(() => {
      setShowTooltip(false);
      setIsAnimating(false);
    }, 1000);
  };

  const handleTeamUp = () => {
    if (!currentUser) return;

    setIsAnimating(true);
    setShowTooltip(true);

    if (isTeamedUp) {
      unteamUser(currentUser.id, userId);
    } else {
      teamUpUser(currentUser.id, userId);
    }

    toast({
      title: isTeamedUp ? "Team Disbanded" : "Teamed Up!",
      description: isTeamedUp ? "You are no longer teammates" : "You are now teammates",
    });

    tooltipTimeout.current = setTimeout(() => {
      setShowTooltip(false);
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="flex gap-2">
      <TooltipProvider>
        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={handleFollow}
              className={cn(
                "relative transition-all duration-300",
                isFollowed ? "bg-[#FFB080]/10 text-[#FFB080] hover:bg-[#FFB080]/20" : "",
                variant === 'ghost' && "hover:bg-[#FFB080]/10 hover:text-[#FFB080]"
              )}
            >
              <div className={cn(
                "relative transition-transform duration-300",
                isAnimating && "animate-bounce"
              )}>
                {isFollowed ? (
                  <Users className={cn(
                    "transition-all duration-300",
                    size === 'sm' ? "h-3 w-3" : "h-4 w-4",
                    "mr-2"
                  )} />
                ) : (
                  <UserPlus className={cn(
                    "transition-all duration-300",
                    size === 'sm' ? "h-3 w-3" : "h-4 w-4",
                    "mr-2"
                  )} />
                )}
              </div>
              {isFollowed ? "Following" : "Follow"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isFollowed ? "Juice by that! 🥂" : "Follow this distributing franchise"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip open={showTooltip}>
          <TooltipTrigger asChild>
            <Button
              variant={variant}
              size={size}
              onClick={handleTeamUp}
              className={cn(
                "relative transition-all duration-300",
                isTeamedUp ? "bg-green-100 text-green-600 hover:bg-green-200" : "",
                variant === 'ghost' && "hover:bg-green-100 hover:text-green-600"
              )}
            >
              <div className={cn(
                "relative transition-transform duration-300",
                isAnimating && "animate-bounce"
              )}>
                {isTeamedUp ? (
                  <Check className={cn(
                    "transition-all duration-300",
                    size === 'sm' ? "h-3 w-3" : "h-4 w-4",
                    "mr-2"
                  )} />
                ) : (
                  <HeartHandshake className={cn(
                    "transition-all duration-300",
                    size === 'sm' ? "h-3 w-3" : "h-4 w-4",
                    "mr-2"
                  )} />
                )}
              </div>
              {isTeamedUp ? "Teamed Up" : "Team Up"}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>{isTeamedUp ? "Juice by that! 🥂" : "Team up with this distributing franchise"}</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  );
}