import { Eye, EyeOff, Pencil, Trash2, CheckCircle2, XCircle, Shield, Store, Clock, MinusCircle } from 'lucide-react';
import { User } from '@/lib/store';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
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

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
  onDelete: (user: User) => void;
  onToggleStatus: (username: string, currentStatus: boolean) => void;
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

export function UserTable({ users, onEdit, onDelete, onToggleStatus }: UserTableProps) {
  return (
    <div className="rounded-xl border bg-card">
      <div className="max-h-[400px] overflow-y-auto">
        <Table>
          <TableHeader className="sticky top-0 bg-muted/50 backdrop-blur-sm">
            <TableRow className="hover:bg-muted/70 transition-colors">
              <TableHead className="w-[250px]">User</TableHead>
              <TableHead className="w-[250px]">Email</TableHead>
              <TableHead>Role</TableHead>
              <TableHead>Activity</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right sticky right-0 bg-muted/50 backdrop-blur-sm">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {users.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  No users found
                </TableCell>
              </TableRow>
            ) : (
              users.map((user) => {
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
                      <div className="flex items-center justify-end gap-2">
                        {user.role !== 'webmaster' && (
                          <>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onEdit(user)}
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => onDelete(user)}
                              className="text-destructive hover:text-destructive"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
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
  );
}