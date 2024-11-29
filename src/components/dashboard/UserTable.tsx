import { Eye, EyeOff, Pencil, Trash2, CheckCircle2, XCircle, Shield, Store, Clock, MinusCircle, MoreVertical, Edit, Star, Search, Filter, ChevronDown, ChevronUp, ArrowUpDown } from 'lucide-react';
import { User } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { formatDistanceToNow } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useState, useMemo } from 'react';

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (username: string, currentStatus: boolean) => void;
  isWebmaster: boolean;
  currentUser?: User;
}

type SortField = 'username' | 'email' | 'role' | 'lastActive';
type SortOrder = 'asc' | 'desc';

interface SortConfig {
  field: SortField;
  order: SortOrder;
}

const getRoleBadgeVariant = (role: User['role']) => {
  switch (role) {
    case 'webmaster':
      return 'bg-gradient-to-r from-amber-500/10 to-orange-500/10 text-orange-700 hover:from-amber-500/20 hover:to-orange-500/20';
    case 'distributing_franchise':
      return 'bg-gradient-to-r from-blue-500/10 to-indigo-500/10 text-indigo-700 hover:from-blue-500/20 hover:to-indigo-500/20';
    default:
      return 'bg-gradient-to-r from-gray-500/10 to-slate-500/10 text-slate-700 hover:from-gray-500/20 hover:to-slate-500/20';
  }
};

const getRoleIcon = (role: User['role']) => {
  switch (role) {
    case 'webmaster':
      return Shield;
    case 'distributing_franchise':
      return Store;
    default:
      return Shield;
  }
};

const getRoleDisplay = (role: User['role']) => {
  switch (role) {
    case 'webmaster':
      return 'Webmaster';
    case 'distributing_franchise':
      return 'Distributing Franchise';
    default:
      return role;
  }
};

const getActivityStatus = (user: User) => {
  if (user.activationStatus === 'pending') {
    return {
      text: 'Pending Activation',
      icon: Clock,
      color: 'text-yellow-500'
    };
  }

  if (!user.isActive) {
    return {
      text: 'Deactivated',
      icon: XCircle,
      color: 'text-destructive'
    };
  }

  if (user.role === 'webmaster') {
    return {
      text: 'Admin Console',
      icon: Shield,
      color: 'text-orange-500'
    };
  }

  return {
    text: user.isOnline ? 'Online' : 'Offline',
    icon: user.isOnline ? CheckCircle2 : MinusCircle,
    color: user.isOnline ? 'text-green-500' : 'text-muted-foreground'
  };
};

export function UserTable({ users, onEdit, onDelete, onToggleStatus, isWebmaster, currentUser }: UserTableProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState<User['role'] | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [sortConfig, setSortConfig] = useState<SortConfig>({ field: 'username', order: 'asc' });

  const handleSort = (field: SortField) => {
    setSortConfig(current => ({
      field,
      order: current.field === field && current.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const filteredAndSortedUsers = useMemo(() => {
    return users
      .filter(user => {
        const matchesSearch = (
          user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.franchiseName?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        const matchesRole = roleFilter === 'all' || user.role === roleFilter;
        const matchesStatus = statusFilter === 'all' || 
          (statusFilter === 'active' && user.isActive) ||
          (statusFilter === 'inactive' && !user.isActive);
        
        return matchesSearch && matchesRole && matchesStatus;
      })
      .sort((a, b) => {
        const order = sortConfig.order === 'asc' ? 1 : -1;
        switch (sortConfig.field) {
          case 'username':
            return order * a.username.localeCompare(b.username);
          case 'email':
            return order * a.email.localeCompare(b.email);
          case 'role':
            return order * getRoleDisplay(a.role).localeCompare(getRoleDisplay(b.role));
          case 'lastActive':
            return order * (new Date(a.lastActive).getTime() - new Date(b.lastActive).getTime());
          default:
            return 0;
        }
      });
  }, [users, searchTerm, roleFilter, statusFilter, sortConfig]);

  const getSortIcon = (field: SortField) => {
    if (sortConfig.field !== field) return <ArrowUpDown className="h-4 w-4" />;
    return sortConfig.order === 'asc' ? 
      <ChevronUp className="h-4 w-4" /> : 
      <ChevronDown className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search users..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-4">
          <Select value={roleFilter} onValueChange={(value: User['role'] | 'all') => setRoleFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Roles</SelectItem>
              <SelectItem value="webmaster">Webmaster</SelectItem>
              <SelectItem value="distributing_franchise">Franchise</SelectItem>
              <SelectItem value="customer">Customer</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={(value: 'all' | 'active' | 'inactive') => setStatusFilter(value)}>
            <SelectTrigger className="w-[180px]">
              <Filter className="w-4 h-4 mr-2" />
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="inactive">Inactive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-xl border bg-card">
        <div className="max-h-[400px] overflow-y-auto">
          <Table>
          <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
            <TableRow className="hover:bg-muted/70 transition-colors">
              <TableHead 
                className="w-[250px] cursor-pointer"
                onClick={() => handleSort('username')}
              >
                <div className="flex items-center gap-2">
                  User
                  {getSortIcon('username')}
                </div>
              </TableHead>
              <TableHead 
                className="w-[250px] cursor-pointer"
                onClick={() => handleSort('email')}
              >
                <div className="flex items-center gap-2">
                  Email
                  {getSortIcon('email')}
                </div>
              </TableHead>
              <TableHead
                className="cursor-pointer"
                onClick={() => handleSort('role')}
              >
                <div className="flex items-center gap-2">
                  Role
                  {getSortIcon('role')}
                </div>
              </TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right sticky right-0 bg-muted/50 backdrop-blur-sm w-[200px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAndSortedUsers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  {searchTerm || roleFilter !== 'all' || statusFilter !== 'all'
                    ? "No users match your search criteria"
                    : "No users found"}
                </TableCell>
              </TableRow>
            ) : (
              filteredAndSortedUsers.map((user) => {
                const RoleIcon = getRoleIcon(user.role);
                const activityStatus = getActivityStatus(user);
                const ActivityIcon = activityStatus.icon;

                return (
                  <TableRow 
                    key={user.id}
                    className={cn(
                      "group transition-all duration-200",
                      user.role === 'webmaster' 
                        ? "hover:bg-orange-50/50 bg-orange-50/20" 
                        : "hover:bg-muted/50"
                    )}
                  >
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className={cn(
                          "h-10 w-10 ring-2 transition-all duration-200",
                          user.role === 'webmaster' 
                            ? "ring-orange-200 group-hover:ring-orange-300"
                            : "ring-blue-200 group-hover:ring-blue-300"
                        )}>
                          {user.avatar ? (
                            <AvatarImage src={user.avatar} alt={user.username} />
                          ) : (
                            <AvatarFallback className={cn(
                              "text-lg font-semibold",
                              user.role === 'webmaster'
                                ? "bg-orange-100 text-orange-700"
                                : "bg-blue-100 text-blue-700"
                            )}>
                              {user.username[0].toUpperCase()}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div>
                          <p className="font-medium text-foreground/90 group-hover:text-foreground transition-colors">
                            {user.username}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            {user.franchiseName || 'No franchise name'}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-muted-foreground group-hover:text-foreground/90 transition-colors">
                      {user.email}
                    </TableCell>
                    <TableCell>
                      <Badge 
                        variant="secondary"
                        className={cn(
                          "transition-all duration-200 font-medium",
                          getRoleBadgeVariant(user.role)
                        )}
                      >
                        <RoleIcon className="w-3 h-3 mr-1" />
                        {getRoleDisplay(user.role)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className={cn(
                        "flex items-center gap-2",
                        activityStatus.color
                      )}>
                        {user.activationStatus !== 'pending' && user.isActive && (
                          <span className="relative flex h-3 w-3">
                            {user.isOnline ? (
                              <>
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
                              </>
                            ) : (
                              <span className="relative inline-flex rounded-full h-3 w-3 bg-gray-300"></span>
                            )}
                          </span>
                        )}
                        {user.activationStatus === 'pending' && (
                          <span className="relative flex h-3 w-3">
                            <span className="animate-pulse absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                            <span className="relative inline-flex rounded-full h-3 w-3 bg-yellow-500"></span>
                          </span>
                        )}
                        <ActivityIcon className="h-4 w-4" />
                        <span className="font-medium">{activityStatus.text}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={user.isActive}
                          onCheckedChange={() => onToggleStatus(user.username, user.isActive)}
                          className={cn(
                            "transition-all duration-300",
                            user.isActive 
                              ? user.role === 'webmaster'
                                ? "bg-orange-500"
                                : "bg-blue-500"
                              : "bg-muted"
                          )}
                        />
                        <span className={cn(
                          "text-sm font-medium flex items-center gap-1 transition-colors",
                          user.isActive 
                            ? user.role === 'webmaster'
                              ? "text-orange-600"
                              : "text-blue-600" 
                            : "text-muted-foreground"
                        )}>
                          {user.isActive ? (
                            <>
                              <CheckCircle2 className="w-4 h-4" />
                              Active
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4" />
                              Inactive
                            </>
                          )}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right sticky right-0 bg-background/80 backdrop-blur-sm">
                      <div className="flex items-center justify-end gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className={cn(
                                "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity",
                                "hover:bg-gray-50"
                              )}
                            >
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48">
                            {(isWebmaster || currentUser?.id === user.id) && (
                              <DropdownMenuItem 
                                onClick={() => onEdit(user)}
                                className="hover:bg-blue-50 hover:text-blue-600"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit User
                              </DropdownMenuItem>
                            )}
                            
                            {isWebmaster && user.role !== 'webmaster' && (
                              <>
                                <DropdownMenuItem
                                  onClick={() => onDelete(user)}
                                  className="hover:bg-red-50 hover:text-red-600"
                                >
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                                
                                <DropdownMenuSeparator />
                                
                                <DropdownMenuItem 
                                  onClick={() => onToggleStatus(user.username, user.isActive)}
                                >
                                  {user.isActive ? (
                                    <>
                                      <XCircle className="h-4 w-4 mr-2" />
                                      Deactivate User
                                    </>
                                  ) : (
                                    <>
                                      <CheckCircle2 className="h-4 w-4 mr-2" />
                                      Activate User
                                    </>
                                  )}
                                </DropdownMenuItem>
                                
                                <DropdownMenuItem className="text-blue-600">
                                  <Shield className="h-4 w-4 mr-2" />
                                  Make Admin
                                </DropdownMenuItem>
                              </>
                            )}
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}