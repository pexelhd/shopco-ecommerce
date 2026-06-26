import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, User, MapPin, Mail, Phone } from 'lucide-react';
import { toast } from 'sonner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import Table from '@/components/ui/Table';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { useOrder, useUpdateOrderStatus } from '@/hooks/useOrders';

const STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrderDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useOrder(id);
  const { mutateAsync, isPending } = useUpdateOrderStatus();
  const [newStatus, setNewStatus] = useState('');

  const order = data?.data;
  const address = order ? (() => { try { return JSON.parse(order.shipping_address); } catch { return {}; } })() : {};

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === order?.status) return;
    try {
      await mutateAsync({ id, status: newStatus });
      toast.success('Status updated!');
      setNewStatus('');
    } catch {
      toast.error('Failed to update status');
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-gold cursor-pointer">
        <ArrowLeft size={16} /> Back to Orders
      </button>

      {isLoading && <div className="flex justify-center py-12"><Spinner size="lg" /></div>}

      {order && (
        <>
          <div className="flex items-center justify-between flex-wrap gap-3">
            <h1 className="text-2xl font-bold text-slate-800">Order #{order.id}</h1>
            <OrderStatusBadge status={order.status} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><User size={16} /> Customer</h2>
              <div className="text-sm space-y-1 text-slate-600">
                <p className="font-medium text-slate-800">{order.customer_name}</p>
                <p className="flex items-center gap-1"><Mail size={13} /> {order.customer_email}</p>
                {order.customer_phone && <p className="flex items-center gap-1"><Phone size={13} /> {order.customer_phone}</p>}
              </div>
            </Card>
            <Card className="p-5 space-y-3">
              <h2 className="font-semibold text-slate-700 flex items-center gap-2"><MapPin size={16} /> Shipping Address</h2>
              <div className="text-sm text-slate-600">
                <p>{address.line1}</p>
                <p>{address.city}, {address.state} {address.zip}</p>
                <p>{address.country}</p>
              </div>
            </Card>
          </div>

          <Card>
            <div className="p-4 border-b"><h2 className="font-semibold text-slate-700">Order Items</h2></div>
            <Table headers={['Product', 'Unit Price', 'Qty', 'Subtotal']}>
              {order.items?.map((item) => (
                <tr key={item.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{item.product_name}</td>
                  <td className="px-4 py-3 text-slate-600">${item.unit_price.toFixed(2)}</td>
                  <td className="px-4 py-3 text-slate-600">{item.quantity}</td>
                  <td className="px-4 py-3 font-medium text-gold">${item.subtotal.toFixed(2)}</td>
                </tr>
              ))}
            </Table>
            <div className="p-4 border-t flex justify-end">
              <div className="text-right">
                <p className="text-sm text-slate-500 mb-1">Order Total</p>
                <p className="text-2xl font-bold text-gold">${order.total_amount.toFixed(2)}</p>
              </div>
            </div>
          </Card>

          <Card className="p-5">
            <h2 className="font-semibold text-slate-700 mb-3">Update Status</h2>
            <div className="flex gap-3 items-end">
              <div className="flex-1 max-w-xs">
                <Select
                  label="New Status"
                  value={newStatus || order.status}
                  onChange={(e) => setNewStatus(e.target.value)}
                >
                  {STATUSES.map((s) => (
                    <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                  ))}
                </Select>
              </div>
              <Button onClick={handleStatusUpdate} disabled={isPending || !newStatus || newStatus === order.status}>
                {isPending ? 'Saving...' : 'Update Status'}
              </Button>
            </div>
            {order.notes && (
              <div className="mt-4 p-3 bg-slate-50 rounded-lg text-sm text-slate-600">
                <strong>Notes:</strong> {order.notes}
              </div>
            )}
          </Card>
        </>
      )}
    </div>
  );
}
