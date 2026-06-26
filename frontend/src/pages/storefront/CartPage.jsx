import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import CartItem from '@/components/storefront/CartItem';
import OrderSummary from '@/components/storefront/OrderSummary';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';

export default function CartPage() {
  const { items } = useCart();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Shopping Cart</h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <ShoppingCart size={64} className="mx-auto mb-4 text-slate-300" />
            <p className="text-slate-500 mb-4">Your cart is empty</p>
            <Link to="/products"><Button>Browse Products</Button></Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-3">
              {items.map((item) => <CartItem key={item.product_id} item={item} />)}
            </div>
            <div className="space-y-4">
              <OrderSummary items={items} />
              <Link to="/checkout">
                <Button size="lg" className="w-full">Proceed to Checkout</Button>
              </Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
