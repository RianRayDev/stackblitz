import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';

interface ProductFeaturesProps {
  form: UseFormReturn<any>;
  newFeature: string;
  onNewFeatureChange: (value: string) => void;
  onAddFeature: () => void;
  onRemoveFeature: (index: number) => void;
}

export function ProductFeatures({
  form,
  newFeature,
  onNewFeatureChange,
  onAddFeature,
  onRemoveFeature
}: ProductFeaturesProps) {
  return (
    <FormField
      control={form.control}
      name="features"
      render={({ field }) => (
        <FormItem>
          <div className="space-y-4">
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
                className="transition-all duration-300 focus:ring-2 focus:ring-primary"
              />
              <Button
                type="button"
                onClick={onAddFeature}
                disabled={!newFeature.trim()}
                className="transition-all duration-300 hover:scale-105"
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>
            <ScrollArea className="h-[400px] pr-4">
              <div className="space-y-2">
                {field.value?.map((feature: string, index: number) => (
                  <div 
                    key={index} 
                    className="flex items-center gap-2 group hover:scale-[1.02] transition-all duration-300"
                  >
                    <div className="flex-1 p-2 bg-muted rounded-md group-hover:bg-muted/70 transition-colors duration-300">
                      {feature}
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveFeature(index)}
                      className="opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-destructive/10 hover:text-destructive"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </div>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}