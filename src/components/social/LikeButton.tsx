import { cn } from '@/lib/utils';
import { JuiceIcon } from '@/components/ui/icons';
import { Button } from '@/components/ui/button';
import { useState, useRef, useEffect } from 'react';

interface LikeButtonProps {
  isLiked: boolean;
  count: number;
  onLike: () => void;
  size?: 'sm' | 'default';
}

export function LikeButton({ isLiked, count, onLike, size = 'default' }: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false);
  const [showTooltip, setShowTooltip] = useState(false);
  const tooltipTimeout = useRef<NodeJS.Timeout>();

  useEffect(() => {
    return () => {
      if (tooltipTimeout.current) {
        clearTimeout(tooltipTimeout.current);
      }
    };
  }, []);

  const handleClick = () => {
    setIsAnimating(true);
    setShowTooltip(true);
    onLike();

    tooltipTimeout.current = setTimeout(() => {
      setShowTooltip(false);
      setIsAnimating(false);
    }, 1000);
  };

  return (
    <div className="relative inline-flex group" style={{ zIndex: 10 }}>
      <Button
        variant="ghost"
        size={size}
        className={cn(
          "relative transition-all duration-300 hover:bg-orange-50",
          "flex items-center gap-2 px-4",
          isLiked ? "text-orange-500" : "text-gray-500 hover:text-orange-500",
          size === 'sm' ? "h-8 text-xs" : "h-10 text-sm",
          "focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2",
          "disabled:pointer-events-none disabled:opacity-50"
        )}
        onClick={handleClick}
      >
        <div className={cn(
          "relative transition-transform duration-300",
          isAnimating && "animate-bounce"
        )}>
          <JuiceIcon
            className={cn(
              "transition-all duration-300",
              size === 'sm' ? "h-3 w-3" : "h-5 w-5",
              isLiked && "fill-orange-500",
              isLiked && isAnimating && "juice-icon liked",
              "group-hover:scale-110"
            )}
          />
          {isLiked && (
            <div className="absolute -inset-1 animate-pulse rounded-full bg-orange-100/50" />
          )}
        </div>
        <span className={cn(
          "font-medium transition-all duration-300",
          isLiked ? "text-orange-500" : "text-gray-600"
        )}>
          {count}
        </span>
      </Button>

      {showTooltip && (
        <div 
          className={cn(
            "absolute -top-12 left-1/2 -translate-x-1/2",
            "bg-orange-500 text-white",
            "px-4 py-2 rounded-full text-sm font-medium",
            "shadow-lg animate-tooltip-slide-up",
            "flex items-center gap-2",
            "z-50"
          )}
          style={{ zIndex: 50 }}
        >
          <span className="whitespace-nowrap">Juice by that! 🥂</span>
          <div 
            className="absolute -bottom-1 left-1/2 -translate-x-1/2 
                      border-4 border-transparent border-t-orange-500"
          />
        </div>
      )}
    </div>
  );
}