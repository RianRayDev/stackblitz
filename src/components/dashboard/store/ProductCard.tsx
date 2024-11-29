import { Star, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Product } from '@/lib/store';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDelete: (product: Product) => void;
  onSetFeatured: (product: Product) => void;
}

export function ProductCard({ product, onEdit, onDelete, onSetFeatured }: ProductCardProps) {
  return (
    <Card className="group hover:shadow-lg transition-all duration-200">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        <div className="absolute top-2 left-2 flex gap-2">
          {product.isFeatured && (
            <Badge className="bg-primary text-primary-foreground">
              Featured
            </Badge>
          )}
          {product.tags.map((tag) => (
            <Badge 
              key={tag}
              variant="secondary"
              className="bg-white/90 backdrop-blur-sm"
            >
              {tag}
            </Badge>
          ))}
        </div>
      </div>
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg">{product.name}</h3>
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
            <span className="text-sm">{product.rating}</span>
          </div>
        </div>
        <p className="text-muted-foreground text-sm mb-4">
          {product.description}
        </p>
        <div className="flex items-center justify-between">
          <p className="font-bold text-lg">₱{product.price.toLocaleString()}</p>
          <p className="text-sm text-muted-foreground">
            Stock: {product.stock}
          </p>
        </div>
        <div className="mt-4 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => onEdit(product)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => onDelete(product)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          {!product.isFeatured && (
            <Button
              variant="secondary"
              size="icon"
              onClick={() => onSetFeatured(product)}
            >
              <Star className="h-4 w-4" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}