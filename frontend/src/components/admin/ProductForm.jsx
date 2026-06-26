import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import Input from '@/components/ui/Input';
import Select from '@/components/ui/Select';
import Button from '@/components/ui/Button';
import { useCategories } from '@/hooks/useProducts';

const schema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  price: z.coerce.number().positive('Price must be positive'),
  image_url: z.string().url('Must be a valid URL').or(z.literal('')).optional(),
  category_id: z.coerce.number().optional().nullable(),
  stock: z.coerce.number().int().min(0, 'Stock must be 0 or more'),
  is_active: z.boolean().optional(),
});

export default function ProductForm({ defaultValues, onSubmit, isPending, submitLabel = 'Save Product' }) {
  const { data: catData } = useCategories();
  const categories = catData?.data || [];

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: defaultValues || { stock: 0, is_active: true },
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 max-w-xl">
      <Input label="Product Name *" {...register('name')} error={errors.name?.message} />
      <div className="flex flex-col gap-1">
        <label className="text-sm font-medium text-slate-700">Description</label>
        <textarea
          {...register('description')}
          rows={4}
          className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-gold/50 focus:border-gold resize-none"
          placeholder="Product description..."
        />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Price ($) *" type="number" step="0.01" {...register('price')} error={errors.price?.message} />
        <Input label="Stock" type="number" {...register('stock')} error={errors.stock?.message} />
      </div>
      <Input label="Image URL" {...register('image_url')} error={errors.image_url?.message} placeholder="https://..." />
      <Select label="Category" {...register('category_id')}>
        <option value="">No category</option>
        {categories.map((c) => (
          <option key={c.id} value={c.id}>{c.name}</option>
        ))}
      </Select>
      <label className="flex items-center gap-2 text-sm cursor-pointer">
        <input type="checkbox" {...register('is_active')} className="w-4 h-4 accent-gold" />
        Active (visible in store)
      </label>
      <Button type="submit" disabled={isPending} className="w-full">
        {isPending ? 'Saving...' : submitLabel}
      </Button>
    </form>
  );
}
