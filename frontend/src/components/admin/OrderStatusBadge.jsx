import Badge from '@/components/ui/Badge';

const statusColors = {
  pending: 'gold',
  processing: 'blue',
  shipped: 'purple',
  delivered: 'green',
  cancelled: 'red',
};

export default function OrderStatusBadge({ status }) {
  return <Badge color={statusColors[status] || 'default'}>{status}</Badge>;
}
