import { useState } from 'react';
import { Shield, AlertTriangle } from 'lucide-react';
import { useAuth } from '@/lib/auth';
import { useToast } from '@/hooks/use-toast';
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface WebmasterDeleteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
}

export function WebmasterDeleteDialog({ 
  open, 
  onOpenChange, 
  onConfirm 
}: WebmasterDeleteDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [password, setPassword] = useState('');
  const [isVerifying, setIsVerifying] = useState(false);

  // Return null if not a webmaster account being deleted
  if (!user || user.role !== 'webmaster') {
    return null;
  }

  const handleConfirm = async () => {
    setIsVerifying(true);
    try {
      // Verify password against current user
      const isValid = password === 'admin123'; // In production, use proper password verification
      
      if (!isValid) {
        toast({
          title: "Authentication Failed",
          description: "Invalid password. Please try again.",
          variant: "destructive",
        });
        return;
      }

      onConfirm();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to verify credentials. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsVerifying(false);
      setPassword('');
    }
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <div className="flex items-center gap-2 text-destructive">
            <Shield className="h-5 w-5" />
            <AlertDialogTitle>Delete Webmaster Account</AlertDialogTitle>
          </div>
          <AlertDialogDescription asChild>
            <div className="space-y-4">
              <div className="flex items-start gap-4 p-4 bg-destructive/10 rounded-lg text-destructive">
                <AlertTriangle className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="space-y-1">
                  <span className="block font-semibold">Critical Action Warning</span>
                  <span className="block text-sm">
                    Deleting a webmaster account is a critical action that cannot be undone. 
                    This will permanently remove all associated permissions and access.
                  </span>
                </div>
              </div>
              
              <div className="space-y-4 pt-4">
                <div className="space-y-2">
                  <Label htmlFor="password">Confirm your password to continue</Label>
                  <Input
                    id="password"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full"
                  />
                </div>
              </div>
            </div>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <Button
            variant="outline"
            onClick={() => {
              onOpenChange(false);
              setPassword('');
            }}
          >
            Cancel
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!password || isVerifying}
          >
            {isVerifying ? "Verifying..." : "Delete Webmaster"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}