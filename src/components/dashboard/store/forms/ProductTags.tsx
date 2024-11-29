import { Badge } from '@/components/ui/badge';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { cn } from '@/lib/utils';

const availableTags = ['Best Seller', 'New', 'Sale', 'Wholesale', 'Limited'];

interface ProductTagsProps {
  form: UseFormReturn<any>;
  onToggleTag: (tag: string) => void;
}

export function ProductTags({ form, onToggleTag }: ProductTagsProps) {
  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-4">
            <FormLabel>Product Tags</FormLabel>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={field.value?.includes(tag) ? 'default' : 'outline'}
                  className={cn(
                    "cursor-pointer transition-all duration-300 hover:scale-110",
                    field.value?.includes(tag) 
                      ? "hover:bg-primary/80" 
                      : "hover:bg-muted"
                  )}
                  onClick={() => onToggleTag(tag)}
                >
                  {tag}
                </Badge>
              ))}
            </div>
            <FormDescription>
              Click to toggle tags. Selected tags will be displayed on the product.
            </FormDescription>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
}