import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { UserTable } from './UserTable';
import { UserForm } from './UserForm';
import { WebmasterDeleteDialog } from './WebmasterDeleteDialog';
import { UserDeleteDialog } from './UserDeleteDialog';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useUserStore, useFranchiseStats } from '@/lib/store';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Plus, RefreshCw } from 'lucide-react';
import { Card } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import type { User } from '@/lib/types';

interface UserFormData {
  username: string;
  email: string;
  password: string;
  role: 'webmaster' | 'distributing_franchise' | 'customer';
  franchiseName?: string;
  isActive: boolean;
  activationStatus: 'pending' | 'active' | 'inactive';
  permissions: {
    canEditProducts: boolean;
    canAddProducts: boolean;
    canDeleteProducts: boolean;
  };
}

export function WebmasterDashboard() {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { users, addUser, updateUser, deleteUser, toggleUserStatus, updateUserActivity } = useUserStore();
  const { stats, lastRefresh, refreshStats, isLoading } = useFranchiseStats();
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Create a combined refresh function
  const refreshDashboard = useCallback(() => {
    try {
      // Refresh franchise stats
      refreshStats();

      // Update user activity statuses
      users.forEach(user => {
        if (user.role !== 'webmaster') {
          const lastActive = new Date(user.lastActive);
          const isOnline = (new Date().getTime() - lastActive.getTime()) < 5 * 60 * 1000; // 5 minutes threshold
          updateUserActivity(user.username, isOnline);
        }
      });
    } catch (error) {
      console.error('Error refreshing dashboard:', error);
      toast({
        title: "Error",
        description: "Failed to refresh dashboard data",
        variant: "destructive",
      });
    }
  }, [refreshStats, users, updateUserActivity, toast]);

  useEffect(() => {
    // Initial load of stats and user activity
    refreshDashboard();
  }, [refreshDashboard]);

  const handleAddUser = async (data: UserFormData) => {
    try {
      // Add default values for new user
      const newUser: User = {
        ...data,
        id: crypto.randomUUID(),
        lastActive: new Date().toISOString(),
        isOnline: true,
        teammates: [],
        followers: [],
        following: [],
      };
      
      await addUser(newUser);
      setIsAddDialogOpen(false);
      toast({
        title: "Success",
        description: "User added successfully",
      });
    } catch (error) {
      console.error('Error adding user:', error);
      toast({
        title: "Error",
        description: "Failed to add user",
        variant: "destructive",
      });
    }
  };

  const handleEditUser = async (data: Partial<UserFormData>) => {
    if (!selectedUser) return;
    
    try {
      await updateUser(selectedUser.username, data);
      setIsEditDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "User updated successfully",
      });
    } catch (error) {
      console.error('Error updating user:', error);
      toast({
        title: "Error",
        description: "Failed to update user",
        variant: "destructive",
      });
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUser(selectedUser.username);
      setIsDeleteDialogOpen(false);
      setSelectedUser(null);
      toast({
        title: "Success",
        description: "User deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting user:', error);
      toast({
        title: "Error",
        description: "Failed to delete user",
        variant: "destructive",
      });
    }
  };

  const handleToggleStatus = async (username: string, currentStatus: boolean) => {
    try {
      await toggleUserStatus(username);
      toast({
        title: "Success",
        description: `User ${currentStatus ? 'deactivated' : 'activated'} successfully`,
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      toast({
        title: "Error",
        description: "Failed to toggle user status",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">User Management</h1>
            <p className="text-muted-foreground">
              Manage user accounts and permissions
            </p>
          </div>
          <Button onClick={() => setIsAddDialogOpen(true)}>
            <Plus className="h-4 w-4 mr-2" />
            Add User
          </Button>
        </div>

        {/* Franchise Stats */}
        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Active Franchises</h3>
                <p className="text-3xl font-bold mt-2">{stats.activeFranchises}</p>
              </div>
              <div className="text-sm text-muted-foreground">
                {lastRefresh && (
                  <p>Last updated {formatDistanceToNow(new Date(lastRefresh), { addSuffix: true })}</p>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500"></span>
              {stats.onlineFranchises} franchises currently online
            </div>
          </Card>

          <Card className="p-6 relative">
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="text-lg font-semibold">Total Franchises</h3>
                <p className="text-3xl font-bold mt-2">{stats.totalFranchises}</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={refreshDashboard}
                disabled={isLoading}
                className="gap-2"
              >
                <RefreshCw className={cn(
                  "h-4 w-4",
                  isLoading && "animate-spin"
                )} />
                Refresh Stats
              </Button>
            </div>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="inline-block w-2 h-2 rounded-full bg-orange-500"></span>
              {stats.pendingFranchises} pending activation
            </div>
          </Card>
        </div>
      </div>

      {/* Active Franchises Table */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">Active Franchises</h2>
        <p className="text-sm text-muted-foreground">Currently active and online franchises</p>
        <UserTable
          users={users.filter(user => 
            user.role === 'distributing_franchise' && 
            user.isActive && 
            user.isOnline
          )}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsEditDialogOpen(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setIsDeleteDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* All Users Table */}
      <div className="space-y-2">
        <h2 className="text-xl font-semibold">All Users</h2>
        <p className="text-sm text-muted-foreground">Complete list of all users in the system</p>
        <UserTable
          users={users}
          onEdit={(user) => {
            setSelectedUser(user);
            setIsEditDialogOpen(true);
          }}
          onDelete={(user) => {
            setSelectedUser(user);
            setIsDeleteDialogOpen(true);
          }}
          onToggleStatus={handleToggleStatus}
        />
      </div>

      {/* Add User Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New User</DialogTitle>
          </DialogHeader>
          <UserForm onSubmit={handleAddUser} />
        </DialogContent>
      </Dialog>

      {/* Edit User Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit User</DialogTitle>
          </DialogHeader>
          <UserForm 
            onSubmit={handleEditUser} 
            defaultValues={selectedUser} 
          />
        </DialogContent>
      </Dialog>

      {/* Delete User Dialog - Conditional Rendering */}
      {selectedUser?.role === 'webmaster' ? (
        <WebmasterDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteUser}
        />
      ) : (
        <UserDeleteDialog
          open={isDeleteDialogOpen}
          onOpenChange={setIsDeleteDialogOpen}
          onConfirm={handleDeleteUser}
          username={selectedUser?.username}
        />
      )}
    </div>
  );
}