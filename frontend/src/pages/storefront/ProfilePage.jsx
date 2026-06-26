import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { User, Mail, Lock, Save, Calendar } from 'lucide-react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import Input from '@/components/ui/Input';
import Button from '@/components/ui/Button';
import { useUserAuth } from '@/context/UserAuthContext';
import { getProfile, updateProfile } from '@/lib/userApi';

const schema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email'),
  currentPassword: z.string().optional(),
  newPassword: z.string().optional(),
  confirmPassword: z.string().optional(),
}).refine((d) => {
  if (d.newPassword && d.newPassword !== d.confirmPassword) return false;
  return true;
}, { message: 'Passwords do not match', path: ['confirmPassword'] });

export default function ProfilePage() {
  const { user, login } = useUserAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('info');

  const initials = user ? user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2) : '?';

  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(schema),
  });

  useEffect(() => {
    getProfile().then((res) => {
      const data = res.data.data;
      setProfile(data);
      reset({ name: data.name, email: data.email, currentPassword: '', newPassword: '', confirmPassword: '' });
      setLoading(false);
    }).catch(() => {
      // Fallback to stored user data
      if (user) reset({ name: user.name, email: user.email });
      setLoading(false);
    });
  }, []); // eslint-disable-line

  const onSubmit = async (values) => {
    try {
      const payload = { name: values.name, email: values.email };
      if (values.newPassword) {
        payload.currentPassword = values.currentPassword;
        payload.password = values.newPassword;
      }
      const res = await updateProfile(payload);
      const updated = res.data.data;
      localStorage.setItem('customer', JSON.stringify(updated.user));
      localStorage.setItem('customer_token', updated.token);
      setProfile(updated.user);
      toast.success('Profile updated successfully!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to update profile');
    }
  };

  if (loading) return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-gold border-t-transparent rounded-full animate-spin" />
      </main>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        {/* Profile header */}
        <div className="bg-navy rounded-2xl p-6 mb-8">
          <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 text-center sm:text-left">
            <div className="w-20 h-20 rounded-full bg-gold flex items-center justify-center text-white text-2xl font-bold flex-shrink-0">
              {initials}
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-white break-words">{profile?.name || user?.name}</h1>
              <p className="text-slate-400 break-all">{profile?.email || user?.email}</p>
              {profile?.created_at && (
                <p className="text-slate-500 text-sm mt-1 flex items-center justify-center sm:justify-start gap-1">
                  <Calendar size={13} />
                  Member since {new Date(profile.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-white border border-slate-200 rounded-xl p-1 mb-6 w-fit">
          {['info', 'password'].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-5 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${
                activeTab === tab ? 'bg-navy text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              {tab === 'info' ? 'Personal Info' : 'Change Password'}
            </button>
          ))}
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          {activeTab === 'info' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2"><User size={18} className="text-gold" />Personal Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input label="Full Name" {...register('name')} error={errors.name?.message} />
                <Input label="Email Address" type="email" {...register('email')} error={errors.email?.message} />
              </div>
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                <Save size={16} />{isSubmitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </div>
          )}

          {activeTab === 'password' && (
            <div className="bg-white rounded-2xl border border-slate-200 p-6 space-y-5">
              <h2 className="font-semibold text-slate-800 flex items-center gap-2"><Lock size={18} className="text-gold" />Change Password</h2>
              <Input label="Current Password" type="password" {...register('currentPassword')} error={errors.currentPassword?.message} placeholder="Your current password" />
              <Input label="New Password" type="password" {...register('newPassword')} error={errors.newPassword?.message} placeholder="Min. 6 characters" />
              <Input label="Confirm New Password" type="password" {...register('confirmPassword')} error={errors.confirmPassword?.message} placeholder="Repeat new password" />
              <Button type="submit" disabled={isSubmitting} className="flex items-center gap-2">
                <Save size={16} />{isSubmitting ? 'Saving...' : 'Update Password'}
              </Button>
            </div>
          )}
        </form>
      </main>
      <Footer />
    </div>
  );
}
