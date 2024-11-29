import { 
  Home,
  TrendingUp,
  Users,
  MessageCircle,
  Bell,
  Bookmark,
  User,
  ArrowLeft,
  Clock,
  Zap
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useNavigate, useLocation } from 'react-router-dom';
import { useUserStore } from '@/lib/store';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

const navItems = [
  { 
    icon: Home, 
    label: 'Feed',
    path: '/dashboard/social'
  },
  { 
    icon: TrendingUp, 
    label: 'Popular',
    hasDropdown: true
  },
  { 
    icon: Users, 
    label: 'Network',
    path: '/dashboard/social/network'
  },
  { 
    icon: MessageCircle, 
    label: 'Discussions',
    path: '/dashboard/social/discussions'
  },
  { 
    icon: Bookmark, 
    label: 'Saved Posts',
    path: '/dashboard/social/saved'
  },
];

export function SideNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { currentUser } = useUserStore();

  const handleProfileClick = () => {
    if (currentUser) {
      navigate(`/dashboard/social/profile/${currentUser.username}`);
    }
  };

  const isProfileActive = location.pathname.includes('/dashboard/social/profile') &&
    (!location.pathname.split('/').pop() || location.pathname.includes(currentUser?.username || ''));

  return (
    <div className="w-64 pr-6">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/')}
        className="w-full justify-start mb-8 text-muted-foreground hover:text-foreground group"
      >
        <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
        Back to Dashboard
      </Button>

      <nav className="space-y-1">
        {navItems.map((item) => {
          if (item.hasDropdown) {
            return (
              <DropdownMenu key={item.label}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "w-full justify-start gap-3 h-12 relative group",
                      "hover:bg-[#FFB080]/10 transition-colors duration-200"
                    )}
                  >
                    <item.icon className="h-5 w-5 text-muted-foreground group-hover:text-[#FFB080]" />
                    <span className="font-medium text-muted-foreground group-hover:text-[#FFB080]">
                      {item.label}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent side="right" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/dashboard/social/popular/now')}>
                    <Zap className="h-4 w-4 mr-2" />
                    Popular Now
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/social/popular/today')}>
                    <Clock className="h-4 w-4 mr-2" />
                    Today's Top
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/dashboard/social/popular/all')}>
                    <TrendingUp className="h-4 w-4 mr-2" />
                    All Time Best
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            );
          }

          return (
            <Button
              key={item.label}
              variant="ghost"
              onClick={() => item.path && navigate(item.path)}
              className={cn(
                "w-full justify-start gap-3 h-12 relative group",
                "hover:bg-[#FFB080]/10 transition-colors duration-200",
                location.pathname === item.path && "bg-[#FFB080]/10 text-[#FFB080]"
              )}
            >
              <div className={cn(
                "absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#FFB080] transition-all duration-200",
                location.pathname === item.path ? "opacity-100" : "opacity-0 group-hover:opacity-100"
              )} />
              
              <item.icon className={cn(
                "h-5 w-5 transition-colors",
                location.pathname === item.path ? "text-[#FFB080]" : "text-muted-foreground group-hover:text-[#FFB080]"
              )} />
              
              <span className={cn(
                "font-medium transition-colors",
                location.pathname === item.path ? "text-[#FFB080]" : "text-muted-foreground group-hover:text-[#FFB080]"
              )}>
                {item.label}
              </span>
            </Button>
          );
        })}

        {/* Profile Button */}
        <Button
          variant="ghost"
          onClick={handleProfileClick}
          className={cn(
            "w-full justify-start gap-3 h-12 relative group mt-4",
            "hover:bg-[#FFB080]/10 transition-colors duration-200",
            isProfileActive && "bg-[#FFB080]/10 text-[#FFB080]"
          )}
        >
          <div className={cn(
            "absolute left-0 top-0 bottom-0 w-1 rounded-r-full bg-[#FFB080] transition-all duration-200",
            isProfileActive ? "opacity-100" : "opacity-0 group-hover:opacity-100"
          )} />
          
          <User className={cn(
            "h-5 w-5 transition-colors",
            isProfileActive ? "text-[#FFB080]" : "text-muted-foreground group-hover:text-[#FFB080]"
          )} />
          
          <span className={cn(
            "font-medium transition-colors",
            isProfileActive ? "text-[#FFB080]" : "text-muted-foreground group-hover:text-[#FFB080]"
          )}>
            Profile
          </span>
        </Button>
      </nav>
    </div>
  );
}