import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Users, 
  Search, 
  MessageCircle, 
  Store, 
  ArrowLeft,
  Filter,
  CheckCircle2,
  XCircle,
  HeartHandshake
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useUserStore } from '@/lib/store';
import { SideNav } from './SideNav';
import { TrendingSidebar } from './TrendingSidebar';
import { FollowButton } from './FollowButton';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatDistanceToNow } from 'date-fns';

export function NetworkPage() {
  const navigate = useNavigate();
  const { currentUser, users } = useUserStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  // Filter franchises only
  const franchises = users.filter(user => user.role === 'distributing_franchise');

  // Get teammates for current user
  const teammates = currentUser 
    ? franchises.filter(franchise => 
        franchise.teammates?.includes(currentUser.id) || 
        currentUser.teammates?.includes(franchise.id)
      )
    : [];

  // Apply search and status filters
  const filteredFranchises = franchises.filter(franchise => {
    const matchesSearch = franchise.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         franchise.franchiseName?.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (filter === 'online') return matchesSearch && franchise.isOnline;
    if (filter === 'offline') return matchesSearch && !franchise.isOnline;
    if (filter === 'teammates') return matchesSearch && teammates.some(t => t.id === franchise.id);
    return matchesSearch;
  });

  return (
    <div className="flex gap-6">
      {/* Left Sidebar */}
      <div className="hidden lg:block w-64 shrink-0">
        <div className="sticky top-24 h-[calc(100vh-6rem)] overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <SideNav />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-2xl mx-auto space-y-6">
        {/* Header */}
        <div>
          <Button 
            variant="ghost" 
            onClick={() => navigate('/dashboard/social')}
            className="text-muted-foreground hover:text-foreground group mb-2"
          >
            <ArrowLeft className="h-4 w-4 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to Feed
          </Button>
          <h1 className="text-2xl font-bold">Network</h1>
          <p className="text-muted-foreground">Connect and team up with other distributing franchises</p>
        </div>

        {/* Search and Filters */}
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Search franchises..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue placeholder="Filter" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Franchises</SelectItem>
              <SelectItem value="teammates">My Teams</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="offline">Offline</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Teams Summary */}
        {currentUser && teammates.length > 0 && (
          <Card className="p-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 rounded-full bg-[#FFB080]/10">
                <HeartHandshake className="h-5 w-5 text-[#FFB080]" />
              </div>
              <div>
                <h2 className="font-semibold">Your Teams</h2>
                <p className="text-sm text-muted-foreground">
                  {teammates.length} active teammate{teammates.length !== 1 ? 's' : ''}
                </p>
              </div>
            </div>
            <div className="flex -space-x-2 overflow-hidden">
              {teammates.map((teammate) => (
                <Avatar
                  key={teammate.id}
                  className="ring-2 ring-background cursor-pointer hover:scale-105 transition-transform"
                  onClick={() => navigate(`/dashboard/social/profile/${teammate.username}`)}
                >
                  {teammate.avatar ? (
                    <AvatarImage src={teammate.avatar} alt={teammate.franchiseName || teammate.username} />
                  ) : (
                    <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080]">
                      {teammate.username[0].toUpperCase()}
                    </AvatarFallback>
                  )}
                </Avatar>
              ))}
            </div>
          </Card>
        )}

        {/* Franchises Grid */}
        <div className="grid gap-4">
          {filteredFranchises.map((franchise) => (
            <Card 
              key={franchise.id} 
              className="p-4 hover:shadow-lg transition-all duration-200"
            >
              <div className="flex items-center gap-4 group">
                <div className="relative">
                  <Avatar className="h-12 w-12 ring-2 ring-primary/10 group-hover:ring-primary/30 transition-all duration-200">
                    {franchise.avatar ? (
                      <AvatarImage src={franchise.avatar} alt={franchise.franchiseName || franchise.username} />
                    ) : (
                      <AvatarFallback className="bg-[#FFB080]/10 text-[#FFB080] group-hover:bg-[#FFB080]/20 transition-colors">
                        {franchise.username[0].toUpperCase()}
                      </AvatarFallback>
                    )}
                  </Avatar>
                  {franchise.isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 rounded-full ring-2 ring-white" />
                  )}
                </div>

                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold group-hover:text-[#FFB080] transition-colors">
                      {franchise.franchiseName || franchise.username}
                    </h3>
                    {franchise.isOnline ? (
                      <div className="flex items-center gap-1 text-xs text-green-500">
                        <CheckCircle2 className="h-3 w-3" />
                        <span>Online</span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <XCircle className="h-3 w-3" />
                        <span>Last seen {formatDistanceToNow(new Date(franchise.lastActive), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">@{franchise.username}</p>
                </div>

                <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-[#FFB080]/10 hover:text-[#FFB080] transition-colors"
                    onClick={() => navigate(`/${franchise.franchiseName}/store`)}
                  >
                    <Store className="h-4 w-4" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon"
                    className="hover:bg-[#FFB080]/10 hover:text-[#FFB080] transition-colors"
                  >
                    <MessageCircle className="h-4 w-4" />
                  </Button>
                  {currentUser && currentUser.id !== franchise.id && (
                    <FollowButton userId={franchise.id} />
                  )}
                </div>
              </div>
            </Card>
          ))}

          {filteredFranchises.length === 0 && (
            <Card className="p-8 text-center">
              <Users className="h-8 w-8 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">No franchises found</p>
              <p className="text-muted-foreground">
                {searchTerm 
                  ? "No franchises match your search criteria" 
                  : filter === 'teammates'
                  ? "You haven't teamed up with any franchises yet. Team up to start collaborating!"
                  : "There are no franchises to display"}
              </p>
            </Card>
          )}
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