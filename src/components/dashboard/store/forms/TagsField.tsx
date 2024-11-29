import { Tag } from 'lucide-react';
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

const availableTags = ['Best Seller', 'New', 'Sale', 'Wholesale', 'Limited'];

interface TagsFieldProps {
  form: UseFormReturn<any>;
  onToggleTag: (tag: string) => void;
}

export function TagsField({ form, onToggleTag }: TagsFieldProps) {
  return (
    <FormField
      control={form.control}
      name="tags"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-4">
            <FormLabel className="flex items-center gap-2">
              <Tag className="h-4 w-4" />
              Product Tags
            </FormLabel>
            <div className="flex flex-wrap gap-2">
              {availableTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={field.value?.includes(tag) ? 'default' : 'outline'}
                  className="cursor-pointer"
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