import { ArrowLeft, Store, ExternalLink, Edit, Link } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface StoreHeaderProps {
  onBack: () => void;
  onView: () => void;
  onEdit: () => void;
  onPublicLink: () => void;
}

export function StoreHeader({ onBack, onView, onEdit, onPublicLink }: StoreHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <Button 
        variant="ghost" 
        onClick={onBack}
        className="gap-2"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Button>
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
            View Store
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onEdit}>
            <Edit className="h-4 w-4 mr-2" />
            Edit Store
          </DropdownMenuItem>
          <DropdownMenuItem onClick={onPublicLink}>
            <Link className="h-4 w-4 mr-2" />
            Public Store Link
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}