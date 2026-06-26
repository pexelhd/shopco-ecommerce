import { useState } from 'react';
import { toast } from 'sonner';
import { Moon, Sun, Bell, Shield, Trash2, Monitor, ChevronRight } from 'lucide-react';
import Navbar from '@/components/storefront/Navbar';
import Footer from '@/components/storefront/Footer';
import Button from '@/components/ui/Button';
import { useDarkMode } from '@/context/DarkModeContext';
import { useUserAuth } from '@/context/UserAuthContext';
import { useNavigate } from 'react-router-dom';

function SettingRow({ label, description, children }) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100 last:border-0">
      <div className="min-w-0">
        <p className="text-sm font-medium text-slate-800">{label}</p>
        {description && <p className="text-xs text-slate-500 mt-0.5">{description}</p>}
      </div>
      <div className="flex-shrink-0">{children}</div>
    </div>
  );
}

function Toggle({ checked, onChange }) {
  return (
    <button
      onClick={() => onChange(!checked)}
      className={`relative w-11 h-6 rounded-full transition-colors cursor-pointer ${checked ? 'bg-gold' : 'bg-slate-300'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

function SectionCard({ icon: Icon, title, color, children }) {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden">
      <div className="flex items-center gap-3 px-6 py-4 border-b border-slate-100">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon size={18} className="text-white" />
        </div>
        <h2 className="font-semibold text-slate-800">{title}</h2>
      </div>
      <div className="px-6">{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const { dark, toggle } = useDarkMode();
  const { logout } = useUserAuth();
  const navigate = useNavigate();

  const [notifications, setNotifications] = useState({
    orderUpdates: true,
    promotions: false,
    newArrivals: true,
    accountAlerts: true,
  });

  const [privacy, setPrivacy] = useState({
    shareActivity: false,
    allowAnalytics: true,
    showProfile: true,
  });

  const [theme, setTheme] = useState('system');
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleNotif = (key) => {
    setNotifications((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Notification preference saved');
  };

  const handlePrivacy = (key) => {
    setPrivacy((prev) => ({ ...prev, [key]: !prev[key] }));
    toast.success('Privacy setting saved');
  };

  const handleTheme = (t) => {
    setTheme(t);
    if (t === 'dark' && !dark) toggle();
    if (t === 'light' && dark) toggle();
    toast.success(`Theme set to ${t}`);
  };

  const handleDeleteAccount = () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    logout();
    navigate('/login');
    toast.success('Account deleted');
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <Navbar />
      <main className="flex-1 max-w-3xl mx-auto w-full px-4 py-10 space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
          <p className="text-slate-500 text-sm mt-1">Manage your account preferences</p>
        </div>

        {/* Appearance */}
        <SectionCard icon={Monitor} title="Appearance" color="bg-indigo-500">
          <SettingRow label="Dark Mode" description="Switch between light and dark interface">
            <Toggle checked={dark} onChange={toggle} />
          </SettingRow>
          <SettingRow label="Theme" description="Choose your preferred color theme">
            <div className="flex gap-2">
              {['light', 'dark', 'system'].map((t) => (
                <button
                  key={t}
                  onClick={() => handleTheme(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize cursor-pointer ${
                    theme === t
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
                  }`}
                >
                  {t === 'light' ? <span className="flex items-center gap-1"><Sun size={12} />{t}</span>
                    : t === 'dark' ? <span className="flex items-center gap-1"><Moon size={12} />{t}</span>
                    : t}
                </button>
              ))}
            </div>
          </SettingRow>
        </SectionCard>

        {/* Notifications */}
        <SectionCard icon={Bell} title="Notifications" color="bg-amber-500">
          <SettingRow label="Order Updates" description="Get notified about your order status changes">
            <Toggle checked={notifications.orderUpdates} onChange={() => handleNotif('orderUpdates')} />
          </SettingRow>
          <SettingRow label="Promotions & Deals" description="Receive exclusive discounts and offers">
            <Toggle checked={notifications.promotions} onChange={() => handleNotif('promotions')} />
          </SettingRow>
          <SettingRow label="New Arrivals" description="Be the first to know about new products">
            <Toggle checked={notifications.newArrivals} onChange={() => handleNotif('newArrivals')} />
          </SettingRow>
          <SettingRow label="Account Alerts" description="Security and account activity notifications">
            <Toggle checked={notifications.accountAlerts} onChange={() => handleNotif('accountAlerts')} />
          </SettingRow>
        </SectionCard>

        {/* Privacy */}
        <SectionCard icon={Shield} title="Privacy" color="bg-green-500">
          <SettingRow label="Share Activity" description="Allow ShopCo to share your activity with partners">
            <Toggle checked={privacy.shareActivity} onChange={() => handlePrivacy('shareActivity')} />
          </SettingRow>
          <SettingRow label="Analytics" description="Help us improve by sharing anonymous usage data">
            <Toggle checked={privacy.allowAnalytics} onChange={() => handlePrivacy('allowAnalytics')} />
          </SettingRow>
          <SettingRow label="Public Profile" description="Allow others to see your profile information">
            <Toggle checked={privacy.showProfile} onChange={() => handlePrivacy('showProfile')} />
          </SettingRow>
          <SettingRow label="Privacy Policy" description="Read our full privacy policy">
            <button className="flex items-center gap-1 text-sm text-indigo-500 hover:underline">
              View <ChevronRight size={14} />
            </button>
          </SettingRow>
        </SectionCard>

        {/* Danger Zone */}
        <SectionCard icon={Trash2} title="Danger Zone" color="bg-red-500">
          <SettingRow label="Delete Account" description="Permanently delete your account and all data. This cannot be undone.">
            {!confirmDelete ? (
              <Button variant="danger" size="sm" onClick={() => setConfirmDelete(true)}>
                Delete
              </Button>
            ) : (
              <div className="flex items-center gap-2">
                <span className="text-xs text-red-500 font-medium">Are you sure?</span>
                <Button variant="danger" size="sm" onClick={handleDeleteAccount}>Yes, delete</Button>
                <Button variant="secondary" size="sm" onClick={() => setConfirmDelete(false)}>Cancel</Button>
              </div>
            )}
          </SettingRow>
        </SectionCard>
      </main>
      <Footer />
    </div>
  );
}
