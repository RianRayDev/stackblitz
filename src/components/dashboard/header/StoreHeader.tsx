import { Store, ExternalLink, Edit } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StoreHeaderProps {
  franchiseName?: string | null;
  role: 'webmaster' | 'distributing_franchise';
  onView: () => void;
  onEdit: () => void;
}

export function StoreHeader({ franchiseName, role, onView, onEdit }: StoreHeaderProps) {
  return (
    <div className="flex justify-between items-start">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">
          {role === 'webmaster' ? (
            'Welcome back, Webmaster'
          ) : (
            `Welcome back, ${franchiseName}`
          )}
        </h1>
        <p className="text-muted-foreground">
          {role === 'webmaster' 
            ? "Manage and oversee all franchise operations"
            : "Here's what's happening with your store today"
          }
        </p>
      </div>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button className="bg-primary/10 text-primary hover:bg-primary/20 gap-2">
            <Store className="h-4 w-4" />
            Store Options
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuItem onClick={onView}>
            <ExternalLink className="h-4 w-4 mr-2" />
            View as Customer
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Store
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}