import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import Spinner from '@/components/ui/Spinner';
import { useProduct, useUpdateProduct } from '@/hooks/useProducts';

export default function ProductEditPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data, isLoading } = useProduct(id);
  const { mutateAsync, isPending } = useUpdateProduct();

  const onSubmit = async (formData) => {
    try {
      await mutateAsync({ id, data: formData });
      toast.success('Product updated!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update product');
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-gold cursor-pointer">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold text-slate-800">Edit Product</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        {isLoading ? (
          <div className="flex justify-center py-12"><Spinner size="lg" /></div>
        ) : (
          <ProductForm
            defaultValues={data?.data ? { ...data.data, is_active: Boolean(data.data.is_active) } : undefined}
            onSubmit={onSubmit}
            isPending={isPending}
            submitLabel="Update Product"
          />
        )}
      </div>
    </div>
  );
}
