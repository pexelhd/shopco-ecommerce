import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Eye } from 'lucide-react';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Select from '@/components/ui/Select';
import Spinner from '@/components/ui/Spinner';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import { useOrders } from '@/hooks/useOrders';

const STATUSES = ['', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'];

export default function OrdersListPage() {
  const [status, setStatus] = useState('');
  const [page, setPage] = useState(1);
  const { data, isLoading } = useOrders({ status, page, limit: 20 });

  const orders = data?.data || [];
  const pagination = data?.pagination;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <h1 className="text-2xl font-bold text-slate-800">Orders</h1>
        <div className="w-48">
          <Select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }}>
            {STATUSES.map((s) => (
              <option key={s} value={s}>{s ? s.charAt(0).toUpperCase() + s.slice(1) : 'All Statuses'}</option>
            ))}
          </Select>
        </div>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <Table headers={['Order #', 'Customer', 'Email', 'Total', 'Status', 'Date', 'Actions']}>
            {orders.map((order) => (
              <tr key={order.id} className="hover:bg-slate-50">
                <td className="px-4 py-3 font-medium">#{order.id}</td>
                <td className="px-4 py-3 text-slate-700">{order.customer_name}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">{order.customer_email}</td>
                <td className="px-4 py-3 font-medium text-gold">${order.total_amount.toFixed(2)}</td>
                <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
                <td className="px-4 py-3 text-slate-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <Link to={`/admin/orders/${order.id}`}>
                    <Button variant="ghost" size="sm"><Eye size={14} /> View</Button>
                  </Link>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No orders found</td></tr>
            )}
          </Table>
        )}
        {pagination && pagination.pages > 1 && (
          <div className="flex justify-center gap-2 p-4 border-t">
            <Button variant="secondary" size="sm" disabled={page <= 1} onClick={() => setPage(page - 1)}>Previous</Button>
            <span className="px-3 py-1.5 text-sm text-slate-600">{page} / {pagination.pages}</span>
            <Button variant="secondary" size="sm" disabled={page >= pagination.pages} onClick={() => setPage(page + 1)}>Next</Button>
          </div>
        )}
      </Card>
    </div>
  );
}
