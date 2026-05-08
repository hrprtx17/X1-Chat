import CountUp from 'react-countup';

export default function StatCard({ label, value, suffix = '', icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'text-indigo-200 bg-indigo-400/15 border-indigo-300/30',
    blue: 'text-cyan-200 bg-cyan-400/15 border-cyan-300/30',
    purple: 'text-violet-200 bg-violet-400/15 border-violet-300/30',
    red: 'text-rose-200 bg-rose-400/15 border-rose-300/30',
  };

  return (
    <div className="glass-card p-5 surface-hover">
      <div className="flex items-center justify-between mb-3">
        <span className="text-slate-400 text-sm">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colors[color]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="text-3xl font-semibold text-white">
        <CountUp end={typeof value === 'number' ? value : 0} duration={2} />
        {suffix}
      </div>
    </div>
  );
}