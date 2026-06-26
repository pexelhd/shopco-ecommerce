import { ShoppingBag, Package, DollarSign } from 'lucide-react';
import StatsCard from '@/components/admin/StatsCard';
import OrderStatusBadge from '@/components/admin/OrderStatusBadge';
import Table from '@/components/ui/Table';
import Spinner from '@/components/ui/Spinner';
import Card from '@/components/ui/Card';
import { useOrders } from '@/hooks/useOrders';
import { useProducts } from '@/hooks/useProducts';
import { Link } from 'react-router-dom';

export default function DashboardPage() {
  const { data: ordersData, isLoading: ordersLoading } = useOrders({ limit: 100 });
  const { data: productsData, isLoading: productsLoading } = useProducts({ limit: 1 });

  const orders = ordersData?.data || [];
  const totalOrders = ordersData?.pagination?.total || 0;
  const totalRevenue = orders.reduce((sum, o) => sum + o.total_amount, 0);
  const totalProducts = productsData?.pagination?.total || 0;
  const recentOrders = orders.slice(0, 5);

  if (ordersLoading || productsLoading) {
    return <div className="flex justify-center py-20"><Spinner size="lg" /></div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatsCard label="Total Orders" value={totalOrders} icon={ShoppingBag} color="blue" />
        <StatsCard label="Total Revenue" value={`$${totalRevenue.toFixed(2)}`} icon={DollarSign} color="green" />
        <StatsCard label="Products" value={totalProducts} icon={Package} color="gold" />
      </div>

      <Card>
        <div className="p-4 border-b flex items-center justify-between">
          <h2 className="font-semibold text-slate-800">Recent Orders</h2>
          <Link to="/admin/orders" className="text-sm text-gold hover:underline">View all →</Link>
        </div>
        <Table headers={['Order #', 'Customer', 'Amount', 'Status', 'Date']}>
          {recentOrders.map((order) => (
            <tr key={order.id} className="hover:bg-slate-50">
              <td className="px-4 py-3">
                <Link to={`/admin/orders/${order.id}`} className="font-medium text-gold hover:underline">#{order.id}</Link>
              </td>
              <td className="px-4 py-3 text-slate-700">{order.customer_name}</td>
              <td className="px-4 py-3 font-medium">${order.total_amount.toFixed(2)}</td>
              <td className="px-4 py-3"><OrderStatusBadge status={order.status} /></td>
              <td className="px-4 py-3 text-slate-500 text-sm">{new Date(order.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
          {recentOrders.length === 0 && (
            <tr><td colSpan={5} className="px-4 py-8 text-center text-slate-400">No orders yet</td></tr>
          )}
        </Table>
      </Card>
    </div>
  );
}
