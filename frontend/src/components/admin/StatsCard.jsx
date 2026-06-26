import Card from '@/components/ui/Card';

export default function StatsCard({ label, value, icon: Icon, color = 'gold' }) {
  const colors = { gold: 'bg-gold-light text-amber-700', blue: 'bg-blue-100 text-blue-700', green: 'bg-green-100 text-green-700' };
  return (
    <Card className="p-5 flex items-center gap-4">
      <div className={`p-3 rounded-xl ${colors[color]}`}>
        <Icon size={24} />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-800">{value}</p>
        <p className="text-sm text-slate-500">{label}</p>
      </div>
    </Card>
  );
}
