import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ImageUploadFieldProps {
  form: UseFormReturn<any>;
  previewImage: string;
  onImageChange: (url: string) => void;
}

export function ImageUploadField({ form, previewImage, onImageChange }: ImageUploadFieldProps) {
  return (
    <div className="space-y-4">
      <FormLabel>Product Image</FormLabel>
      <div className={cn(
        "aspect-square rounded-lg border-2 border-dashed",
        "bg-muted/5",
        previewImage ? "border-muted" : "border-muted-foreground/25"
      )}>
        {previewImage ? (
          <div className="relative h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg"
            />
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="absolute top-2 right-2"
              onClick={() => onImageChange('')}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <Upload className="h-8 w-8 mb-2" />
            <p className="text-sm font-medium">Upload product image</p>
            <p className="text-xs mt-1">Recommended size: 800x800px</p>
          </div>
        )}
      </div>
      <FormField
        control={form.control}
        name="image"
        render={({ field }) => (
          <FormItem>
            <FormControl>
              <Input
                {...field}
                placeholder="Enter image URL..."
                onChange={(e) => onImageChange(e.target.value)}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}