import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

interface ImageUploadProps {
  form: UseFormReturn<any>;
  previewImage: string;
  onImagePreview: (url: string) => void;
}

export function ImageUpload({ form, previewImage, onImagePreview }: ImageUploadProps) {
  return (
    <div className="space-y-4">
      <div className="font-medium text-sm flex items-center gap-2 text-muted-foreground">
        <Upload className="h-4 w-4" />
        Product Image
      </div>
      <div className={cn(
        "aspect-square rounded-lg border-2 border-dashed",
        "transition-all duration-300",
        "group hover:border-primary/50",
        previewImage ? "border-muted" : "border-muted-foreground/25"
      )}>
        {previewImage ? (
          <div className="relative h-full">
            <img
              src={previewImage}
              alt="Preview"
              className="w-full h-full object-cover rounded-lg transition-transform duration-300 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-all duration-300 flex items-center justify-center">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                onClick={() => onImagePreview('')}
                className="transform hover:scale-110 transition-transform duration-300"
              >
                <X className="h-4 w-4 mr-2" />
                Remove Image
              </Button>
            </div>
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-muted-foreground">
            <Upload className="h-8 w-8 mb-2 transition-transform duration-300 group-hover:scale-110 group-hover:text-primary" />
            <p className="text-sm font-medium group-hover:text-primary transition-colors">Click or drag to upload</p>
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
                placeholder="Or enter image URL..."
                onChange={(e) => onImagePreview(e.target.value)}
                className={cn(
                  "transition-all duration-300",
                  "focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2",
                  "placeholder:text-muted-foreground/50"
                )}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}