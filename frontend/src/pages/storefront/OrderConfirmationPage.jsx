import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package } from 'lucide-react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import Spinner from '@/components/ui/Spinner';
import Button from '@/components/ui/Button';
import { useOrder } from '@/hooks/useOrders';

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const { data, isLoading } = useOrder(orderId);
  const order = data?.data;

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-2xl mx-auto px-4 py-12 w-full">
        {isLoading && <div className="flex justify-center py-20"><Spinner size="lg" /></div>}
        {order && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <CheckCircle size={72} className="text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Order Confirmed!</h1>
            <p className="text-slate-600">
              Thank you, <strong>{order.customer_name}</strong>! Your order has been placed and we'll
              send updates to <strong>{order.customer_email}</strong>.
            </p>

            <div className="bg-white rounded-xl border border-slate-200 p-6 text-left space-y-4">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Order #</span>
                <span className="font-semibold">{order.id}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Status</span>
                <span className="font-semibold capitalize text-amber-600">{order.status}</span>
              </div>
              <div className="border-t pt-4 space-y-2">
                {order.items?.map((item) => (
                  <div key={item.id} className="flex justify-between text-sm text-slate-600">
                    <span>{item.product_name} × {item.quantity}</span>
                    <span>${item.subtotal.toFixed(2)}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-gold">${order.total_amount.toFixed(2)}</span>
              </div>
            </div>

            <div className="flex gap-4 justify-center">
              <Link to="/"><Button variant="secondary">Back to Home</Button></Link>
              <Link to="/products"><Button>Continue Shopping</Button></Link>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </div>
  );
}
