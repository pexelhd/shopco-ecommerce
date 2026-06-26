import { X, ShoppingCart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import Button from '@/components/ui/Button';
import CartItem from './CartItem';

export default function CartDrawer({ isOpen, onClose, onCheckout }) {
  const { items, totalPrice, clearCart } = useCart();

  return (
    <>
      {isOpen && <div className="fixed inset-0 bg-black/40 z-40" onClick={onClose} />}
      <div
        className={`fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}
      >
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="font-bold text-lg flex items-center gap-2">
            <ShoppingCart size={20} />
            Your Cart
          </h2>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-lg cursor-pointer">
            <X size={20} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {items.length === 0 ? (
            <div className="text-center text-slate-500 py-16">
              <ShoppingCart size={48} className="mx-auto mb-3 opacity-30" />
              <p>Your cart is empty</p>
            </div>
          ) : (
            items.map((item) => <CartItem key={item.product_id} item={item} />)
          )}
        </div>

        {items.length > 0 && (
          <div className="p-4 border-t space-y-3">
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-gold">${totalPrice.toFixed(2)}</span>
            </div>
            <Button className="w-full" size="lg" onClick={onCheckout}>
              Proceed to Checkout
            </Button>
            <Button variant="ghost" size="sm" className="w-full text-red-500 hover:bg-red-50" onClick={clearCart}>
              Clear Cart
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
