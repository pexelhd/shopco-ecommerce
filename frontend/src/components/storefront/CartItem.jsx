import { Minus, Plus, Trash2 } from 'lucide-react';
import { useCart } from '@/hooks/useCart';

export default function CartItem({ item }) {
  const { updateQty, removeItem } = useCart();

  return (
    <div className="flex gap-3 p-3 bg-slate-50 rounded-lg">
      <img
        src={item.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=100'}
        alt={item.name}
        className="w-16 h-16 object-cover rounded-lg shrink-0"
      />
      <div className="flex-1 min-w-0">
        <p className="font-medium text-sm text-slate-800 truncate">{item.name}</p>
        <p className="text-gold font-bold">${item.price.toFixed(2)}</p>
        <div className="flex items-center gap-2 mt-1">
          <button
            onClick={() => updateQty(item.product_id, item.quantity - 1)}
            className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
          >
            <Minus size={12} />
          </button>
          <span className="text-sm font-medium w-6 text-center">{item.quantity}</span>
          <button
            onClick={() => updateQty(item.product_id, item.quantity + 1)}
            className="w-6 h-6 rounded-full bg-white border border-slate-300 flex items-center justify-center hover:bg-slate-100 cursor-pointer"
          >
            <Plus size={12} />
          </button>
          <button
            onClick={() => removeItem(item.product_id)}
            className="ml-auto p-1 hover:text-red-500 transition-colors cursor-pointer"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}
