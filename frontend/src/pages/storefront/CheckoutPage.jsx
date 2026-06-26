import { useNavigate, Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import OrderSummary from '@/components/storefront/OrderSummary';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useCart } from '@/hooks/useCart';
import { useCreateOrder } from '@/hooks/useOrders';

const schema = z.object({
  customer_name: z.string().min(1, 'Name is required'),
  customer_email: z.string().email('Invalid email'),
  customer_phone: z.string().optional(),
  line1: z.string().min(1, 'Address is required'),
  city: z.string().min(1, 'City is required'),
  state: z.string().min(1, 'State is required'),
  zip: z.string().min(1, 'ZIP is required'),
  notes: z.string().optional(),
});

export default function CheckoutPage() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateOrder();

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async (values) => {
    if (items.length === 0) return toast.error('Your cart is empty');
    try {
      const res = await mutateAsync({
        customer_name: values.customer_name,
        customer_email: values.customer_email,
        customer_phone: values.customer_phone || null,
        shipping_address: { line1: values.line1, city: values.city, state: values.state, zip: values.zip, country: 'US' },
        notes: values.notes || null,
        items: items.map((i) => ({ product_id: i.product_id, quantity: i.quantity })),
      });
      clearCart();
      navigate(`/order-confirmation/${res.data.id}`);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to place order');
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 max-w-5xl mx-auto px-4 py-8 w-full">
        <h1 className="text-2xl font-bold text-slate-800 mb-6">Checkout</h1>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <form onSubmit={handleSubmit(onSubmit)} className="lg:col-span-2 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-slate-800">Contact Information</h2>
              <Input label="Full Name *" {...register('customer_name')} error={errors.customer_name?.message} />
              <Input label="Email Address *" type="email" {...register('customer_email')} error={errors.customer_email?.message} />
              <Input label="Phone (optional)" type="tel" {...register('customer_phone')} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-slate-800">Shipping Address</h2>
              <Input label="Street Address *" {...register('line1')} error={errors.line1?.message} />
              <div className="grid grid-cols-2 gap-4">
                <Input label="City *" {...register('city')} error={errors.city?.message} />
                <Input label="State *" {...register('state')} error={errors.state?.message} />
              </div>
              <Input label="ZIP Code *" {...register('zip')} error={errors.zip?.message} />
            </div>
            <div className="bg-white rounded-xl border border-slate-200 p-6 space-y-4">
              <h2 className="font-semibold text-slate-800">Order Notes (optional)</h2>
              <textarea
                {...register('notes')}
                rows={3}
                placeholder="Special instructions for your order..."
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none"
              />
            </div>
            <Button type="submit" size="lg" className="w-full" disabled={isPending}>
              {isPending ? 'Placing Order...' : 'Place Order'}
            </Button>
          </form>
          <div>
            <OrderSummary items={items} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
