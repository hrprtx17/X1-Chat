import CountUp from 'react-countup';

export default function StatCard({ label, value, suffix = '', icon: Icon, color = 'primary' }) {
  const colors = {
    primary: 'text-primary bg-primary/10 border-primary/20',
    blue: 'text-blue-400 bg-blue-400/10 border-blue-400/20',
    purple: 'text-purple-400 bg-purple-400/10 border-purple-400/20',
    red: 'text-red-400 bg-red-400/10 border-red-400/20',
  };

  return (
    <div className="glass-card p-5 hover:border-primary/30 transition-all duration-300">
      <div className="flex items-center justify-between mb-3">
        <span className="text-gray-400 text-sm">{label}</span>
        {Icon && (
          <div className={`w-9 h-9 rounded-lg border flex items-center justify-center ${colors[color]}`}>
            <Icon size={16} />
          </div>
        )}
      </div>
      <div className="text-3xl font-bold text-white">
        <CountUp end={typeof value === 'number' ? value : 0} duration={2} />
        {suffix}
      </div>
    </div>
  );
}