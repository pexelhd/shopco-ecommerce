import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Pencil, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Table from '@/components/ui/Table';
import Badge from '@/components/ui/Badge';
import Spinner from '@/components/ui/Spinner';
import Modal from '@/components/ui/Modal';
import { useProducts, useDeleteProduct } from '@/hooks/useProducts';

export default function ProductsListPage() {
  const [page, setPage] = useState(1);
  const [deleteId, setDeleteId] = useState(null);
  const { data, isLoading } = useProducts({ page, limit: 20, is_active: '' });
  const { mutateAsync: deleteProduct, isPending: deleting } = useDeleteProduct();

  const products = data?.data || [];
  const pagination = data?.pagination;

  const handleDelete = async () => {
    try {
      await deleteProduct(deleteId);
      toast.success('Product deactivated');
      setDeleteId(null);
    } catch {
      toast.error('Failed to delete product');
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-slate-800">Products</h1>
        <Link to="/admin/products/new">
          <Button><Plus size={16} />Add Product</Button>
        </Link>
      </div>

      <Card>
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <Table headers={['Image', 'Name', 'Category', 'Price', 'Stock', 'Status', 'Actions']}>
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-slate-50">
                <td className="px-4 py-3">
                  <img src={p.image_url || 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=60'} alt="" className="w-10 h-10 object-cover rounded-lg" />
                </td>
                <td className="px-4 py-3 font-medium text-slate-800 max-w-xs truncate">{p.name}</td>
                <td className="px-4 py-3 text-slate-500 text-sm">{p.category_name || '—'}</td>
                <td className="px-4 py-3 font-medium text-gold">${p.price.toFixed(2)}</td>
                <td className="px-4 py-3 text-slate-700">{p.stock}</td>
                <td className="px-4 py-3">
                  <Badge color={p.is_active ? 'green' : 'red'}>{p.is_active ? 'Active' : 'Inactive'}</Badge>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <Link to={`/admin/products/${p.id}/edit`}>
                      <Button variant="ghost" size="sm"><Pencil size={14} /></Button>
                    </Link>
                    <Button variant="ghost" size="sm" className="text-red-500 hover:bg-red-50" onClick={() => setDeleteId(p.id)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-slate-400">No products found</td></tr>
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

      <Modal isOpen={!!deleteId} onClose={() => setDeleteId(null)} title="Deactivate Product">
        <p className="text-slate-600 mb-4">Are you sure you want to deactivate this product? It will be hidden from the store.</p>
        <div className="flex gap-3 justify-end">
          <Button variant="secondary" onClick={() => setDeleteId(null)}>Cancel</Button>
          <Button variant="danger" onClick={handleDelete} disabled={deleting}>
            {deleting ? 'Deactivating...' : 'Deactivate'}
          </Button>
        </div>
      </Modal>
    </div>
  );
}
