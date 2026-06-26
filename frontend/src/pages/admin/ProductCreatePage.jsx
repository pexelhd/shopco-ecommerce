import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { ArrowLeft } from 'lucide-react';
import ProductForm from '@/components/admin/ProductForm';
import { useCreateProduct } from '@/hooks/useProducts';

export default function ProductCreatePage() {
  const navigate = useNavigate();
  const { mutateAsync, isPending } = useCreateProduct();

  const onSubmit = async (data) => {
    try {
      await mutateAsync(data);
      toast.success('Product created!');
      navigate('/admin/products');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to create product');
    }
  };

  return (
    <div className="space-y-4">
      <button onClick={() => navigate(-1)} className="inline-flex items-center gap-1 text-sm text-slate-500 hover:text-gold cursor-pointer">
        <ArrowLeft size={16} /> Back
      </button>
      <h1 className="text-2xl font-bold text-slate-800">Add New Product</h1>
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <ProductForm onSubmit={onSubmit} isPending={isPending} submitLabel="Create Product" />
      </div>
    </div>
  );
}
