import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import { toast } from 'sonner';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';

export default function ProductCard({ product }) {
  const { addItem } = useCart();

  const handleAdd = (e) => {
    e.preventDefault();
    addItem(product);
    toast.success(`"${product.name}" added to cart`);
  };

  return (
    <Link to={`/products/${product.id}`} className="group block">
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:shadow-md transition-shadow">
        <div className="aspect-square overflow-hidden bg-slate-100">
          <img
            src={product.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="p-4">
          {product.category_name && (
            <p className="text-xs text-slate-500 mb-1 uppercase tracking-wide">{product.category_name}</p>
          )}
          <h3 className="font-semibold text-slate-800 mb-2 line-clamp-2 group-hover:text-gold transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between gap-2">
            <span className="text-lg font-bold text-gold">${product.price.toFixed(2)}</span>
            <Button size="sm" onClick={handleAdd} className="shrink-0">
              <ShoppingCart size={14} />
              Add
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
