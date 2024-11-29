import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface FeaturesFieldProps {
  form: UseFormReturn<any>;
  newFeature: string;
  onNewFeatureChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

export function FeaturesField({
  form,
  newFeature,
  onNewFeatureChange,
  onAddFeature,
  onRemoveFeature
}: FeaturesFieldProps) {
  return (
    <div className="space-y-4">
      <FormLabel>Product Features</FormLabel>
      <div className="flex gap-2">
        <Input
          value={newFeature}
          onChange={(e) => onNewFeatureChange(e.target.value)}
          placeholder="Add a feature..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault();
              onAddFeature();
            }
          }}
        />
        <Button
          type="button"
          onClick={onAddFeature}
          disabled={!newFeature.trim()}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="h-[200px]">
        <div className="space-y-2 pr-4">
          {form.watch('features')?.map((feature: string, index: number) => (
            <div key={index} className="flex items-center gap-2">
              <div className="flex-1 p-2 bg-muted rounded-md">
                {feature}
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => onRemoveFeature(index)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
}