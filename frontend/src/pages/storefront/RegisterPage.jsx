import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { Store, ShoppingBag, Tag, Truck, Star } from 'lucide-react';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUserAuth } from '@/context/UserAuthContext';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  confirmPassword: z.string(),
}).refine((d) => d.password === d.confirmPassword, {
  message: 'Passwords do not match',
  path: ['confirmPassword'],
});

export default function RegisterPage() {
  const { register: registerUser, user } = useUserAuth();
  const navigate = useNavigate();

  if (user) { navigate('/', { replace: true }); return null; }

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  const onSubmit = async ({ name, email, password }) => {
    try {
      await registerUser(name, email, password);
      toast.success('Account created! Welcome to ShopCo.');
      navigate('/');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel - branded */}
      <div className="hidden lg:flex lg:w-1/2 bg-navy flex-col justify-between p-12 relative overflow-hidden">
        {/* Background floating icons */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-10 left-8 opacity-5 text-white"><ShoppingBag size={120} /></div>
          <div className="absolute top-40 right-12 opacity-5 text-white"><Tag size={90} /></div>
          <div className="absolute bottom-32 left-16 opacity-5 text-white"><Truck size={100} /></div>
          <div className="absolute bottom-10 right-8 opacity-5 text-white"><Star size={80} /></div>
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-5 text-white"><Store size={200} /></div>
          <div className="absolute -top-20 -left-20 w-64 h-64 rounded-full bg-gold opacity-10" />
          <div className="absolute -bottom-20 -right-20 w-80 h-80 rounded-full bg-gold opacity-10" />
        </div>

        {/* Logo */}
        <div className="relative z-10 flex items-center gap-3 text-white">
          <div className="bg-gold p-2 rounded-xl">
            <Store size={28} className="text-white" />
          </div>
          <span className="text-2xl font-bold text-gold">ShopCo</span>
        </div>

        {/* Center content */}
        <div className="relative z-10 space-y-8">
          <div>
            <h2 className="text-4xl font-bold text-white leading-tight">
              Join ShopCo<br />
              <span className="text-gold">Today for Free.</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg">
              Create your account and start shopping thousands of quality products.
            </p>
          </div>

          <div className="space-y-4">
            {[
              { icon: ShoppingBag, text: 'Thousands of products across all categories' },
              { icon: Truck, text: 'Free shipping on orders over $50' },
              { icon: Tag, text: 'Exclusive deals and new arrivals every week' },
              { icon: Star, text: 'Top-rated products from trusted brands' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-slate-300">
                <div className="bg-gold/20 p-2 rounded-lg flex-shrink-0">
                  <Icon size={16} className="text-gold" />
                </div>
                <span className="text-sm">{text}</span>
              </div>
            ))}
          </div>
        </div>

        <p className="relative z-10 text-slate-500 text-sm">
          © 2026 ShopCo. All rights reserved.
        </p>
      </div>

      {/* Right panel - form */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 bg-slate-50">
        <div className="w-full max-w-sm space-y-8">
          {/* Mobile logo */}
          <div className="flex lg:hidden items-center justify-center gap-2">
            <div className="bg-gold p-2 rounded-xl">
              <Store size={24} className="text-white" />
            </div>
            <span className="text-xl font-bold text-gold">ShopCo</span>
          </div>

          <div>
            <h1 className="text-3xl font-bold text-slate-800">Create account</h1>
            <p className="text-slate-500 mt-1">Start shopping with ShopCo today</p>
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <Input label="Full Name" {...register('name')} error={errors.name?.message} placeholder="Jane Doe" />
            <Input label="Email address" type="email" {...register('email')} error={errors.email?.message} placeholder="you@example.com" />
            <Input label="Password" type="password" {...register('password')} error={errors.password?.message} placeholder="Min. 6 characters" />
            <Input label="Confirm Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} placeholder="••••••••" />
            <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'Creating account...' : 'Create Account'}
            </Button>
          </form>

          <p className="text-center text-sm text-slate-500">
            Already have an account?{' '}
            <Link to="/login" className="text-amber-600 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
